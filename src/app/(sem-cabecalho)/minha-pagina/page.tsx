'use client';

import styles from "./styles.module.css";

import ModalPrimeiroAcesso from "Componentes/ElementosDeJogo/ModalPrimeiroAcesso/page";
import BarraUsuario from 'Componentes/ElementosPaginaUsuario/BarraUsuario/page.tsx';
import Post from 'Componentes/ElementosPaginaUsuario/Post/page.tsx';
import Contato from 'Componentes/ElementosPaginaUsuario/Contato/page.tsx';

export default function MinhaPagina() {
    if (false) {
        return (
            <ModalPrimeiroAcesso />
        );
    }

    

    return (
        <div id={styles.portal_usuario}>
            <div id={styles.portal_usuario_esquerda}>
                <BarraUsuario />

                <div id={styles.recipiente_lista_posts}>
                    <Post />
                </div>
            </div>

            <div id={styles.portal_usuario_direita}>
                <Contato />
                <Contato />
            </div>
        </div>
    );
};