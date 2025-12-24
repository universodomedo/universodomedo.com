'use client';

import { ReactNode } from "react";
import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { verificarPermissao } from "Helpers/verificarPermissao";
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';

export default function LayoutAdmin({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin}>
            <LayoutAdmin_Slot>
                {children}
            </LayoutAdmin_Slot>
        </ControladorSlot>
    );
};

function LayoutAdmin_Slot({ children }: { children: ReactNode }) {
    const usuarioComPermissao = verificarPermissao(usuario => usuario.perfilAdmin.id === 2);

    if (usuarioComPermissao === null) return null;

    if (!usuarioComPermissao) return <Redirecionador pagina={PAGINAS.home} />;

    return children;
};