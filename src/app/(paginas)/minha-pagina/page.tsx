'use client';

import styles from './styles.module.css';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import BarraUsuario from 'Componentes/ElementosPaginaUsuario/BarraUsuario/page.tsx';
import SecaoPosts from 'Componentes/ElementosPaginaUsuario/Post/page.tsx';
import SecaoContatos from 'Componentes/ElementosPaginaUsuario/Contato/page.tsx';

export default function MinhaPagina() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.MINHA_PAGINA, comCabecalho: false, usuarioObrigatorio: true }}>
            <MinhaPagina_Slot />
        </ControladorSlot>
    );
};

function MinhaPagina_Slot() {
    return (
        <div id={styles.portal_usuario}>
            <div id={styles.portal_usuario_esquerda}>
                <BarraUsuario />
                <SecaoPosts />
            </div>

            <SecaoContatos />
        </div>
    );
};