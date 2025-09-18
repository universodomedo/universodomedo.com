'use client';

import styles from './styles.module.css';
import { useEffect, useState } from "react";
import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import { useContextoPerformance } from "Contextos/ContextoPerformace/contexto";
import { obtemDadosProximaSessao } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { SessaoDto } from 'types-nora-api';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { ContextoFichaPersonagemProvider } from 'Contextos/ContextoFichaPersonagem/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto'; // retirar depois
import ControladorSwiperFicha from 'Componentes/ElementosDeJogo/ControladorSwiperFicha/CotroladorSwiperFicha'; // retirar depois
import { PaginaSessao_Mensagens } from './componentes';

export default function PaginaSessao() {
    const { usuarioLogado } = useContextoAutenticacao(); // retirar depois

    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.SESSAO, comCabecalho: false, usuarioObrigatorio: false }}>
            <PaginaSessao_Slot />

            {usuarioLogado && (
                <ContextoFichaPersonagemProvider>
                    <ControladorSwiperFicha />
                </ContextoFichaPersonagemProvider>
            )}
        </ControladorSlot>
    );
};

function PaginaSessao_Slot() {
    const { usuarioLogado } = useContextoAutenticacao(); // retirar depois

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
        <div id={styles.recipiente_pagina_sessao_emandamento}>
            <div id={styles.recipiente_espaco_sessao}>
                <div id={styles.recipiente_titulo_sessao}>
                    <span id={styles.udm}>Universo do Medo</span>
                </div>

                <div id={styles.recipiente_corpo_sessao}>
                    <div id={styles.recipiente_esquerda_tela_jogo}>
                        <div id={styles.recipiente_nome_aventura}>
                            <h1>{sessaoEmAndamento.detalheSessaoAventura.grupoAventura!.aventura.titulo}</h1>
                        </div>
                        <div id={styles.recipiente_lista_retratos}>
                            {sessaoEmAndamento.detalheSessaoAventura.grupoAventura!.personagensDaAventura?.map(personagemDaAventura => (
                                <div key={personagemDaAventura.personagem.id} className={styles.recipiente_retrato}>
                                    <RecipienteImagem src={personagemDaAventura.personagem.imagemAvatar?.fullPath} />
                                </div>
                            ))}
                        </div>
                        {usuarioLogado && (<PaginaSessao_Mensagens />)}
                    </div>

                    <div id={styles.recipiente_tela_jogo}>
                        <RecipienteImagem src={sessaoEmAndamento.detalheSessaoAventura.grupoAventura!.aventura.imagemCapa?.fullPath} />
                    </div>
                </div>
            </div>
        </div>
    );
};