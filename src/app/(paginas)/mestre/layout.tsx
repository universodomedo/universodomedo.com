'use client';

import { ReactNode } from "react";

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import { verificarPermissao } from "Helpers/verificarPermissao";

import LayoutContextualizado from 'Contextos/ContextoLayoutVisualizacaoPadrao/page';
import { ContextoLayoutVisualizacaoPadraoProvider } from 'Contextos/ContextoLayoutVisualizacaoPadrao/contexto';

export default function LayoutMestre({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.MESTRE, comCabecalho: false, usuarioObrigatorio: true }}>
            <LayoutMestre_Slot>
                {children}
            </LayoutMestre_Slot>
        </ControladorSlot>
    );
};

function LayoutMestre_Slot({ children }: { children: ReactNode }) {
    const usuarioComPermissao = verificarPermissao(usuario => usuario.perfilMestre.id > 1);

    if (usuarioComPermissao === null) return null;

    if (!usuarioComPermissao) return <Redirecionador urlRedirecionar='/' />;

    return (
        <ContextoLayoutVisualizacaoPadraoProvider>
            {children}
        </ContextoLayoutVisualizacaoPadraoProvider>
    );
};