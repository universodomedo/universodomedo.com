'use client';

import styles from './styles.module.css';

import CardCapaUsuario from '../CardCapaUsuario/page.tsx';
import EmblemaConquistas from '../EmblemaConquistas/page.tsx';

export default function BarraUsuario() {

    return (
        <>
            <div className={styles.recipiente_perfil}>
                <div className={styles.recipiente_barra_usuario}>
                    <CardCapaUsuario />
                    <EmblemaConquistas />
                </div>
            </div>
        </>
    );
};