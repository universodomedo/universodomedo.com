'use client';

import { useEffect } from 'react';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { selectIdMusicaPaginaAtual, selectNivelVolumeEfetivo } from 'Redux/selectors/audioPaginaSelectors';
import { GANHO_POR_NIVEL_VOLUME, setNivelVolume } from 'Redux/slices/audioPaginaSlice';
import { lerNivelVolumeSalvo } from 'Uteis/PreferenciaVolume/preferenciaVolume';
import { calcularGanhoNormalizacao } from 'Uteis/Loudness/normalizacaoLoudness';
import { useReprodutorMontagem } from './useReprodutorMontagem';

const SELECT_MUSICA = { id: true, arquivo: { id: true, caminhoArquivo: true }, montagem: { inicioMs: true, retornoMs: true, fimMs: true, transicaoLoop: { duracaoFadeOutMs: true, duracaoFadeInMs: true, sobreposicaoInicioLoopMs: true }, automacaoVolume: { tMs: true, ganhoDb: true }, lowCutHz: true }, loudnessLufs: true, picoDbfs: true } as const;

export default function ControladorAudioGlobal() {
    const dispatch = useAppDispatch();
    const idMusica = useAppSelector(selectIdMusicaPaginaAtual);
    const nivelVolume = useAppSelector(selectNivelVolumeEfetivo);

    // restaura o volume escolhido pelo usuário (persistido em localStorage) ao montar
    useEffect(() => {
        const salvo = lerNivelVolumeSalvo();
        if (salvo) dispatch(setNivelVolume(salvo));
    }, [dispatch]);

    const consulta = useNoraGraphQLRegistro('MusicaConfigurada', { props: { idMusica: idMusica ?? 0 }, pk: idMusica ?? 0, select: SELECT_MUSICA, mensagemErro: 'Não foi possível carregar a música da página', executarAoMontar: false });
    const recarregar = consulta.recarregar;

    // a página atual define (ou troca) a música via Redux; aqui busca a faixa configurada correspondente no backend
    useEffect(() => {
        if (idMusica == null) return;
        recarregar();
    }, [idMusica, recarregar]);

    const caminhoArquivo = idMusica != null ? (consulta.data?.arquivo?.caminhoArquivo ?? null) : null;
    const montagem = idMusica != null ? (consulta.data?.montagem ?? null) : null;

    // ganho de normalização da faixa (loudness medida → alvo), travado anti-clip pelo teto do Máximo da Central (0.8)
    const loudnessLufs = idMusica != null ? (consulta.data?.loudnessLufs ?? null) : null;
    const picoDbfs = idMusica != null ? (consulta.data?.picoDbfs ?? null) : null;
    const ganhoNormalizacao = calcularGanhoNormalizacao(loudnessLufs, picoDbfs, GANHO_POR_NIVEL_VOLUME.MAXIMO);

    // motor Web Audio: aplica a montagem (Início/Fim + loop Fim→Retorno com crossfade) + o ganho de normalização (per-faixa) + o volume global, em vez de tocar o arquivo cru
    useReprodutorMontagem(caminhoArquivo, montagem, GANHO_POR_NIVEL_VOLUME[nivelVolume], ganhoNormalizacao);

    return null;
};
