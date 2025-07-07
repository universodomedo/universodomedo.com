'use client';

import styles from './styles.module.css';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import { ContextoSessoesPrevistasProvider } from 'Contextos/ContextoSessoesPrevistas/contexto';
import PaginaSessao_InicioComSessaoEmAndamento from './sessao-em-andamento/page.tsx';
import PaginaSessao_InicioSemSessaoEmAndamento from './sessao-em-espera/page.tsx';

export default function PaginaSessao() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.SESSAO, comCabecalho: false, usuarioObrigatorio: false }}>
            <PaginaSessao_Slot />
        </ControladorSlot>
    );
};

function PaginaSessao_Slot() {

    if (true) return (
        <PaginaSessao_InicioComSessaoEmAndamento />
    );

    return (
        <ContextoSessoesPrevistasProvider>
            <PaginaSessao_InicioSemSessaoEmAndamento />
        </ContextoSessoesPrevistasProvider>
    );
};