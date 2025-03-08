import styles from "./styles.module.css";
import Image from 'next/image';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';

export default function SecaoPrincipal() {
    return (
        <div id={styles.recipiente_secao_principal}>
            <div id={styles.recipiente_moldura}>
                <div id={styles.recipiente_moldura_relative}>
                    <ElementoSVG src={"/imagensFigma/moldura-completa.svg"} />
                </div>
            </div>

            <div id={styles.recipiente_imagem_fundo_secao_principal}>
                <Image src={'/imagensFigma/bg-secao-principal.png'} alt='' fill quality={100} />
            </div>

            <div id={styles.conteudo_secao_principal}>
                <h1 id={styles.titulo_secao_principal}><span className={styles.titulo_sem_decorative}>D</span>escubra o <span className={styles.titulo_sem_decorative}>P</span>aranormal</h1>
                <div id={styles.conteudo_textos_secao_principal}>
                    <h2 className={styles.texto_secao_principal}>Faça parte da guerra entre a Humanidade e o Paranormal</h2>
                    <h2 className={styles.texto_secao_principal}>Enfrente seus demônios internos e desvende os segredos da Realidade</h2>
                </div>
            </div>
        </div>
    );
};