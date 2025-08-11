'use client';

import { useLayoutContextualizado } from "Hooks/useLayoutContextualizado";
import { ListaMenusLayoutContextualizado } from 'Componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/chavesMenu';

export default function PaginaTeste1Menu() {
    useLayoutContextualizado(ListaMenusLayoutContextualizado.menuTeste);

    return <h1>Página 1</h1>;
};