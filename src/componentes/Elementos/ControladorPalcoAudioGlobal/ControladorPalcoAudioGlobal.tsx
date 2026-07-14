'use client';

import { useCallback, useEffect, useState } from 'react';
import { Eventos_Emite, Eventos_EnviaERecebe, type EMIT__Palco_encerrado, type EMIT__Palco_estadoAtualizado, type EMIT__Palco_fluxoAtualizado, type EMIT__Palco_tokenMidia, type FluxoMusicaDto, type RESPONSE__Palco_ouvirPalco, type WsErrorResponse } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';
import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { selectNivelVolumeEfetivo, selectPalcoNaCentral } from 'Redux/selectors/audioPaginaSelectors';
import { GANHO_POR_NIVEL_VOLUME, atualizarPapelPalcoNaCentral, limparPalcoNaCentral } from 'Redux/slices/audioPaginaSlice';
import { calcularGanhoNormalizacao } from 'Uteis/Loudness/normalizacaoLoudness';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { usePalcoAudio } from 'Contextos/Contexto__PaginaPalcoEntrar/usePalcoAudio';
import { usePalcoTranscricao } from 'Contextos/Contexto__PaginaPalcoEntrar/usePalcoTranscricao';
import { useFluxoMusicaAudio, type FluxoMusicaFaixa } from 'Componentes/ElementosDeMusica/FluxoDeMusica/useFluxoMusicaAudio';

// "Única linha" do palco: vozes tocam no ganho pleno da faixa; a música ambiente entra ABAIXO delas por um fator fixo.
// O volume do palco na Central desce/sobe o conjunto — os níveis relativos entre vozes e música se mantêm.
const FATOR_MUSICA_PALCO = 0.5;

const SELECT_MUSICA_PALCO = { id: true, arquivo: { id: true, caminhoArquivo: true }, loudnessLufs: true, picoDbfs: true } as const;

function ouvirPalcoWs(codigoPalco: string): Promise<RESPONSE__Palco_ouvirPalco> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.ouvirPalco, { codigoPalco }, { onSuccess: (response: RESPONSE__Palco_ouvirPalco) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

// DONO ÚNICO da conexão LiveKit do palco na Central de Áudio: ouve E fala em QUALQUER página (a página do palco nunca conecta).
// Papel falante mantém mic + transcrição vivos fora da página; a Central mostra "você está falando" e o Parar de falar rebaixa.
export default function ControladorPalcoAudioGlobal() {
    const dispatch = useAppDispatch();
    const { usuarioLogado } = useContextoAutenticacao();
    const palcoNaCentral = useAppSelector(selectPalcoNaCentral);
    const nivelVolume = useAppSelector(selectNivelVolumeEfetivo);

    const codigoPalco = palcoNaCentral?.codigoPalco ?? null;
    const papel = palcoNaCentral?.papel ?? null;

    const [livekitToken, setLivekitToken] = useState<string | null>(null);
    const [livekitUrl, setLivekitUrl] = useState<string | null>(null);
    const [fluxo, setFluxo] = useState<FluxoMusicaDto | null>(null);

    const adicionaLog = useCallback((mensagem: string): void => { console.log(`[PalcoNaCentral] ${mensagem}`); }, []);

    // Palco entrou na Central: registra como participante no áudio (aguardando vira ouvinte; falante segue falante) e pega o token.
    useEffect(() => {
        if (!codigoPalco) { setLivekitToken(null); setLivekitUrl(null); setFluxo(null); return; }

        let encerrado = false;
        ouvirPalcoWs(codigoPalco)
            .then(resposta => {
                if (encerrado) return;
                if (resposta.papel === 'aguardando') { dispatch(limparPalcoNaCentral()); return; }
                dispatch(atualizarPapelPalcoNaCentral({ codigoPalco, papel: resposta.papel }));
                setLivekitToken(resposta.token);
                setLivekitUrl(resposta.livekitUrl);
                setFluxo(resposta.fluxo);
            })
            .catch(() => {
                console.error(`[PalcoNaCentral] falha ao ouvir o palco ${codigoPalco}; removendo a camada.`);
                if (!encerrado) dispatch(limparPalcoNaCentral());
            });

        return () => { encerrado = true; setLivekitToken(null); setLivekitUrl(null); setFluxo(null); };
    }, [codigoPalco, dispatch]);

    // Fluxo de música: o servidor avança o pulso e emite; aqui só substituímos o estado.
    useRecebeEmitWs(Eventos_Emite.Palco.eventos.fluxoAtualizado, {
        onSuccess: (data: EMIT__Palco_fluxoAtualizado) => { if (codigoPalco && data.codigoPalco === codigoPalco) setFluxo(data.fluxo); },
    });

    // Papel mudou por comando ou self-service (promoção/rebaixamento): o token novo troca o grant — reconecta com o papel certo.
    useRecebeEmitWs(Eventos_Emite.Palco.eventos.tokenMidia, {
        onSuccess: (data: EMIT__Palco_tokenMidia) => {
            if (!codigoPalco || data.codigoPalco !== codigoPalco) return;
            setLivekitToken(data.token);
            setLivekitUrl(data.livekitUrl);
        },
    });

    // Estado do palco: acompanha o MEU papel (a UI da Central exibe por ele); virar aguardando ou sumir da lista derruba a camada.
    useRecebeEmitWs(Eventos_Emite.Palco.eventos.estadoAtualizado, {
        onSuccess: (data: EMIT__Palco_estadoAtualizado) => {
            if (!codigoPalco || data.codigoPalco !== codigoPalco) return;

            const meuId = usuarioLogado?.id;
            if (meuId === undefined) return;

            const eu = data.participantes.find(p => p.idUsuario === meuId);
            if (!eu || eu.papel === 'aguardando') { dispatch(limparPalcoNaCentral()); return; }
            if (eu.papel !== papel) dispatch(atualizarPapelPalcoNaCentral({ codigoPalco, papel: eu.papel }));
        },
    });

    // Palco finalizado enquanto na Central: derruba a camada (a música volta sozinha).
    useRecebeEmitWs(Eventos_Emite.Palco.eventos.encerrado, {
        onSuccess: (data: EMIT__Palco_encerrado) => {
            if (codigoPalco && data.codigoPalco === codigoPalco) dispatch(limparPalcoNaCentral());
        },
    });

    // Motor de mídia único (mesmo da antiga página): publish do mic quando falante; volume da Central modula os remotos.
    usePalcoAudio({ codigoPalco: codigoPalco ?? '', modo: papel === 'falante' ? 'falante' : 'ouvinte', token: codigoPalco ? livekitToken : null, livekitUrl, adicionaLog, ganho: GANHO_POR_NIVEL_VOLUME[nivelVolume] });
    usePalcoTranscricao({ codigoPalco: codigoPalco ?? '', adicionaLog, ativo: papel === 'falante' && livekitToken !== null });

    // Fluxo de música: a fatia do bloco apontado pelo pulso toca localmente sob a faixa do palco.
    // A faixa (arquivo + normalização) é da música do PULSO; o motor confere o idMusica antes de tocar.
    const idMusicaPulso = codigoPalco ? fluxo?.pulso?.idMusica ?? null : null;
    const consultaMusica = useNoraGraphQLRegistro('MusicaConfigurada', { props: { idMusica: idMusicaPulso ?? 0 }, pk: idMusicaPulso ?? 0, select: SELECT_MUSICA_PALCO, carregando: 'Carregando a música do palco', mensagemErro: 'Não foi possível carregar a música do palco', executarAoMontar: false });
    const recarregarMusica = consultaMusica.recarregar;

    useEffect(() => {
        if (idMusicaPulso == null) return;
        recarregarMusica();
    }, [idMusicaPulso, recarregarMusica]);

    const dadosMusica = idMusicaPulso != null && consultaMusica.data?.id === idMusicaPulso ? consultaMusica.data : null;
    const faixa: FluxoMusicaFaixa | null = dadosMusica?.arquivo?.caminhoArquivo
        ? { idMusica: dadosMusica.id, caminhoArquivo: dadosMusica.arquivo.caminhoArquivo, ganhoNormalizacao: calcularGanhoNormalizacao(dadosMusica.loudnessLufs ?? null, dadosMusica.picoDbfs ?? null, GANHO_POR_NIVEL_VOLUME.MAXIMO) }
        : null;

    useFluxoMusicaAudio({ fluxo: codigoPalco ? fluxo : null, faixa, volume: GANHO_POR_NIVEL_VOLUME[nivelVolume] * FATOR_MUSICA_PALCO });

    return null;
};
