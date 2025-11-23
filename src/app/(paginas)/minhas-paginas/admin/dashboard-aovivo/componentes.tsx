'use client';

import styles from './styles.module.css';

import { ContextoPaginaAovivoProvider, useContextoPaginaAovivo } from "Contextos/ContextoPaginaAovivo/contexto";
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";

export function DashboardAovivo_Contexto() {
    return (
        <ContextoPaginaAovivoProvider>
            <DashboardAovivo_Conteudo />
        </ContextoPaginaAovivoProvider>
    );
};

function DashboardAovivo_Conteudo() {
    return (
        <>
            <ConteudoSessao />

            <ConteudoFichas />
        </>
    );
};

function ConteudoSessao() {
    const { sessaoEmAndamento } = useContextoPaginaAovivo();

    return (
        <SecaoDeConteudo id={styles.recipiente_informacoes_sessao}>
            {sessaoEmAndamento ? (
                <h1>Sessão {sessaoEmAndamento.id} em andamento</h1>
            ) : (
                <h2>Não há sessão em andamento</h2>
            )}
        </SecaoDeConteudo>
    );
};

function ConteudoFichas() {
    const { sessaoEmAndamento, personagensEmSessao } = useContextoPaginaAovivo();

    if (!sessaoEmAndamento) return;

    return (
        <SecaoDeConteudo id={styles.recipiente_informacoes_fichas}>
            {personagensEmSessao.map(personagem => <p>Ficha {personagem.informacao.nome}</p>)}
        </SecaoDeConteudo>
    );
};