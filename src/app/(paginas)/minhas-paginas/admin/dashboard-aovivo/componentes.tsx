'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { Eventos_Emite, SOCKET_SalaDeJogo } from 'types-nora-api';

import { ContextoSessaoEmAndamentoProvider, useContextoSessaoEmAndamento } from "Contextos/ContextosPaginaAovivo/ContextoSessaoEmAndamento/contexto";
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

export function DashboardAovivo_Slot() {
    const [ salas, setSalas ] = useState<SOCKET_SalaDeJogo[]>([]);

    useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirTodasSalas, data => {
        setSalas(data.salas);
    });

    if (salas.length < 1) return <h1>Não há salas</h1>;

    return (
        <table style={{textAlign: 'center', width: 'fitContent'}}>
            <thead>
                <th>Codigo</th>
                <th>Id</th>
                <th>Num.Participantes</th>
            </thead>
            <tbody>
                {salas.map((sala, index) => (
                    <tr key={index}>
                        <td style={{padding: '8px 12px'}}>{sala.codigoSala}</td>
                        <td style={{padding: '8px 12px'}}>{sala.idSessao}</td>
                        <td style={{padding: '8px 12px'}}>{sala.jogadores.length}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

/* export function DashboardAovivo_Contexto() {
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
}; */