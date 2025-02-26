import styles from './styles.module.css';
import Image from 'next/image';

import ComponenteBotaoAcessar from 'Componentes/ElementosVisuais/BotaoAcessar/botao-acessar';

export default async function SecaoCabecalho() {
    return (
        <header id={styles.cabecalho}>
            <div id={styles.cabecalho_esquerda}>
                <div id={styles.cabecalho_esquerda_opcoes}>
                    <Image src={"/imagensFigma/opcoes-cabecalho.svg"} alt="Menu" layout={'fill'} quality={100} />
                </div>
                <div id={styles.cabecalho_esquerda_logo}>
                    <Image src={"/imagensFigma/logo-cabecalho.svg"} alt="Logo" layout={'fill'} quality={100} />
                </div>
            </div>

            <div id={styles.cabecalho_direita}>
                <div id={styles.cabecalho_direita_linha}>
                    <Image id={styles.linha_cabecalho} src={"/imagensFigma/linha-cabecalho.svg"} alt='' layout={'fill'} quality={100} />
                </div>
                <div id={styles.cabecalho_direita_acesso}>
                    <ComponenteBotaoAcessar />
                </div>
            </div>
        </header>
    );
};