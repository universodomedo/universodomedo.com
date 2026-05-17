'use client';

import styles from './styles.module.css';

import RecipienteAvatar from '../RecipienteAvatar/page';
import RecipienteInfoUsuario from '../RecipienteInfoUsuario/page';

export default function CardInformacoesUsuario() {


    return (
        <>
            <div id={styles.barra_usuario}>

                <RecipienteAvatar />

                <RecipienteInfoUsuario />
            </div>

        </>
    )
}

