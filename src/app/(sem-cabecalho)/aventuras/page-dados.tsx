'use client';

import styles from './styles.module.css';
import { AventuraDto } from "types-nora-api";

import { obtemAventuraCompleta } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto.tsx';

import Image from "next/image";
import { useEffect } from 'react';

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
    const { aventuraSelecionada, setAventuraSelecionada } = useContextoPaginaAventura();

    async function selecionaAventura(idAventura: number) {
        const respostaDadosPaginaAventuras = await obtemAventuraCompleta(idAventura);

        if (respostaDadosPaginaAventuras.sucesso) setAventuraSelecionada(respostaDadosPaginaAventuras.dados);
    };

    useEffect(() => {
        console.log('aventuraSelecionada alterado', aventuraSelecionada);
    }, [aventuraSelecionada]);

    return (
        <div id={styles.recipiente_corpo_aventuras}>
            <div id={styles.recipiente_aventura_selecionada}>
                <div id={styles.recipiente_cabecalho_aventura_selecionada}>
                    <div id={styles.recipiente_capa_cabecalho_aventura_selecionada}>
                        <Image alt='' src={`/testeCapa1.png`} fill />
                    </div>
                    <div>
                        <h1>Apenas uma Prece</h1>
                    </div>
                </div>
                <div id={styles.recipiente_corpo_aventura_selecionada}>

                </div>
            </div>

            <div id={styles.recipiente_menu_aventuras}>
                {dadosAventuras.map((aventura, index) => (
                    <div key={index} className={styles.recipiente_item_menu_aventuras} onClick={() => { selecionaAventura(aventura.id) }}>
                        <div className={styles.recipiente_imagem_aventura_item_menu}>
                            <Image alt='' src={`/testeCapa1.png`} fill />
                        </div>
                        <div className={styles.recipiente_dados_aventura}>
                            <h3>{aventura.titulo}</h3>
                            <h3>{aventura.estadoAtual}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};