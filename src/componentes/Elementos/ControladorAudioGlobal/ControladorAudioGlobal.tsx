'use client';

import { useEffect } from 'react';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { selectIdMusicaPaginaAtual, selectNivelVolume } from 'Redux/selectors/audioPaginaSelectors';
import { GANHO_POR_NIVEL_VOLUME, setNivelVolume } from 'Redux/slices/audioPaginaSlice';
import { lerNivelVolumeSalvo } from 'Uteis/PreferenciaVolume/preferenciaVolume';
import { useReprodutorMontagem } from './useReprodutorMontagem';

const SELECT_MUSICA = { id: true, arquivo: { id: true, caminhoArquivo: true }, montagem: { inicioMs: true, retornoMs: true, fimMs: true, transicaoLoop: { duracaoFadeOutMs: true, duracaoFadeInMs: true, sobreposicaoInicioLoopMs: true } } } as const;

export default function ControladorAudioGlobal() {
    const dispatch = useAppDispatch();
    const idMusica = useAppSelector(selectIdMusicaPaginaAtual);
    const nivelVolume = useAppSelector(selectNivelVolume);

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

    // motor Web Audio: aplica a montagem (Início/Fim + loop Fim→Retorno com crossfade) + o volume global, em vez de tocar o arquivo cru
    useReprodutorMontagem(caminhoArquivo, montagem, GANHO_POR_NIVEL_VOLUME[nivelVolume]);

    return null;
};
