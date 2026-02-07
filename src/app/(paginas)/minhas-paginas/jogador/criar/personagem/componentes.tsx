'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';

export function PaginaJogadorCriarPersonagem_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.jogador.criar.personagem}>
            <></>
        </ControladorSlot>
    );
};