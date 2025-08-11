'use client';

import { useLayoutContextualizado } from "Hooks/useLayoutContextualizado";
import { ListaMenusLayoutContextualizado } from 'Componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/chavesMenu';

export default function PaginaMestre() {
    useLayoutContextualizado(ListaMenusLayoutContextualizado.menuPrincipalParaMestre);

    return <></>;
};