'use client';

import styles from './styles.module.css';

import CapaUsuario from '../CapaUsuario/page';
import CardInformacoesUsuario from '../CardInformacoesUsuario/page';

export default function CardCapaUsuario() {
    return (
        <div className={styles.recipiente_card_usuario}>
            <h2 /> {/* ta aqui para manter o espaço, TO DO */}
            <CapaUsuario />
            <CardInformacoesUsuario />
        </div>
    );
};