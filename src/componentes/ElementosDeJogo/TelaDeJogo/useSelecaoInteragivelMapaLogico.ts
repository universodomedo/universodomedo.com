'use client';

import { useCallback, useMemo, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { InteragivelPercebidoSalaJogoWsDto, MapaLogicoSalaJogoPayloadWsDto } from 'types-nora-api';

import type { SelecaoInteragivelMapaLogicoTelaJogo } from './ContextoTelaDeJogoMapaLogico.types';

export function useSelecaoInteragivelMapaLogico(mapaLogicoSalaJogo: MapaLogicoSalaJogoPayloadWsDto | null): SelecaoInteragivelMapaLogicoTelaJogo {
    const [keySelecionadaInterna, setKeySelecionadaInterna] = useState<string | null>(null);

    const interagivelSelecionado = useMemo<InteragivelPercebidoSalaJogoWsDto | null>(() => {
        if (mapaLogicoSalaJogo === null || keySelecionadaInterna === null) return null;
        return mapaLogicoSalaJogo.interagiveisPercebidos.find(interagivel => interagivel.key === keySelecionadaInterna) ?? null;
    }, [keySelecionadaInterna, mapaLogicoSalaJogo]);

    const keyInteragivelSelecionado = interagivelSelecionado?.key ?? null;
    const selecionaInteragivel = useCallback((keyInteragivel: string) => setKeySelecionadaInterna(keyInteragivel), []);
    const limpaSelecaoInteragivel = useCallback(() => setKeySelecionadaInterna(null), []);
    const impedeInicioPanInteragivel = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => event.stopPropagation(), []);

    return useMemo<SelecaoInteragivelMapaLogicoTelaJogo>(() => ({
        keyInteragivelSelecionado,
        interagivelSelecionado,
        selecionaInteragivel,
        limpaSelecaoInteragivel,
        impedeInicioPanInteragivel,
    }), [impedeInicioPanInteragivel, interagivelSelecionado, keyInteragivelSelecionado, limpaSelecaoInteragivel, selecionaInteragivel]);
};
