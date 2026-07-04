'use client';

import { useEffect } from 'react';

import { useDefinirMusicaSobreposicao } from 'Hooks/useDefinirMusicaPagina';

// Toca a Música em Jogo da Partida enquanto a tela em-jogo está montada, pela camada de SOBREPOSIÇÃO da Central (mesma da música do Orbital — o mixer faz o crossfade). Limpa ao sair (volta pra música da página). idMusica null = sem música em jogo.
export function MusicaEmJogoPartida({ idMusica, nomePartida }: { idMusica: number | null; nomePartida: string; }) {
    const definirMusicaSobreposicao = useDefinirMusicaSobreposicao();

    useEffect(() => {
        definirMusicaSobreposicao(idMusica, nomePartida);
    }, [idMusica, nomePartida, definirMusicaSobreposicao]);

    useEffect(() => () => definirMusicaSobreposicao(null, null), [definirMusicaSobreposicao]);

    return null;
};
