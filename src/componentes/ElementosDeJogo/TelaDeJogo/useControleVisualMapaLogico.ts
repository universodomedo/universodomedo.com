'use client';

import { useCallback, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { MapaLogicoSalaJogoPayloadWsDto } from 'types-nora-api';

import type { ArrasteMapaLogicoTelaJogo, ControleVisualMapaLogicoTelaJogo, EstadoVisualMapaLogicoTelaJogo, EstiloTransformacaoMapaLogicoTelaJogo } from './ContextoTelaDeJogoMapaLogico.types';

const estadoVisualInicialMapaLogico: EstadoVisualMapaLogicoTelaJogo = { panXEm: 0, panYEm: 0, zoom: 1, rotacaoGraus: 0, arrastando: false };

export function useControleVisualMapaLogico(mapaLogicoSalaJogo: MapaLogicoSalaJogoPayloadWsDto | null): ControleVisualMapaLogicoTelaJogo {
    const [estadoVisual, setEstadoVisual] = useState<EstadoVisualMapaLogicoTelaJogo>(estadoVisualInicialMapaLogico);
    const arrasteRef = useRef<ArrasteMapaLogicoTelaJogo | null>(null);

    const estiloMapa = useMemo<EstiloTransformacaoMapaLogicoTelaJogo | undefined>(() => {
        if (mapaLogicoSalaJogo === null) return undefined;
        return {
            '--mapa-logico-colunas': mapaLogicoSalaJogo.mapaLogico.largura,
            '--mapa-logico-linhas': mapaLogicoSalaJogo.mapaLogico.altura,
            '--mapa-logico-pan-x': `${estadoVisual.panXEm}em`,
            '--mapa-logico-pan-y': `${estadoVisual.panYEm}em`,
            '--mapa-logico-zoom': estadoVisual.zoom,
            '--mapa-logico-rotacao': `${estadoVisual.rotacaoGraus}deg`,
        };
    }, [estadoVisual.panXEm, estadoVisual.panYEm, estadoVisual.rotacaoGraus, estadoVisual.zoom, mapaLogicoSalaJogo]);

    const iniciaPan = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
        arrasteRef.current = { pointerId: event.pointerId, clientXInicial: event.clientX, clientYInicial: event.clientY, panXInicialEm: estadoVisual.panXEm, panYInicialEm: estadoVisual.panYEm };
        event.currentTarget.setPointerCapture(event.pointerId);
        setEstadoVisual(estadoAtual => ({ ...estadoAtual, arrastando: true }));
    }, [estadoVisual.panXEm, estadoVisual.panYEm]);

    const atualizaPan = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
        const arraste = arrasteRef.current;
        if (arraste === null || arraste.pointerId !== event.pointerId) return;

        const deltaXEm = (event.clientX - arraste.clientXInicial) / 16;
        const deltaYEm = (event.clientY - arraste.clientYInicial) / 16;

        setEstadoVisual(estadoAtual => ({ ...estadoAtual, panXEm: arraste.panXInicialEm + deltaXEm, panYEm: arraste.panYInicialEm + deltaYEm }));
    }, []);

    const finalizaPan = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
        const arraste = arrasteRef.current;
        if (arraste === null || arraste.pointerId !== event.pointerId) return;

        arrasteRef.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        setEstadoVisual(estadoAtual => ({ ...estadoAtual, arrastando: false }));
    }, []);

    const aproximaZoom = useCallback(() => setEstadoVisual(estadoAtual => ({ ...estadoAtual, zoom: Math.min(2.4, Number((estadoAtual.zoom + 0.15).toFixed(2))) })), []);
    const afastaZoom = useCallback(() => setEstadoVisual(estadoAtual => ({ ...estadoAtual, zoom: Math.max(0.45, Number((estadoAtual.zoom - 0.15).toFixed(2))) })), []);
    const rotacionaMapa = useCallback(() => setEstadoVisual(estadoAtual => ({ ...estadoAtual, rotacaoGraus: (estadoAtual.rotacaoGraus + 90) % 360 })), []);
    const resetaVisualizacao = useCallback(() => {
        arrasteRef.current = null;
        setEstadoVisual(estadoVisualInicialMapaLogico);
    }, []);

    return useMemo<ControleVisualMapaLogicoTelaJogo>(() => ({
        estiloMapa,
        arrastando: estadoVisual.arrastando,
        iniciaPan,
        atualizaPan,
        finalizaPan,
        aproximaZoom,
        afastaZoom,
        rotacionaMapa,
        resetaVisualizacao,
    }), [afastaZoom, aproximaZoom, atualizaPan, estadoVisual.arrastando, estiloMapa, finalizaPan, iniciaPan, resetaVisualizacao, rotacionaMapa]);
};
