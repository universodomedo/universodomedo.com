'use client';

import styles from './styles.module.css';

import { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScissors } from '@fortawesome/free-solid-svg-icons';

type BarraFerramentasMontagemProps = {
    onMarcarInicio: () => void;
    onMarcarRetorno: () => void;
    onMarcarFim: () => void;
    onCortar: () => void;
};

export default function BarraFerramentasMontagem(props: BarraFerramentasMontagemProps): JSX.Element {
    return (
        <div className={styles.barra}>
            <span className={styles.rotulo}>No cursor:</span>
            <button className={`${styles.botao} ${styles.inicio}`} onClick={props.onMarcarInicio}>Marcar Início</button>
            <button className={`${styles.botao} ${styles.retorno}`} onClick={props.onMarcarRetorno}>Marcar Retorno</button>
            <button className={`${styles.botao} ${styles.fim}`} onClick={props.onMarcarFim}>Marcar Fim</button>
            <span className={styles.separador} />
            <button className={`${styles.botao} ${styles.cortar}`} onClick={props.onCortar}><FontAwesomeIcon icon={faScissors} /> Cortar bloco</button>
        </div>
    );
};
