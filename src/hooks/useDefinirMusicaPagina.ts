import { useCallback } from 'react';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import { setMusicaPagina } from 'Redux/slices/audioPaginaSlice';

// Único ponto (SSOT) para definir a música que toca agora a partir da "página" atual.
// Quem dispara — página oficial, item de SPA, ação no jogo — só chama isto; reprodução, crossfade, fades e a Central reagem ao Redux.
export function useDefinirMusicaPagina() {
    const dispatch = useAppDispatch();
    return useCallback((idMusica: number | null, tituloPagina: string | null) => { dispatch(setMusicaPagina({ idMusica, tituloPagina })); }, [dispatch]);
};
