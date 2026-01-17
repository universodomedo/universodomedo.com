'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaPersonagensProvider } from 'Contextos/ContextoPaginaPersonagens/contexto';
import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import PaginaPersonagem from 'Componentes/PaginaPersonagem/PaginaPersonagem';

export function PaginaPersonagens_Client({ idPersonagem }: { idPersonagem: number | null; }) {
    return (
        <ControladorSlot pagina={PAGINAS.personagens}>
            <ContextoPaginaPersonagensProvider idPersonagemInicial={idPersonagem}>
                <PaginaPersonagens_Contexto />
            </ContextoPaginaPersonagensProvider>
        </ControladorSlot>
    );
};

function PaginaPersonagens_Contexto() {
    const { personagemSelecionado } = useContextoPaginaPersonagens();

    return personagemSelecionado ? <PaginaPersonagem /> : <PaginaInicialPersonagens />;
};

function PaginaInicialPersonagens() {
    return (
        <h1>Página Inicial</h1>
    );
};