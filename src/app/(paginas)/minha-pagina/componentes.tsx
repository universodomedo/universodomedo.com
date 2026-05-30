'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import BarraUsuario from '@/componentes/ElementosPaginaUsuario/BarraUsuario/page';
import SecaoPosts from 'Componentes/ElementosPaginaUsuario/Post/page.tsx';

export default function MinhaPagina_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhaPagina}>
            <MinhaPagina_Slot />
        </ControladorSlot>
    );
};

function MinhaPagina_Slot() {
    return (
        <div className={styles.portal_usuario}>
            <div className={styles.portal_usuario_esquerda}>
                <BarraUsuario />
                {/* <SecaoPosts /> */}
            </div>
        </div>
    );
};