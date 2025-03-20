import styles from './style.module.css';
import Image from "next/image";

import { DadosMinhaPagina } from 'types-nora-api';

export default function BarraUsuario({ dadosMinhaPagina }: { dadosMinhaPagina: DadosMinhaPagina }) {
    return (
        <div id={styles.barra_usuario}>
            <div className={styles.recipiente_imagem_usuario}>
                <Image alt='' src={dadosMinhaPagina.caminhoAvatar !== '' ? dadosMinhaPagina.caminhoAvatar : '/imagem-perfil-vazia.png'} fill />
            </div>
            <div className={styles.recipiente_informacoes_usuario}>
                <h1>{dadosMinhaPagina.username}</h1>
            </div>
            {/* <div className={styles.recipiente_conquistas_usuario}>
                <div className={styles.recipiente_conquista}>
                    <Image alt='' src={'/medalha.png'} fill />
                </div>
                <div className={styles.recipiente_conquista}>
                    <Image alt='' src={'/medalha.png'} fill />
                </div>
                <div className={styles.recipiente_conquista}>
                    <Image alt='' src={'/medalha.png'} fill />
                </div>
            </div> */}
        </div>
    );
};