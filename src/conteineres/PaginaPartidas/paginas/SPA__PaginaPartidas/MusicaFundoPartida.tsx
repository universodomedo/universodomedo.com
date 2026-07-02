'use client';

import { useEffect } from 'react';

import { useDefinirMusicaSobreposicao } from 'Hooks/useDefinirMusicaPagina';

// Música da Partida SELECIONADA no Orbital: toca como SOBREPOSIÇÃO (por cima da música da própria página de Partidas) via o SSOT de áudio; o reprodutor/crossfade reagem ao Redux.
// Fluidez: a estabilização da seleção (debounce) é ÚNICA e vem do contexto — aqui id/nome já chegam assentados, então NÃO troca a música no meio do scroll. id null (Partida sem música configurada) = sem overlay → volta a música da página.
export function MusicaFundoPartida({ idMusicaConfigurada, nomePartida }: { idMusicaConfigurada: number | null; nomePartida: string | null }) {
    const definirMusicaSobreposicao = useDefinirMusicaSobreposicao();

    useEffect(() => {
        definirMusicaSobreposicao(idMusicaConfigurada, nomePartida);
    }, [idMusicaConfigurada, nomePartida, definirMusicaSobreposicao]);

    // Ao sair do Orbital, remove o overlay (volta a base da próxima página).
    useEffect(() => () => definirMusicaSobreposicao(null, null), [definirMusicaSobreposicao]);

    return null;
};
