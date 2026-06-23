'use client';

import { useEffect, useRef } from 'react';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectIdMusicaPaginaAtual } from 'Redux/selectors/audioPaginaSelectors';

const SELECT_MUSICA = { id: true, arquivo: { id: true, caminhoArquivo: true } } as const;

export default function ControladorAudioGlobal() {
    const idMusica = useAppSelector(selectIdMusicaPaginaAtual);
    const refAudio = useRef<HTMLAudioElement | null>(null);

    const consulta = useNoraGraphQLRegistro('ArquivoTipadoMusica', { props: { idMusica: idMusica ?? 0 }, pk: idMusica ?? 0, select: SELECT_MUSICA, mensagemErro: 'Não foi possível carregar a música da página', executarAoMontar: false });
    const recarregar = consulta.recarregar;

    // a página atual define (ou troca) a música via Redux; aqui busca a faixa correspondente no backend
    useEffect(() => {
        if (idMusica == null) return;
        recarregar();
    }, [idMusica, recarregar]);

    const caminhoArquivo = idMusica != null ? (consulta.data?.arquivo?.caminhoArquivo ?? null) : null;
    const urlFaixa = caminhoArquivo ? getImageUrl(caminhoArquivo) : null;

    // toca em loop; se o autoplay for bloqueado, o primeiro gesto do usuário inicia
    useEffect(() => {
        const audio = refAudio.current;
        if (!audio || !urlFaixa) return;
        const tentarTocar = () => { audio.play().catch(() => undefined); };
        tentarTocar();
        window.addEventListener('pointerdown', tentarTocar);
        window.addEventListener('keydown', tentarTocar);
        return () => { window.removeEventListener('pointerdown', tentarTocar); window.removeEventListener('keydown', tentarTocar); };
    }, [urlFaixa]);

    if (!urlFaixa) return null;
    return <audio ref={refAudio} src={urlFaixa} loop preload="auto" hidden />;
};
