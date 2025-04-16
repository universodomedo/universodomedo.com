'use client';

import styles from './styles.module.css';
import { AventuraDto } from "types-nora-api";

import { obtemAventuraCompleta } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto.tsx';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import React from 'react';

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

        if (respostaDadosPaginaAventuras) setAventuraSelecionada(respostaDadosPaginaAventuras);
    };

    return (
        <div id={styles.recipiente_corpo_aventuras}>
            {aventuraSelecionada !== undefined ? (
                <div id={styles.recipiente_aventura_selecionada}>
                    <div id={styles.recipiente_cabecalho_aventura_selecionada}>
                        <div id={styles.recipiente_capa_cabecalho_aventura_selecionada}>
                            <RecipienteImagem src={aventuraSelecionada.imagemCapa?.fullPath} />
                        </div>
                        <div>
                            <h1>{aventuraSelecionada.titulo}</h1>
                        </div>
                    </div>
                    <div id={styles.recipiente_corpo_aventura_selecionada}>
                        {aventuraSelecionada.gruposAventura?.map(grupo => (
                            <React.Fragment key={grupo.id}>
                                <h1>{grupo.nome}</h1>
                                <div id={styles.recipiente_personagens_participantes}>
                                    {grupo.personagensDaAventura?.map((personagensDaAventura, index) => (
                                        <div key={index} className={styles.recipiente_imagem_personagem_participante}>
                                            <RecipienteImagem key={personagensDaAventura.personagem.id} src={personagensDaAventura.personagem.imagemAvatar?.fullPath} />
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            ) : (
                <div id={styles.recipiente_aventura_selecionada}>
                    <div id={styles.recipiente_cabecalho_aventura_selecionada}>
                        <div id={styles.recipiente_capa_cabecalho_aventura_selecionada}>
                            <RecipienteImagem src={''} />
                        </div>
                        <div>
                            <h1>Apenas uma Prece</h1>
                        </div>
                    </div>
                    <div id={styles.recipiente_corpo_aventura_selecionada}>

                    </div>
                </div>
            )}

            <div id={styles.recipiente_menu_aventuras}>
                {dadosAventuras.map((aventura, index) => (
                    <div key={index} className={styles.recipiente_item_menu_aventuras} onClick={() => { selecionaAventura(aventura.id) }}>
                        <div className={styles.recipiente_imagem_aventura_item_menu}>
                            <RecipienteImagem src={aventura.imagemCapa?.fullPath} />
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