'use client';

import styles from './styles.module.css';
import { AventuraDto } from "types-nora-api";

import Image from "next/image";

export default function PaginaAventurasComDados({ dadosAventuras }: { dadosAventuras: AventuraDto[] }) {
    return (
        <div id={styles.recipiente_pagina_aventuras}>
            <SecaoBarraDeBuscaDeAventuras />
            <SecaoCorpoAventuras dadosAventuras={dadosAventuras} />
        </div>
    );
};

export function SecaoBarraDeBuscaDeAventuras() {
    return (
        <div id={styles.recipiente_barra_busca}>

        </div>
    );
};

export function SecaoCorpoAventuras({ dadosAventuras }: { dadosAventuras: AventuraDto[] }) {
    return (
        <div id={styles.recipiente_corpo_aventuras}>
            <div id={styles.recipiente_aventura_principal}></div>
            <div id={styles.recipiente_menu_aventuras}>
                {dadosAventuras.map((aventura, index) => (
                    <div key={index} className={styles.recipiente_item_menu_aventuras}>
                        <div className={styles.recipiente_imagem_aventura}>
                            <Image alt='' src={`/testeCapa1.png`} fill />
                            {/* <Image alt='' src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}${aventura.imagemCapa?.caminho}`} fill /> */}
                        </div>
                        <div className={styles.recipiente_dados_aventura}>
                            <h3>{aventura.titulo}</h3>
                            <h3>{aventura.obtemEstadoAtual}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};