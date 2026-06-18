'use client';

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Eventos_Emite, type MapaLogicoSalaJogoPayloadWsDto, type PAYLOAD__EmitirMapaLogicoSalaJogo, type RESPONSE__EmitirMapaLogicoSalaJogo, type SalaDeJogo_Codigo } from 'types-nora-api';

import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

import { criaInteragiveisVisuaisMapaLogico, criaOcupantesVisuaisMapaLogico, criaSeresVisuaisMapaLogico, validaRespostaMapaLogicoSalaJogo } from './ContextoTelaDeJogoMapaLogico.helpers';
import type { ContextoTelaDeJogoMapaLogicoProps, EstadoCarregamentoMapaLogicoTelaJogo } from './ContextoTelaDeJogoMapaLogico.types';
import { useControleVisualMapaLogico } from './useControleVisualMapaLogico';
import { useSelecaoInteragivelMapaLogico } from './useSelecaoInteragivelMapaLogico';
import { useSelecaoOcupanteMapaLogico } from './useSelecaoOcupanteMapaLogico';

const ContextoTelaDeJogoMapaLogico = createContext<ContextoTelaDeJogoMapaLogicoProps | undefined>(undefined);

export function useContextoTelaDeJogoMapaLogico(): ContextoTelaDeJogoMapaLogicoProps {
    const contexto = useContext(ContextoTelaDeJogoMapaLogico);
    if (!contexto) throw new Error('useContextoTelaDeJogoMapaLogico precisa estar dentro de ContextoTelaDeJogoMapaLogicoProvider');
    return contexto;
};

export function useContextoTelaDeJogoMapaLogicoOpcional(): ContextoTelaDeJogoMapaLogicoProps | null {
    return useContext(ContextoTelaDeJogoMapaLogico) ?? null;
};

export function ContextoTelaDeJogoMapaLogicoProvider({ codigoSala, children }: { codigoSala: SalaDeJogo_Codigo; children: ReactNode; }) {
    const [estadoCarregamento, setEstadoCarregamento] = useState<EstadoCarregamentoMapaLogicoTelaJogo>('carregando');
    const [erro, setErro] = useState<string | null>(null);
    const [mapaLogicoSalaJogo, setMapaLogicoSalaJogo] = useState<MapaLogicoSalaJogoPayloadWsDto | null>(null);
    const [keysInteragiveisPercebidosNovos, setKeysInteragiveisPercebidosNovos] = useState<readonly string[]>([]);
    const keysInteragiveisPercebidosRef = useRef<ReadonlySet<string> | null>(null);

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

            const keysInteragiveisPercebidosAtuais = new Set(resposta.mapaLogicoSalaJogo.interagiveisPercebidos.map(interagivel => interagivel.key));
            const keysInteragiveisPercebidosNovosAtualizados = keysInteragiveisPercebidosRef.current === null ? [] : Array.from(keysInteragiveisPercebidosAtuais).filter(key => !keysInteragiveisPercebidosRef.current?.has(key));
            keysInteragiveisPercebidosRef.current = keysInteragiveisPercebidosAtuais;
            setEstadoCarregamento('pronto');
            setErro(null);
            setKeysInteragiveisPercebidosNovos(keysInteragiveisPercebidosNovosAtualizados);
            setMapaLogicoSalaJogo(resposta.mapaLogicoSalaJogo);
        },
        onError: erroWs => {
            setEstadoCarregamento('erro');
            setErro(erroWs.mensagem);
            setKeysInteragiveisPercebidosNovos([]);
            keysInteragiveisPercebidosRef.current = null;
            setMapaLogicoSalaJogo(null);
        },
    });

    const ocupantesVisuais = useMemo(() => mapaLogicoSalaJogo === null ? [] : criaOcupantesVisuaisMapaLogico(mapaLogicoSalaJogo), [mapaLogicoSalaJogo]);
    const seresNaSala = useMemo(() => mapaLogicoSalaJogo?.seresNaSala ?? [], [mapaLogicoSalaJogo]);
    const seresVisuais = useMemo(() => mapaLogicoSalaJogo === null ? [] : criaSeresVisuaisMapaLogico(mapaLogicoSalaJogo), [mapaLogicoSalaJogo]);
    const interagiveisPercebidos = useMemo(() => mapaLogicoSalaJogo?.interagiveisPercebidos ?? [], [mapaLogicoSalaJogo]);
    const interagiveisVisuais = useMemo(() => mapaLogicoSalaJogo === null ? [] : criaInteragiveisVisuaisMapaLogico(mapaLogicoSalaJogo), [mapaLogicoSalaJogo]);
    const controleVisual = useControleVisualMapaLogico(mapaLogicoSalaJogo);
    const selecaoOcupante = useSelecaoOcupanteMapaLogico(mapaLogicoSalaJogo);
    const selecaoInteragivel = useSelecaoInteragivelMapaLogico(mapaLogicoSalaJogo);

    const contexto = useMemo<ContextoTelaDeJogoMapaLogicoProps>(() => ({
        estadoCarregamento,
        erro,
        mapaLogicoSalaJogo,
        ocupantesVisuais,
        seresNaSala,
        seresVisuais,
        interagiveisPercebidos,
        interagiveisVisuais,
        keysInteragiveisPercebidosNovos,
        ...controleVisual,
        ...selecaoOcupante,
        ...selecaoInteragivel,
    }), [controleVisual, erro, estadoCarregamento, interagiveisPercebidos, interagiveisVisuais, keysInteragiveisPercebidosNovos, mapaLogicoSalaJogo, ocupantesVisuais, selecaoInteragivel, selecaoOcupante, seresNaSala, seresVisuais]);

    return (
        <ContextoTelaDeJogoMapaLogico.Provider value={contexto}>
            {children}
        </ContextoTelaDeJogoMapaLogico.Provider>
    );
};