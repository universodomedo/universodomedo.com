import styles from "./styles.module.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function BarraLocaisDeJogo() {
    return (
        <>
            <div className={styles.barra_locais_borda_esquerda} />
            <div className={styles.barra_locais_centro}>
                <div className={styles.recipiente_icone_barra_locais}>
                    <FontAwesomeIcon className={`${styles.icone_local}`} title={'Mundo Aberto'} icon={faUsers} />
                </div>
                <div className={styles.recipiente_icone_barra_locais}>
                    <FontAwesomeIcon className={`${styles.icone_local}`} title={'Shopping'} icon={faShoppingCart} />
                </div>
            </div>
            <div className={styles.barra_locais_borda_direita} /> 
        </>
    );
};