import { useCallback } from 'react';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import { setMusicaPagina, setMusicaSobreposicao } from 'Redux/slices/audioPaginaSlice';

// Define a música BASE da página (camada de fundo da rota). Quem dispara — página oficial, item de SPA — só chama isto; reprodução, crossfade, fades e a Central reagem ao Redux.
export function useDefinirMusicaPagina() {
    const dispatch = useAppDispatch();
    return useCallback((idMusica: number | null, tituloPagina: string | null) => { dispatch(setMusicaPagina({ idMusica, tituloPagina })); }, [dispatch]);
};

// Define a música de SOBREPOSIÇÃO (overlay) que toca POR CIMA da música da página enquanto ativa (ex.: a Partida selecionada no Orbital). null = sem overlay → volta a tocar a música da página.
export function useDefinirMusicaSobreposicao() {
    const dispatch = useAppDispatch();
    return useCallback((idMusica: number | null, tituloPagina: string | null) => { dispatch(setMusicaSobreposicao({ idMusica, tituloPagina })); }, [dispatch]);
};
