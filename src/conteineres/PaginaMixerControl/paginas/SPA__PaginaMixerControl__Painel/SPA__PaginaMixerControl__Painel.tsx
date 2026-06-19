'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { type Contexto__PaginaMixerControl__Props } from 'Contextos/Contexto__PaginaMixerControl/contexto';
import { getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader';
import FluxoLinearMixer, { type AmostraOndaAudioMixer, type AtualizacaoTrechoFluxoMixer, type TrechoFluxoMixer } from './componentes/FluxoLinearMixer/FluxoLinearMixer';
import styles from './styles.module.css';

const DURACAO_PADRAO_MIXER_MS = 108000;
const DURACAO_PADRAO_TRECHO_MS = 16000;
const DURACAO_MINIMA_TRECHO_MS = 1000;
const QUANTIDADE_AMOSTRAS_ONDA_AUDIO = 180;
const NOMES_PADRAO_TRECHOS = ['Intro', 'Bridge', 'Refrao', 'Outro'];

function calculaPosicaoSegundos(estado: NonNullable<Contexto__PaginaMixerControl__Props['estado']>): number {
    if (estado.status === 'PAUSADO' || estado.iniciadoEmMs === null) return estado.posicaoMs / 1000;
    return (estado.posicaoMs + Math.max(0, Date.now() - estado.iniciadoEmMs)) / 1000;
};

function normalizarTrechoFluxo(trecho: TrechoFluxoMixer, duracaoMs: number): TrechoFluxoMixer {
    const fimMaximoMs = Math.max(DURACAO_MINIMA_TRECHO_MS, duracaoMs);
    const inicioMaximoMs = Math.max(0, fimMaximoMs - DURACAO_MINIMA_TRECHO_MS);
    const inicioMs = Math.max(0, Math.min(inicioMaximoMs, Math.round(trecho.inicioMs)));
    const fimMs = Math.max(inicioMs + DURACAO_MINIMA_TRECHO_MS, Math.min(fimMaximoMs, Math.round(trecho.fimMs)));
    return { ...trecho, inicioMs, fimMs };
};

export default function SPA__PaginaMixerControl__Painel({ estado, erro, sincronizarEstado }: Contexto__PaginaMixerControl__Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const proximoIdTrechoRef = useRef(1);
    const srcAudio = estado?.faixa ? getImageUrl(estado.faixa.caminhoArquivo) : null;
    const [duracaoMs, setDuracaoMs] = useState(DURACAO_PADRAO_MIXER_MS);
    const [posicaoVisualMs, setPosicaoVisualMs] = useState(0);
    const [inicioUtilMs, setInicioUtilMs] = useState(0);
    const [trechos, setTrechos] = useState<TrechoFluxoMixer[]>([]);
    const [ondaAudio, setOndaAudio] = useState<AmostraOndaAudioMixer[]>([]);
    const [carregandoOndaAudio, setCarregandoOndaAudio] = useState(false);

    const atualizarPosicaoVisual = useCallback((posicaoMs: number): void => {
        const posicaoLimitadaMs = Math.max(0, Math.min(duracaoMs, Math.round(posicaoMs)));
        setPosicaoVisualMs(posicaoAtualMs => Math.abs(posicaoAtualMs - posicaoLimitadaMs) < 35 ? posicaoAtualMs : posicaoLimitadaMs);
    }, [duracaoMs]);

    const sincronizarPeloAudio = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio) return;
        sincronizarEstado(audio.paused ? 'PAUSADO' : 'TOCANDO', Math.round(Math.max(0, audio.currentTime) * 1000));
    }, [sincronizarEstado]);

    const alternarStatus = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio || !estado?.faixa) return;

        if (audio.paused) {
            audio.play().then(() => { sincronizarPeloAudio(); }).catch(() => {});
            return;
        }

        audio.pause();
        sincronizarPeloAudio();
    }, [estado?.faixa, sincronizarPeloAudio]);

    const definirPosicao = useCallback((posicaoMs: number): void => {
        const audio = audioRef.current;
        const posicaoLimitadaMs = Math.max(0, Math.min(duracaoMs, Math.round(posicaoMs)));
        setPosicaoVisualMs(posicaoLimitadaMs);
        if (audio) audio.currentTime = posicaoLimitadaMs / 1000;
        sincronizarEstado(audio && !audio.paused ? 'TOCANDO' : 'PAUSADO', posicaoLimitadaMs);
    }, [duracaoMs, sincronizarEstado]);

    const criarTrecho = useCallback((): string | null => {
        if (duracaoMs <= 0) return null;
        const indiceTrecho = proximoIdTrechoRef.current;
        proximoIdTrechoRef.current += 1;
        const id = `trecho-${indiceTrecho}`;
        const nome = NOMES_PADRAO_TRECHOS[(indiceTrecho - 1) % NOMES_PADRAO_TRECHOS.length] ?? `Trecho ${indiceTrecho}`;
        const inicioMaximoMs = Math.max(0, duracaoMs - DURACAO_MINIMA_TRECHO_MS);
        const inicioMs = Math.max(0, Math.min(inicioMaximoMs, posicaoVisualMs));
        const fimMs = Math.min(duracaoMs, Math.max(inicioMs + DURACAO_MINIMA_TRECHO_MS, inicioMs + DURACAO_PADRAO_TRECHO_MS));
        setTrechos(trechosAtuais => [...trechosAtuais, normalizarTrechoFluxo({ id, nome, inicioMs, fimMs, habilitado: true }, duracaoMs)]);
        return id;
    }, [duracaoMs, posicaoVisualMs]);

    const atualizarTrecho = useCallback((id: string, atualizacao: AtualizacaoTrechoFluxoMixer): void => {
        setTrechos(trechosAtuais => trechosAtuais.map(trecho => trecho.id === id ? normalizarTrechoFluxo({ ...trecho, ...atualizacao }, duracaoMs) : trecho));
    }, [duracaoMs]);

    const removerTrecho = useCallback((id: string): void => {
        setTrechos(trechosAtuais => trechosAtuais.filter(trecho => trecho.id !== id));
    }, []);

    const definirInicioUtil = useCallback((posicaoMs: number): void => {
        setInicioUtilMs(Math.max(0, Math.min(duracaoMs, Math.round(posicaoMs))));
    }, [duracaoMs]);

    const irParaInicioUtil = useCallback((): void => {
        definirPosicao(inicioUtilMs);
    }, [definirPosicao, inicioUtilMs]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !estado) return;

        const posicaoSegundos = calculaPosicaoSegundos(estado);
        atualizarPosicaoVisual(posicaoSegundos * 1000);
        if (Number.isFinite(posicaoSegundos) && Math.abs(audio.currentTime - posicaoSegundos) > 0.45) audio.currentTime = posicaoSegundos;

        if (estado.status === 'TOCANDO') {
            audio.play().catch(() => {});
            return;
        }

        audio.pause();
    }, [atualizarPosicaoVisual, estado]);

    useEffect(() => {
        let frame: number | null = null;

        const tick = (): void => {
            const audio = audioRef.current;
            if (audio) atualizarPosicaoVisual(audio.currentTime * 1000);
            frame = window.requestAnimationFrame(tick);
        };

        frame = window.requestAnimationFrame(tick);
        return () => { if (frame !== null) window.cancelAnimationFrame(frame); };
    }, [atualizarPosicaoVisual]);

    const registrarDuracao = useCallback((): void => {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const novaDuracaoMs = Math.round(audio.duration * 1000);
        setDuracaoMs(novaDuracaoMs);
        setPosicaoVisualMs(Math.max(0, Math.min(novaDuracaoMs, Math.round(audio.currentTime * 1000))));
        setInicioUtilMs(inicioAtualMs => Math.max(0, Math.min(novaDuracaoMs, inicioAtualMs)));
        setTrechos(trechosAtuais => trechosAtuais.map(trecho => normalizarTrechoFluxo(trecho, novaDuracaoMs)));
    }, []);

    useEffect(() => {
        if (!srcAudio) {
            setOndaAudio([]);
            setCarregandoOndaAudio(false);
            return;
        }

        let cancelado = false;

        const carregarOndaAudio = async (): Promise<void> => {
            setCarregandoOndaAudio(true);
            try {
                const resposta = await fetch(srcAudio, { credentials: 'include' });
                if (!resposta.ok) {
                    if (!cancelado) setOndaAudio([]);
                    return;
                }

                const arrayBuffer = await resposta.arrayBuffer();
                const contextoAudio = new window.AudioContext();

                try {
                    const audioBuffer = await contextoAudio.decodeAudioData(arrayBuffer);
                    const dadosCanal = audioBuffer.getChannelData(0);
                    const tamanhoBloco = Math.max(1, Math.floor(dadosCanal.length / QUANTIDADE_AMOSTRAS_ONDA_AUDIO));
                    const amostras = Array.from({ length: QUANTIDADE_AMOSTRAS_ONDA_AUDIO }, (_, indice): number => {
                        const inicio = indice * tamanhoBloco;
                        const fim = Math.min(dadosCanal.length, inicio + tamanhoBloco);
                        let pico = 0;
                        for (let i = inicio; i < fim; i++) pico = Math.max(pico, Math.abs(dadosCanal[i] ?? 0));
                        return Math.min(1, pico);
                    });
                    const maiorPico = amostras.reduce((maior, amplitude) => Math.max(maior, amplitude), 0);
                    const ondaNormalizada = amostras.map((amplitude, indice): AmostraOndaAudioMixer => ({ id: `onda-${indice}`, amplitude: maiorPico > 0 ? Math.max(0.08, amplitude / maiorPico) : 0.08 }));
                    if (!cancelado) setOndaAudio(ondaNormalizada);
                } finally {
                    await contextoAudio.close();
                }
            } catch {
                if (!cancelado) setOndaAudio([]);
            } finally {
                if (!cancelado) setCarregandoOndaAudio(false);
            }
        };

        carregarOndaAudio();
        return () => { cancelado = true; };
    }, [srcAudio]);

    return (
        <main className={styles.pagina}>
            <section className={styles.painel}>
                <header className={styles.cabecalho}>
                    <div>
                        <h1 className={styles.titulo}>Controle do Mixer</h1>
                        <p className={styles.descricao}>Fluxo de execucao da musica ativa.</p>
                    </div>
                    <span className={styles.status}>{estado?.status ?? 'CONECTANDO'}</span>
                </header>
                {erro && <p className={styles.erro}>{erro}</p>}
                {!estado?.faixa && <p className={styles.erro}>Arquivo de musica do teste nao encontrado.</p>}
                {srcAudio && <audio ref={audioRef} src={srcAudio} preload="auto" hidden onLoadedMetadata={registrarDuracao} />}
                <FluxoLinearMixer status={estado?.status ?? 'PAUSADO'} duracaoMs={duracaoMs} posicaoMs={posicaoVisualMs} inicioUtilMs={inicioUtilMs} ondaAudio={ondaAudio} carregandoOndaAudio={carregandoOndaAudio} trechos={trechos} podeControlar={!!estado?.faixa} aoAlternarStatus={alternarStatus} aoDefinirPosicao={definirPosicao} aoDefinirInicioUtil={definirInicioUtil} aoIrParaInicioUtil={irParaInicioUtil} aoCriarTrecho={criarTrecho} aoAtualizarTrecho={atualizarTrecho} aoRemoverTrecho={removerTrecho} />
            </section>
        </main>
    );
};