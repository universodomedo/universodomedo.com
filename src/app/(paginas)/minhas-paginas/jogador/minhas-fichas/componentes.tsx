'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from "Layouts/ControladorSlot";

export function MinhasFichas_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador.minhasFichas}>
            <MinhasPaginas_Contexto />
        </ControladorSlot>
    );
};

function MinhasPaginas_Contexto() {
    return (
        <>
            <h1>Oi</h1>

            <button onClick={() => console.log(`xau`)}>Teste</button>
        </>
    );
};