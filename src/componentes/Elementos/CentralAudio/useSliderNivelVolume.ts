import { useCallback, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';

import { ULTIMO_INDICE_NIVEL_VOLUME } from './niveisVolume';

const SEGMENTO = 1 / ULTIMO_INDICE_NIVEL_VOLUME;
// Quão perto de um ponto conta como "chegou nele" (aí sim o volume muda). Fora disso o polegar fica entre pontos, sem alterar o volume.
const TOLERANCIA_PONTO = SEGMENTO * 0.4;

// posicao 0..1 → índice do ponto válido quando está perto o bastante dele; null quando está "entre" pontos.
function pontoNaPosicao(posicao: number): number | null {
    const indice = Math.round(posicao * ULTIMO_INDICE_NIVEL_VOLUME);
    return Math.abs(posicao - indice * SEGMENTO) <= TOLERANCIA_PONTO ? indice : null;
};

// Slider arrastável entre níveis: o polegar segue o dedo continuamente, mas só há posição VÁLIDA nos pontos.
// O volume muda apenas ao alcançar um ponto; ao soltar entre pontos, decide o alvo pela direção do arraste (o "bounce" é a transição do componente).
export function useSliderNivelVolume(indiceComprometido: number, aoComprometer: (indice: number) => void, indiceMinimo = 0) {
    const trilhoRef = useRef<HTMLDivElement | null>(null);
    const [arrastando, setArrastando] = useState(false);
    const [posicaoArraste, setPosicaoArraste] = useState(0);
    const direcaoRef = useRef(0);
    const posicaoRef = useRef(0);

    // piso: em páginas com mute bloqueado o polegar não desce abaixo do Mínimo (indiceMinimo = 1)
    const posicaoDoEvento = useCallback((clientX: number) => {
        const trilho = trilhoRef.current;
        if (!trilho) return indiceMinimo * SEGMENTO;
        const rect = trilho.getBoundingClientRect();
        return Math.min(1, Math.max(indiceMinimo * SEGMENTO, (clientX - rect.left) / rect.width));
    }, [indiceMinimo]);

    const registrar = useCallback((posicao: number) => {
        posicaoRef.current = posicao;
        setPosicaoArraste(posicao);
        const ponto = pontoNaPosicao(posicao);
        if (ponto !== null && ponto !== indiceComprometido) aoComprometer(ponto);
    }, [indiceComprometido, aoComprometer]);

    const aoIniciar = useCallback((evento: ReactPointerEvent<HTMLDivElement>) => {
        evento.currentTarget.setPointerCapture(evento.pointerId);
        setArrastando(true);
        direcaoRef.current = 0;
        registrar(posicaoDoEvento(evento.clientX));
    }, [posicaoDoEvento, registrar]);

    const aoMover = useCallback((evento: ReactPointerEvent<HTMLDivElement>) => {
        if (!arrastando) return;
        const posicao = posicaoDoEvento(evento.clientX);
        const delta = posicao - posicaoRef.current;
        if (Math.abs(delta) > 0.001) direcaoRef.current = delta > 0 ? 1 : -1;
        registrar(posicao);
    }, [arrastando, posicaoDoEvento, registrar]);

    const aoSoltar = useCallback(() => {
        if (!arrastando) return;
        setArrastando(false);
        const posicao = posicaoRef.current;
        const ponto = pontoNaPosicao(posicao);
        let alvo: number;
        if (ponto !== null) alvo = ponto;
        else if (direcaoRef.current > 0) alvo = Math.ceil(posicao * ULTIMO_INDICE_NIVEL_VOLUME);
        else if (direcaoRef.current < 0) alvo = Math.floor(posicao * ULTIMO_INDICE_NIVEL_VOLUME);
        else alvo = Math.round(posicao * ULTIMO_INDICE_NIVEL_VOLUME);
        alvo = Math.min(ULTIMO_INDICE_NIVEL_VOLUME, Math.max(indiceMinimo, alvo));
        if (alvo !== indiceComprometido) aoComprometer(alvo);
    }, [arrastando, indiceComprometido, aoComprometer, indiceMinimo]);

    const aoTecla = useCallback((evento: ReactKeyboardEvent<HTMLDivElement>) => {
        let alvo = indiceComprometido;
        if (evento.key === 'ArrowRight' || evento.key === 'ArrowUp') alvo = indiceComprometido + 1;
        else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowDown') alvo = indiceComprometido - 1;
        else if (evento.key === 'Home') alvo = 0;
        else if (evento.key === 'End') alvo = ULTIMO_INDICE_NIVEL_VOLUME;
        else return;
        evento.preventDefault();
        alvo = Math.min(ULTIMO_INDICE_NIVEL_VOLUME, Math.max(indiceMinimo, alvo));
        if (alvo !== indiceComprometido) aoComprometer(alvo);
    }, [indiceComprometido, aoComprometer, indiceMinimo]);

    // Enquanto arrasta o polegar segue o dedo; parado, descansa no ponto comprometido (transição do componente faz o bounce).
    const posicao = arrastando ? posicaoArraste : indiceComprometido * SEGMENTO;

    return { trilhoRef, arrastando, posicao, aoIniciar, aoMover, aoSoltar, aoTecla };
};
