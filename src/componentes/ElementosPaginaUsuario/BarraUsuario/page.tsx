import styles from './style.module.css';

import Image from "next/image";

export default function BarraUsuario() {
    return (
        <div id={styles.barra_usuario}>
            <div className={styles.recipiente_imagem_usuario}>
                <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
            </div>
            <div className={styles.recipiente_informacoes_usuario}>
                <h1>Usuário n1</h1>
            </div>
        </div>
    );
};