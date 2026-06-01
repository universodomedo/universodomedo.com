'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Contexto__PaginaMinhaPagina__Provider, useContexto__PaginaMinhaPagina } from '@/contextos/Contexto__PaginaMinhaPagina/contexto';
import BarraUsuario from '@/componentes/ElementosPaginaUsuario/BarraUsuario/page';

export default function MinhaPagina_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhaPagina}>
            <Contexto__PaginaMinhaPagina__Provider>
                <MinhaPagina_Slot />
            </Contexto__PaginaMinhaPagina__Provider>
        </ControladorSlot>
    );
};

function MinhaPagina_Slot() {
    const { configArteCapa } = useContexto__PaginaMinhaPagina();

    return (
        <div className={styles.portal_usuario}>
            <div className={styles.portal_usuario_esquerda}>
                <BarraUsuario configArteCapa={configArteCapa} />
                {/* <SecaoPosts /> */}
            </div>
        </div>
    );
};