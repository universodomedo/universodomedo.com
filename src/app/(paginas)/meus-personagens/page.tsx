import styles from './styles.module.css';

import { ControladorSlot } from 'Layouts/ControladorSlot';

import { PaginaMeusPersonagens_Slot } from './componentes.tsx';
import { ContextoPaginaPersonagemProvider } from './contexto.tsx';

export default function PaginaMeusPersonagens() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: true }}>
            <ContextoPaginaPersonagemProvider>
                <div id={styles.recipiente_pagina_personagens}>
                    <PaginaMeusPersonagens_Slot />
                </div>
            </ContextoPaginaPersonagemProvider>
        </ControladorSlot>
    );
};