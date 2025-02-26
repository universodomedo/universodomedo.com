import styles from './styles.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default async function ComponenteBotaoAcessar() {
    
    return (
        <>
            <div className={styles.recipiente_icones_acesso}>
                <Image src={"/imagensFigma/icone-lateral-botao-acessar.svg"} id={styles.icones_esquerda} alt='' className={styles.imagens_botao_acesso} layout={'fill'} quality={100} />
            </div>
            <div id={styles.recipiente_icones_acesso_botao} className={styles.recipiente_icones_acesso}>
                <BotaoAcessar />            
            </div>
            <div id={styles.recipiente_icones_lateral_direita} className={styles.recipiente_icones_acesso}>
                <Image src={"/imagensFigma/icone-lateral-botao-acessar.svg"} id={styles.icones_direita} alt='' className={styles.imagens_botao_acesso} layout={'fill'} quality={100} />
            </div>
        </>
    );
};

function BotaoAcessar() {
    return (
        <Link id={styles.botao_acessar} href={'/acessar'}>
            {/* <Image src={"/imagensFigma/brilho-botao-acessar.svg"} alt="Acessar" className={styles.imagens_botao_acesso} layout={'fill'} quality={100} /> */}
            <Image src={"/imagensFigma/moldura-botao-acessar.svg"} alt="Acessar" className={styles.imagens_botao_acesso} layout={'fill'} quality={100} />
            <Image src={"/imagensFigma/fundo-botao-acessar.svg"} alt="Acessar" className={styles.imagens_botao_acesso} layout={'fill'} quality={100} />
        </Link>
    );
};