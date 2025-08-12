'use client';

import { useLayoutContextualizado } from "Hooks/useLayoutContextualizado";
import { ListaMenusLayoutContextualizado } from 'Componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/chavesMenu';

export default function PaginaMestre() {
    // essa linha mudaria para passar a disponibilizar umm JSX
    useLayoutContextualizado(ListaMenusLayoutContextualizado.menuPrincipalParaMestre);

    return <></>;
};