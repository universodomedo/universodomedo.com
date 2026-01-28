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

            </div>

            <div id={styles.conteudo_secao_principal}>
                <section className={styles.recipiente_texto_secao_principal}>
                    <h1 id={styles.titulo_secao_principal}><span className={styles.titulo_sem_decorative}>Des</span>cu<span className={styles.titulo_sem_decorative}>br</span>a <span className={styles.titulo_sem_decorative}>o</span> <span className={styles.titulo_sem_decorative}>P</span>aranor<span className={styles.titulo_sem_decorative}>m</span>al</h1>
                    <div id={styles.conteudo_textos_secao_principal}>
                        <h2 className={styles.texto_secao_principal}>Faça parte da guerra entre a Humanidade e o Paranormal</h2>
                        <h2 className={styles.texto_secao_principal}>Enfrente seus demônios internos e desvende os segredos da Realidade</h2>
                    </div>
                    <a className={styles.recipiente_botao_papel} href="#" target="_self" rel="#">
                        <img className={styles.fundo_botao_papel} src="/imagensFigma/botao-jogue-agora.webp" alt="botão de papel" />
                        <img className={styles.seta_botao_papel} src="/imagensFigma/seta-jogue-agora.webp" alt="#"/>
                        <p className={styles.texto_botao_papel}>Entre com o Discord</p>
                    </a>
                </section>
            </div>
        </div>
    );
};