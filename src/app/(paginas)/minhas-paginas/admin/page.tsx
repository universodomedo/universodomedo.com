'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import { ListaAcoesAdmin } from "./componentes";

export default function PaginaAdmin() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <></>
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesAdmin />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};