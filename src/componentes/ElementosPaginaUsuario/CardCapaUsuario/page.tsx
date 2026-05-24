'use client';

import styles from './styles.module.css';

import CapaUsuario from '../CapaUsuario/page';
import CardInformacoesUsuario from '../CardInformacoesUsuario/page';

export default function CardCapaUsuario() {

    return (
        <>
            <div className={styles.recipiente_card_usuario}>
                <h2/>
                <CapaUsuario />
                <CardInformacoesUsuario />
            </div>

        </>
    )
};
