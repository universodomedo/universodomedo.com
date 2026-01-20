import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';
import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';
import ComponenteBotaoAcessar from 'Componentes/ElementosVisuais/BotaoAcessar/botao-acessar';

export default function SecaoCabecalho() {
    return (
        <div className={styles.cabecalho}>
            <div id={styles.cabecalho_esquerda}>
                <div id={styles.recipiente_logo}>
                    <LinkInterno destino={PAGINAS.home}><ElementoSVG src={"/imagensFigma/logo-cabecalho.svg"} /></LinkInterno>
                </div>
            </div>

            <div id={styles.cabecalho_direita}>
                <div id={styles.cabecalho_direita_linha}>
                    <div className={styles.linha} />
                </div>
                <div id={styles.cabecalho_direita_acesso}>
                    <ComponenteBotaoAcessar />
                </div>
            </div>
        </div>
    );
};