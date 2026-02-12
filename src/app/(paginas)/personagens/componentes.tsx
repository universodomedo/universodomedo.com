'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaPersonagensProvider, useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import { RegistrarMenuLayoutDinamico } from 'Layouts/MenuLayoutDinamico';
import ListaAcoesPersonagens from 'Componentes/ElementosDeMenu/ListaAcoesPersonagens/page';
import { AvisosDePersonagensEFichas } from 'Componentes/Elementos/AvisosDePersonagensEFichas/AvisosDePersonagensEFichas';
import { SPA_PaginaPersonagem } from 'Contextos/ContextoPaginaPersonagem/contexto';

export function PaginaPersonagens_Client({ idPersonagem }: { idPersonagem: number | null; }) {
    function EmbrulhoPersonagens({ children }: { children: React.ReactNode }) { return <ContextoPaginaPersonagensProvider idPersonagemInicial={idPersonagem}>{children}</ContextoPaginaPersonagensProvider> };

    return (
        <ControladorSlot pagina={PAGINAS.personagens} embrulho={EmbrulhoPersonagens}>
            <PaginaPersonagens_Slot />
        </ControladorSlot>
    );
};

function PaginaPersonagens_Slot() {
    return (
        <>
            <PaginaPersonagens_Contexto />
            <RegistrarMenuLayoutDinamico node={<ListaAcoesPersonagens />} />
        </>
    );
};

function PaginaPersonagens_Contexto() {
    const { personagemSelecionado } = useContextoPaginaPersonagens();

    return personagemSelecionado ? <SPA_PaginaPersonagem /> : <AvisosDePersonagensEFichas />;
};