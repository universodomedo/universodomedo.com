'use client';

import styles from './styles.module.css';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import { ContextoPaginaPersonagemProvider, useContextoPaginaPersonagem } from './contexto.tsx';
import { PaginaListaPersonagens } from './componentes/pagina-todos-personagens.tsx';
import { PaginaPersonagemSelecionado } from './componentes/pagina-personagem.tsx';

export default function PaginaMeusPersonagens() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.MEUS_PERSONAGENS, comCabecalho: false, usuarioObrigatorio: true }}>
            <ContextoPaginaPersonagemProvider>
                <div id={styles.recipiente_pagina_personagens}>
                    <PaginaMeusPersonagens_Slot />
                </div>
            </ContextoPaginaPersonagemProvider>
        </ControladorSlot>
    );
};

function PaginaMeusPersonagens_Slot() {
    const { personagemSelecionado } = useContextoPaginaPersonagem();

    return !personagemSelecionado ? <PaginaListaPersonagens /> : <PaginaPersonagemSelecionado />
};