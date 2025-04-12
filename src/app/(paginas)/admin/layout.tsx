'use client';

import { ReactNode } from "react";
import { ControladorSlot } from 'Layouts/ControladorSlot';

import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import { verificarPermissao } from "Helpers/verificarPermissao";

export default function LayoutAdmin({ children }: { children: ReactNode }) {
    const usuarioComPermissao = verificarPermissao();

    if (usuarioComPermissao === null) return null;
    
    if (!usuarioComPermissao) return <Redirecionador urlRedirecionar='/' />;

    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: true }}>
            {children}
        </ControladorSlot>
    )
};