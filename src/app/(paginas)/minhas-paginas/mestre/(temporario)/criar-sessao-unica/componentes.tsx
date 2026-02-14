'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export function PaginaTemporariaCriarSessaoUnica_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.temporario.criarSessaoUnica}>
            <PaginaTemporariaCriarSessaoUnica_Slot />
        </ControladorSlot>
    );
};

function PaginaTemporariaCriarSessaoUnica_Slot() {
    return (
        <></>
    );
};