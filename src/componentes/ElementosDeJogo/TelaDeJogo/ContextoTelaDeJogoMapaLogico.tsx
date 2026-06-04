'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Eventos_Emite, type MapaLogicoSalaJogoPayloadWsDto, type PAYLOAD__EmitirMapaLogicoSalaJogo, type RESPONSE__EmitirMapaLogicoSalaJogo, type SalaDeJogo_Codigo } from 'types-nora-api';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

import { criaCelulasMapaLogico, validaRespostaMapaLogicoSalaJogo } from './ContextoTelaDeJogoMapaLogico.helpers';
import type { ContextoTelaDeJogoMapaLogicoProps, EstadoCarregamentoMapaLogicoTelaJogo } from './ContextoTelaDeJogoMapaLogico.types';
import { useControleVisualMapaLogico } from './useControleVisualMapaLogico';
import { useSelecaoOcupanteMapaLogico } from './useSelecaoOcupanteMapaLogico';

const ContextoTelaDeJogoMapaLogico = createContext<ContextoTelaDeJogoMapaLogicoProps | undefined>(undefined);

export function useContextoTelaDeJogoMapaLogico(): ContextoTelaDeJogoMapaLogicoProps {
    const contexto = useContext(ContextoTelaDeJogoMapaLogico);
    if (!contexto) throw new Error('useContextoTelaDeJogoMapaLogico precisa estar dentro de ContextoTelaDeJogoMapaLogicoProvider');
    return contexto;
};

export function ContextoTelaDeJogoMapaLogicoProvider({ codigoSala, children }: { codigoSala: SalaDeJogo_Codigo; children: ReactNode; }) {
    const [estadoCarregamento, setEstadoCarregamento] = useState<EstadoCarregamentoMapaLogicoTelaJogo>('carregando');
    const [erro, setErro] = useState<string | null>(null);
    const [mapaLogicoSalaJogo, setMapaLogicoSalaJogo] = useState<MapaLogicoSalaJogoPayloadWsDto | null>(null);

    const payloadInicial = useMemo<PAYLOAD__EmitirMapaLogicoSalaJogo>(() => ({ codigoSala }), [codigoSala]);

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirMapaLogicoSalaJogo, payloadInicial, {
        onSuccess: (resposta: RESPONSE__EmitirMapaLogicoSalaJogo) => {
            const erroValidacao = validaRespostaMapaLogicoSalaJogo(resposta);

            if (erroValidacao !== null) {
                setEstadoCarregamento('erro');
                setErro(erroValidacao);
                setMapaLogicoSalaJogo(null);
                return;
            }

            setEstadoCarregamento('pronto');
            setErro(null);
            setMapaLogicoSalaJogo(resposta.mapaLogicoSalaJogo);
        },
        onError: erroWs => {
            setEstadoCarregamento('erro');
            setErro(erroWs.mensagem);
            setMapaLogicoSalaJogo(null);
        },
    });

    const celulas = useMemo(() => mapaLogicoSalaJogo === null ? [] : criaCelulasMapaLogico(mapaLogicoSalaJogo), [mapaLogicoSalaJogo]);
    const controleVisual = useControleVisualMapaLogico(mapaLogicoSalaJogo);
    const selecaoOcupante = useSelecaoOcupanteMapaLogico(mapaLogicoSalaJogo);

    const contexto = useMemo<ContextoTelaDeJogoMapaLogicoProps>(() => ({
        estadoCarregamento,
        erro,
        mapaLogicoSalaJogo,
        celulas,
        ...controleVisual,
        ...selecaoOcupante,
    }), [celulas, controleVisual, erro, estadoCarregamento, mapaLogicoSalaJogo, selecaoOcupante]);

    return (
        <ContextoTelaDeJogoMapaLogico.Provider value={contexto}>
            {children}
        </ContextoTelaDeJogoMapaLogico.Provider>
    );
};
