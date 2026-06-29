'use client';

import { useEffect } from 'react';

import { useDefinirMusicaSobreposicao } from 'Hooks/useDefinirMusicaPagina';
import { useValorEstabilizado } from 'Hooks/useValorEstabilizado';

const ATRASO_ESTABILIZACAO_MS = 220;

// Música da Partida SELECIONADA no Orbital: toca como SOBREPOSIÇÃO (por cima da música da própria página de Partidas) via o SSOT de áudio; o reprodutor/crossfade reagem ao Redux.
// Fluidez (como o fundo): debounce — NÃO troca a música a cada item durante scroll rápido, só quando a seleção assenta. id null (Partida sem música configurada) = sem overlay → volta a música da página.
export function MusicaFundoPartida({ idMusicaConfigurada, nomePartida }: { idMusicaConfigurada: number | null; nomePartida: string | null }) {
    const definirMusicaSobreposicao = useDefinirMusicaSobreposicao();
    const idEstavel = useValorEstabilizado(idMusicaConfigurada, ATRASO_ESTABILIZACAO_MS);
    const nomeEstavel = useValorEstabilizado(nomePartida, ATRASO_ESTABILIZACAO_MS);

    useEffect(() => {
        definirMusicaSobreposicao(idEstavel, nomeEstavel);
    }, [idEstavel, nomeEstavel, definirMusicaSobreposicao]);

    // Ao sair do Orbital, remove o overlay (volta a base da próxima página).
    useEffect(() => () => definirMusicaSobreposicao(null, null), [definirMusicaSobreposicao]);

    return null;
};
