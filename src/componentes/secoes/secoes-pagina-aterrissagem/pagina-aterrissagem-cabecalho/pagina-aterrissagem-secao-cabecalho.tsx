import styles from './styles.module.css';
import Image from 'next/image';

import { obtemDimensoesImage } from 'Helpers/obtemDimensoesImage.ts';

import BotaoAcessar from 'Componentes/elementos-visuais/BotaoAcessar/botao-acessar';

export default async function SecaoCabecalho() {
    const imagePathOpcoesCabecalho = "/imagensFigma/opcoes-cabecalho.png";
    const { width: widthIconeOpcoesCabecalho, height: heightIconeOpcoesCabecalho } = await obtemDimensoesImage(imagePathOpcoesCabecalho);

    const imagePathLogoCabecalho = "/imagensFigma/logo-cabecalho.png";
    const { width: widthIconeLogoCabecalho, height: heightIconeLogoCabecalho } = await obtemDimensoesImage(imagePathLogoCabecalho);

    const imagePathLinhaCabecalho = "/imagensFigma/linha-cabecalho.png";
    const { width: widthIconeLinhaCabecalho, height: heightIconeLinhaCabecalho } = await obtemDimensoesImage(imagePathLinhaCabecalho);

    return (
        <header id={styles.cabecalho}>
            <div id={styles.cabecalho_esquerda}>
                <div id={styles.cabecalho_esquerda_opcoes}>
                    <Image src={imagePathOpcoesCabecalho} alt="Menu" width={widthIconeOpcoesCabecalho} height={heightIconeOpcoesCabecalho} style={{ objectFit: "contain" }} quality={100} />
                </div>
                <div id={styles.cabecalho_esquerda_logo}>
                    <Image src={imagePathLogoCabecalho} alt="Logo" width={widthIconeLogoCabecalho} height={heightIconeLogoCabecalho} style={{ objectFit: "contain" }} quality={100} />
                </div>
            </div>

            <div id={styles.cabecalho_direita}>
                <div id={styles.cabecalho_direita_linha}>
                    <Image src={imagePathLinhaCabecalho} alt='' id={styles.imagem_linha_cabecalho} width={widthIconeLinhaCabecalho} height={heightIconeLinhaCabecalho} layout='responsive' quality={100} />
                </div>
                <div id={styles.cabecalho_direita_acesso}>
                    <BotaoAcessar />
                </div>
            </div>
        </header>
    );
};