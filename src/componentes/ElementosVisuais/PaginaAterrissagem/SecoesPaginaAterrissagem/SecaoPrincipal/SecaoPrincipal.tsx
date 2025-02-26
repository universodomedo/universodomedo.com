import styles from "./styles.module.css";

export default function SecaoPrincipal() {
    return (
        <div id={styles.recipiente_secao_principal}>
            <div className={styles.moldura_externa}>
                <div className={styles.moldura_interna} >
                    <span className={`${styles.moldura_lateral} ${styles.moldura_esquerda}`} />
                    <div id={styles.conteudo_secao_principal}>
                        <h1 id={styles.titulo_secao_principal}><span className={styles.titulo_sem_decorative}>D</span>escubra o <span className={styles.titulo_sem_decorative}>P</span>aranormal</h1>
                        <div id={styles.conteudo_textos_secao_principal}>
                            <h2 className={styles.texto_secao_principal}>Faça parte da guerra entre a Humanidade e o Paranormal</h2>
                            <h2 className={styles.texto_secao_principal}>Enfrente seus demônios internos e desvende os segredos da Realidade</h2>
                        </div>
                    </div>
                    <span className={`${styles.moldura_lateral} ${styles.moldura_direita}`} />
                </div>
            </div>
        </div>
    );
};