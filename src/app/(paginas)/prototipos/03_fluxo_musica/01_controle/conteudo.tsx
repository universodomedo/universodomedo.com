'use client';

import styles from './styles.module.css';

import { useCallback, useEffect, useState } from 'react';
import { FLUXO_MUSICA_FADES_CORTE, FLUXO_MUSICA_FADES_EMENDA, FLUXO_MUSICA_FADES_ENTRE_MUSICAS, type FluxoMusicaDto, type FluxoMusicaLigacaoDto } from 'types-nora-api';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectNivelVolumeEfetivo } from 'Redux/selectors/audioPaginaSelectors';
import { GANHO_POR_NIVEL_VOLUME } from 'Redux/slices/audioPaginaSlice';
import { calcularGanhoNormalizacao } from 'Uteis/Loudness/normalizacaoLoudness';
import FluxoDeMusica from 'Componentes/ElementosDeMusica/FluxoDeMusica/FluxoDeMusica';
import { useFluxoMusicaAudio, type FluxoMusicaFaixa } from 'Componentes/ElementosDeMusica/FluxoDeMusica/useFluxoMusicaAudio';
import { Componente_Selecionador__MusicaDeFundo } from 'Componentes/Selecionadores/Componente_Selecionador__MusicaDeFundo/Componente_Selecionador__MusicaDeFundo';

const SELECT_MUSICA_COMPLETA = { id: true, nome: true, arquivo: { id: true, caminhoArquivo: true }, montagem: { inicioMs: true, fimMs: true, blocos: { id: true, nome: true, inicioMs: true, fimMs: true } }, loudnessLufs: true, picoDbfs: true } as const;

// Fator do protótipo: espelha a "faixa única" do palco (música abaixo das vozes).
const FATOR_MUSICA = 0.5;

// Bancada ISOLADA do Controle de Música em tempo real: o mesmo componente e o mesmo motor de áudio do Palco,
// dirigidos por um MOTOR LOCAL de avanço (a regra replicada do PalcoFluxoService, aqui só para teste —
// em produção a autoridade é o servidor). Nada daqui toca o Palco nem o banco.
export function Componente_ConteudoPrototipo() {
    const nivelVolume = useAppSelector(selectNivelVolumeEfetivo);

    const [fluxo, setFluxo] = useState<FluxoMusicaDto>({ musicas: [], ligacoes: [], pulso: null });
    const [seqLigacao, setSeqLigacao] = useState(0);
    const [selecionando, setSelecionando] = useState(false);
    const [idPendente, setIdPendente] = useState<number | null>(null);

    // Carga da música trazida (blocos da montagem + nome) — o que no palco o servidor resolve, aqui o protótipo consulta.
    const consultaPendente = useNoraGraphQLRegistro('MusicaConfigurada', { props: { idMusica: idPendente ?? 0 }, pk: idPendente ?? 0, select: SELECT_MUSICA_COMPLETA, carregando: 'Carregando a música', mensagemErro: 'Não foi possível carregar a música', executarAoMontar: false });
    const recarregarPendente = consultaPendente.recarregar;

    useEffect(() => {
        if (idPendente == null) return;
        recarregarPendente();
    }, [idPendente, recarregarPendente]);

    useEffect(() => {
        const dados = consultaPendente.data;
        if (idPendente == null || dados?.id !== idPendente) return;
        setIdPendente(null);
        setFluxo(atual => {
            if (atual.musicas.some(m => m.idMusica === dados.id)) return atual;
            const blocos = dados.montagem.blocos.map(b => ({ id: b.id, nome: b.nome, inicioMs: b.inicioMs, fimMs: b.fimMs }));
            const novasLigacoes: FluxoMusicaLigacaoDto[] = blocos.slice(0, -1).map((b, i) => ({ id: `l${seqLigacao + i}`, deMusica: dados.id, deBloco: b.id, paraMusica: dados.id, paraBloco: blocos[i + 1].id, conectada: true, ...FLUXO_MUSICA_FADES_EMENDA }));
            setSeqLigacao(s => s + novasLigacoes.length);
            return { ...atual, musicas: [...atual.musicas, { idMusica: dados.id, nome: dados.nome, x: 60 + atual.musicas.length * 100, y: 40 + atual.musicas.length * 70, blocos }], ligacoes: [...atual.ligacoes, ...novasLigacoes] };
        });
    }, [consultaPendente.data, idPendente, seqLigacao]);

    // ── Motor LOCAL de avanço (réplica de teste da regra do servidor): fim do bloco → ligação conectada → novo pulso. ──
    useEffect(() => {
        const pulso = fluxo.pulso;
        if (!pulso) return;
        const bloco = fluxo.musicas.find(m => m.idMusica === pulso.idMusica)?.blocos.find(b => b.id === pulso.idBloco);
        if (!bloco) return;

        const restanteMs = Math.max(0, (bloco.fimMs - bloco.inicioMs) - (Date.now() - pulso.iniciadoEmTs));
        const timer = setTimeout(() => {
            setFluxo(atual => {
                if (atual.pulso !== pulso) return atual;
                const saida = atual.ligacoes.find(l => l.conectada && l.deMusica === pulso.idMusica && l.deBloco === pulso.idBloco);
                if (!saida) return { ...atual, pulso: null };
                return { ...atual, pulso: { idMusica: saida.paraMusica, idBloco: saida.paraBloco, iniciadoEmTs: Date.now(), fadeOutMs: saida.fadeOutMs, fadeInMs: saida.fadeInMs } };
            });
        }, restanteMs);
        return () => { clearTimeout(timer); };
    }, [fluxo]);

    // ── Ações do editor (mesma semântica do PalcoFluxoService, em estado local) ──
    const aoRemoverMusica = useCallback((idMusica: number) => {
        setFluxo(atual => ({ musicas: atual.musicas.filter(m => m.idMusica !== idMusica), ligacoes: atual.ligacoes.filter(l => l.deMusica !== idMusica && l.paraMusica !== idMusica), pulso: atual.pulso?.idMusica === idMusica ? null : atual.pulso }));
    }, []);

    const aoMoverMusica = useCallback((idMusica: number, x: number, y: number) => {
        setFluxo(atual => ({ ...atual, musicas: atual.musicas.map(m => m.idMusica === idMusica ? { ...m, x, y } : m) }));
    }, []);

    const aoCriarLigacao = useCallback((deMusica: number, deBloco: string, paraMusica: number, paraBloco: string) => {
        setFluxo(atual => {
            if (atual.ligacoes.some(l => l.deMusica === deMusica && l.deBloco === deBloco && l.paraMusica === paraMusica && l.paraBloco === paraBloco)) return atual;
            const fades = deMusica === paraMusica ? FLUXO_MUSICA_FADES_EMENDA : FLUXO_MUSICA_FADES_ENTRE_MUSICAS;
            const nova: FluxoMusicaLigacaoDto = { id: `l${seqLigacao}`, deMusica, deBloco, paraMusica, paraBloco, conectada: true, ...fades };
            setSeqLigacao(s => s + 1);
            // UMA saída conectada por bloco: conectar desconecta as irmãs.
            return { ...atual, ligacoes: [...atual.ligacoes.map(l => l.deMusica === deMusica && l.deBloco === deBloco ? { ...l, conectada: false } : l), nova] };
        });
    }, [seqLigacao]);

    const aoAlternarLigacao = useCallback((idLigacao: string) => {
        setFluxo(atual => {
            const alvo = atual.ligacoes.find(l => l.id === idLigacao);
            if (!alvo) return atual;
            const conectando = !alvo.conectada;
            return { ...atual, ligacoes: atual.ligacoes.map(l => l.id === idLigacao ? { ...l, conectada: conectando } : (conectando && l.deMusica === alvo.deMusica && l.deBloco === alvo.deBloco ? { ...l, conectada: false } : l)) };
        });
    }, []);

    const aoMoverPulso = useCallback((idMusica: number, idBloco: string) => {
        setFluxo(atual => ({ ...atual, pulso: { idMusica, idBloco, iniciadoEmTs: Date.now(), ...FLUXO_MUSICA_FADES_CORTE } }));
    }, []);

    const aoSilenciar = useCallback(() => { setFluxo(atual => ({ ...atual, pulso: null })); }, []);

    // ── Áudio real: mesma faixa/motor do palco (arquivo + normalização da música do pulso) ──
    const idMusicaPulso = fluxo.pulso?.idMusica ?? null;
    const consultaFaixa = useNoraGraphQLRegistro('MusicaConfigurada', { props: { idMusica: idMusicaPulso ?? 0 }, pk: idMusicaPulso ?? 0, select: SELECT_MUSICA_COMPLETA, carregando: 'Carregando a faixa', mensagemErro: 'Não foi possível carregar a faixa', executarAoMontar: false });
    const recarregarFaixa = consultaFaixa.recarregar;

    useEffect(() => {
        if (idMusicaPulso == null) return;
        recarregarFaixa();
    }, [idMusicaPulso, recarregarFaixa]);

    const dadosFaixa = idMusicaPulso != null && consultaFaixa.data?.id === idMusicaPulso ? consultaFaixa.data : null;
    const faixa: FluxoMusicaFaixa | null = dadosFaixa?.arquivo?.caminhoArquivo
        ? { idMusica: dadosFaixa.id, caminhoArquivo: dadosFaixa.arquivo.caminhoArquivo, ganhoNormalizacao: calcularGanhoNormalizacao(dadosFaixa.loudnessLufs ?? null, dadosFaixa.picoDbfs ?? null, GANHO_POR_NIVEL_VOLUME.MAXIMO) }
        : null;

    useFluxoMusicaAudio({ fluxo, faixa, volume: GANHO_POR_NIVEL_VOLUME[nivelVolume] * FATOR_MUSICA });

    return (
        <section className={styles.bancada}>
            {selecionando
                ? <div className={styles.selecionador}><Componente_Selecionador__MusicaDeFundo aoConfirmar={idMusica => { setIdPendente(idMusica); setSelecionando(false); }} aoCancelar={() => { setSelecionando(false); }} /></div>
                : <FluxoDeMusica fluxo={fluxo} processando={false} aoTrazerMusica={() => { setSelecionando(true); }} aoRemoverMusica={aoRemoverMusica} aoMoverMusica={aoMoverMusica} aoCriarLigacao={aoCriarLigacao} aoAlternarLigacao={aoAlternarLigacao} aoMoverPulso={aoMoverPulso} aoSilenciar={aoSilenciar} />
            }
        </section>
    );
};
