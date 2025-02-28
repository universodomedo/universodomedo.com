'use client';

// #region Imports
import styles from './styles.module.css';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';

import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
// #endregion

export default function () {
    const { alternaMenuAberto } = useContextoMenuSwiperEsquerda();

    return (
        <div id={styles.cabecalho_esquerda_opcoes} onClick={alternaMenuAberto}>
            <ElementoSVG src={"/imagensFigma/opcoes-cabecalho.svg"} />
        </div>
    );
}