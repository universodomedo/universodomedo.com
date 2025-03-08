import styles from './styles.module.css';

import Image from "next/image";

export default function Post() {
    return (
        <div className={styles.recipiente_post}>
            <div className={styles.post_parte_superior}>
                <div className={styles.recipiente_imagem_personagem}>
                    <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
                </div>
                <div className={styles.recipiente_imagem_personagem}>
                    <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
                </div>
                <div className={styles.recipiente_imagem_personagem}>
                    <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
                </div>
                <div className={styles.recipiente_imagem_personagem}>
                    <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
                </div>
                <h1>Apenas uma Prece: Aventura Finalizada!</h1>
            </div>

            <div className={styles.post_parte_inferior}>
                <div className={styles.recipiente_imagem_post}>
                    <Image alt='' src={'/testeCapa1.png'} fill />
                </div>
                <div className={styles.recipiente_informacoes_parte_inferior}>
                    <div className={styles.recipiente_informacoes_cabecalho}>
                        <h1>A Sinfonia da Vida e da Morte, o Fim do Devoto, o nascimento da Ruína</h1>
                    </div>
                    <div className={styles.recipiente_informacoes_corpo}>
                        <p>Acompanhe o fim dessa saga</p>
                    </div>
                </div>
            </div>
        </div>
    );
};