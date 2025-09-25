'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesPersonagens from "Componentes/ElementosDeMenu/ListaAcoesPersonagens/page";

export function PaginaPersonagens_Contexto() {
    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo>
                <PaginaPersonagens_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesPersonagens />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function PaginaPersonagens_Conteudo() {
    return (
        <></>
    );
};