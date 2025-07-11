'use client';

import styles from './styles.module.css';
import { useEffect, useState } from "react";
import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';

import { useContextoPerformance } from "Contextos/ContextoPerformace/contexto";
import { obtemDadosProximaSessao } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { SessaoDto } from 'types-nora-api';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function PaginaSessao() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.SESSAO_AOVIVO, comCabecalho: false, usuarioObrigatorio: false }}>
            <PaginaSessao_Slot/>
        </ControladorSlot>
    );
};

function PaginaSessao_Slot() {
    const [sessaoEmAndamento, setSessaoEmAndamento] = useState<SessaoDto | null>(null);

    const { setAnimacoesHabilitadas } = useContextoPerformance();

    async function obtemSessaoEmAndamento() {
        setSessaoEmAndamento(await obtemDadosProximaSessao());
    };

    useEffect(() => {
        setAnimacoesHabilitadas(false);

        obtemSessaoEmAndamento();
    }, []);

    if (!sessaoEmAndamento) return (<div>Carregando Dados Sessão</div>);

    return (
        <div id={styles.recipiente_pagina_sessao}>
            <div id={styles.recipiente_espaco_sessao}>
                <div id={styles.recipiente_titulo_sessao}>
                    <span id={styles.udm}>Universo do Medo</span>
                </div>

                <div id={styles.recipiente_corpo_sessao}>
                    <div id={styles.recipiente_esquerda_tela_jogo}>
                        <div id={styles.recipiente_nome_aventura}>
                            <h1>{sessaoEmAndamento.grupoAventura.aventura.titulo}</h1>
                        </div>
                        <div id={styles.recipiente_lista_retratos}>
                            {sessaoEmAndamento.grupoAventura.personagensDaAventura?.map(personagemDaAventura => (
                                <div key={personagemDaAventura.personagem.id} className={styles.recipiente_retrato}>
                                    <RecipienteImagem src={personagemDaAventura.personagem.imagemAvatar?.fullPath} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div id={styles.recipiente_tela_jogo}>
                        <RecipienteImagem src={sessaoEmAndamento.grupoAventura.aventura.imagemCapa?.fullPath} />
                    </div>
                </div>
            </div>
        </div>
    );
};