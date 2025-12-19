'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoSessaoEmAndamentoProvider } from "Contextos/ContextosPaginaAovivo/ContextoSessaoEmAndamento/contexto";
import { PaginaSessao_Contexto } from './componentes';

export default function PaginaSessao() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.SESSAO_AOVIVO, comCabecalho: false, usuarioObrigatorio: true }}>
            <ContextoSessaoEmAndamentoProvider>
                <PaginaSessao_Contexto />
            </ContextoSessaoEmAndamentoProvider>
        </ControladorSlot>
    );
};