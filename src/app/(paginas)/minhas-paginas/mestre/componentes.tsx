'use client';

import { ReactNode } from 'react';

import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import { verificarPermissao } from 'Helpers/verificarPermissao';

export function LayoutMestre_Slot({ children }: { children: ReactNode }) {
    const usuarioComPermissao = verificarPermissao(usuario => usuario.perfilMestre.id > 1);

    if (usuarioComPermissao === null) return null;

    if (!usuarioComPermissao) return <Redirecionador urlRedirecionar='/' />;

    return children;
};