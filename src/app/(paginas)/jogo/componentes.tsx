'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from './JogoRouteGuard';
import { ContextoPaginaInicialJogoProvider, useContextoPaginaInicialJogo } from 'Contextos/ContextoPaginaInicialJogo/contexto';

export default function PaginaJogo_Conteiner() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo} embrulho={JogoRouteGuard}>
            <ContextoPaginaInicialJogoProvider>
                <PaginaPlay_Slot />
            </ContextoPaginaInicialJogoProvider>
        </ControladorSlot>
    );
};

function PaginaPlay_Slot() {
    const {  } = useContextoPaginaInicialJogo();

    return (
        <>
            <PendenciasJogo />
            <ProximasSessoes />
        </>
    );
};

function PendenciasJogo() {
    return (
        <></>
    );
};

function ProximasSessoes() {
    return (
        <></>
    );
};