'use client';

import styles from './styles.module.css';

import { ContextoSessaoEmAndamentoProvider, useContextoSessaoEmAndamento } from "Contextos/ContextosPaginaAovivo/ContextoSessaoEmAndamento/contexto";
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";

export function DashboardAovivo_Contexto() {
    return (
        <ContextoSessaoEmAndamentoProvider>
            <DashboardAovivo_Conteudo />
        </ContextoSessaoEmAndamentoProvider>
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
    const { sessaoEmAndamento } = useContextoSessaoEmAndamento();

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
    const { sessaoEmAndamento } = useContextoSessaoEmAndamento();

    if (!sessaoEmAndamento) return;

    return ( <></>
        // <SecaoDeConteudo id={styles.recipiente_informacoes_fichas}>
        //     {personagensEmSessao.map(personagem => <p>Ficha {personagem.informacao.nome}</p>)}
        // </SecaoDeConteudo>
    );
};