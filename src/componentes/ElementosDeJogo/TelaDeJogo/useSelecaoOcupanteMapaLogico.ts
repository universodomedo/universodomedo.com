'use client';

import { useCallback, useMemo, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { MapaLogicoSalaJogoPayloadWsDto, OcupanteMapaLogicoSalaJogoWsDto } from 'types-nora-api';

import type { SelecaoOcupanteMapaLogicoTelaJogo } from './ContextoTelaDeJogoMapaLogico.types';

export function useSelecaoOcupanteMapaLogico(mapaLogicoSalaJogo: MapaLogicoSalaJogoPayloadWsDto | null): SelecaoOcupanteMapaLogicoTelaJogo {
    const [keySelecionadaInterna, setKeySelecionadaInterna] = useState<string | null>(null);

    const ocupanteSelecionado = useMemo<OcupanteMapaLogicoSalaJogoWsDto | null>(() => {
        if (mapaLogicoSalaJogo === null || keySelecionadaInterna === null) return null;
        return mapaLogicoSalaJogo.ocupantesMapaLogico.find(ocupante => ocupante.keySer === keySelecionadaInterna) ?? null;
    }, [keySelecionadaInterna, mapaLogicoSalaJogo]);

    const keyOcupanteSelecionado = ocupanteSelecionado?.keySer ?? null;
    const selecionaOcupante = useCallback((keySer: string) => setKeySelecionadaInterna(keySer), []);
    const limpaSelecaoOcupante = useCallback(() => setKeySelecionadaInterna(null), []);
    const impedeInicioPanOcupante = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => event.stopPropagation(), []);

    return useMemo<SelecaoOcupanteMapaLogicoTelaJogo>(() => ({
        keyOcupanteSelecionado,
        ocupanteSelecionado,
        selecionaOcupante,
        limpaSelecaoOcupante,
        impedeInicioPanOcupante,
    }), [impedeInicioPanOcupante, keyOcupanteSelecionado, limpaSelecaoOcupante, ocupanteSelecionado, selecionaOcupante]);
};
