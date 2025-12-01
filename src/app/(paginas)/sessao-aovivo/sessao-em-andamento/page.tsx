'use client';

import styles from './styles.module.css';
import { useEffect, useState } from "react";

import { useContextoSessaoEmAndamento } from "Contextos/ContextosPaginaAovivo/ContextoSessaoEmAndamento/contexto";
import { useContextoPersonagensEmSessao } from "Contextos/ContextosPaginaAovivo/ContextoPersonagensEmSessao/contexto";

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function PaginaSessao_SessaoEmAndamento() {
    const { sessaoEmAndamento } = useContextoSessaoEmAndamento();
    const { personagensEmSessao } = useContextoPersonagensEmSessao();
    
    return (
        <div id={styles.recipiente_pagina_sessao_emandamento}>
            <div id={styles.recipiente_espaco_sessao}>
                <div id={styles.recipiente_titulo_sessao}>
                    <span id={styles.udm}>Universo do Medo</span>
                </div>

                <div id={styles.recipiente_corpo_sessao}>
                    <div id={styles.recipiente_esquerda_tela_jogo}>
                        <div id={styles.recipiente_nome_aventura}>
                            <h1>{sessaoEmAndamento!.detalheSessaoAventura.grupoAventura!.aventura.titulo}</h1>
                        </div>
                        <div id={styles.recipiente_lista_retratos}>
                            {personagensEmSessao.map(personagemEmSessao => (
                                <div key={personagemEmSessao.id} className={styles.recipiente_retrato}>
                                    <RecipienteImagem src={personagemEmSessao.caminhoAvatar} />
                                </div>
                            ))}
                        </div>
                        {/* {usuarioLogado && (<PaginaSessao_Mensagens />)} */}
                    </div>

                    <div id={styles.recipiente_tela_jogo}>
                        <RecipienteImagem src={sessaoEmAndamento!.detalheSessaoAventura.grupoAventura!.aventura.imagemCapa?.fullPath} />
                    </div>
                </div>
            </div>
            {/* <IconeFaixaEtaria />s */}
        </div>
    );
};