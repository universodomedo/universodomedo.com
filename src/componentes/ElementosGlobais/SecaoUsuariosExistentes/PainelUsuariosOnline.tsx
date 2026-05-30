'use client';

import styles from './PainelUsuariosOnline.module.css';
import { useContextoUsuariosOnline } from 'Contextos/ContextoUsuariosOnline/contexto';
import SecaoUsuariosExistentes from './SecaoUsuariosExistentes';

export default function PainelUsuariosOnline() {
    const { painelAberto } = useContextoUsuariosOnline();

    if (!painelAberto) return null;

    return (
        <div className={styles.painel_usuarios_online}>
            <SecaoUsuariosExistentes />
        </div>
    );
};
