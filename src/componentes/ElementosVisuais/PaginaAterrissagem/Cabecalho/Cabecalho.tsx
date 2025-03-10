import styles from './styles.module.css';
import Link from 'next/link';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';
import ElementoSVGAnimado from 'Componentes/Elementos/ElementoSVGAnimado/ElementoSVGAnimado';
import ComponenteBotaoAcessar from 'Componentes/ElementosVisuais/BotaoAcessar/botao-acessar';

export default function SecaoCabecalho() {
    return (
        <div id={styles.cabecalho}>
            <div id={styles.cabecalho_esquerda}>
                <div id={styles.recipiente_logo}>
                    <Link href={'/'}><ElementoSVG src={"/imagensFigma/logo-cabecalho.svg"} /></Link>
                </div>
            </div>

            <div id={styles.cabecalho_direita}>
                <div id={styles.cabecalho_direita_linha}>
                    <div id={styles.recipiente_linha_cabecalho}>
                        <ElementoSVG className={styles.linha_cabecalho} src={"/imagensFigma/linha-cabecalho.svg"} />
                    </div>
                    {/* <ElementoSVGAnimado className={styles.linha_cabecalho} src={"/imagensFigma/linha-cabecalho.svg"} /> */}
                </div>
                <div id={styles.cabecalho_direita_acesso}>
                    <ComponenteBotaoAcessar />
                </div>
            </div>
        </div>
    );
};