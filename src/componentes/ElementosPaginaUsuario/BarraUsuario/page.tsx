import styles from './style.module.css';
import Image from "next/image";

import { UsuarioDto } from 'types-nora-api';

export default function BarraUsuario({ dadosMinhaPagina }: { dadosMinhaPagina: UsuarioDto }) {
    return (
        <div id={styles.barra_usuario}>
            <div className={styles.recipiente_imagem_usuario}>
                {/* essa url deve ser montada com uma variavel de ambiente contendo a URL e /imagem1 é recuperado no dadosMinhaPagina */}
                <Image alt='' src={`/imagem-perfil-vazia.png`} fill />
                {/* <Image alt='' src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}${dadosMinhaPagina.customizacao.caminhoAvatar}`} fill /> */}
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