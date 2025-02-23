import styles from './styles.module.css';
import Image from 'next/image';

import { obtemDimensoesImage } from 'Helpers/obtemDimensoesImage.ts';

export default async function BotaoAcessar() {
    const imagePathIconeBotaoAcessar = "/imagensFigma/icones-botao-acessar.png";
    const { width: widthIconeBotaoAcessar, height: heightIconeBotaoAcessar } = await obtemDimensoesImage(imagePathIconeBotaoAcessar);
    
    const imagePathBotaoAcessar = "/imagensFigma/botao-acessar.png";
    const { width: widthBotaoAcessar, height: heightBotaoAcessar } = await obtemDimensoesImage(imagePathBotaoAcessar);
    
    return (
        <>
            <Image src={imagePathIconeBotaoAcessar} alt='' id={styles.icones_esquerda} className={styles.imagens_botao_acesso} width={widthIconeBotaoAcessar} height={heightIconeBotaoAcessar} style={{ width: 'auto', }} layout='intrinsic' quality={100} />
            <Image src={imagePathBotaoAcessar} alt="Acessar" id={styles.botao_acessar} className={styles.imagens_botao_acesso} width={widthBotaoAcessar} height={heightBotaoAcessar} style={{ width: 'auto', }} layout='intrinsic' quality={100} />
            <Image src={imagePathIconeBotaoAcessar} alt='' id={styles.icones_direita} className={styles.imagens_botao_acesso} width={widthIconeBotaoAcessar} height={heightIconeBotaoAcessar} style={{ width: 'auto', }} layout='intrinsic' quality={100} />
        </>
    );
};