'use client';

import styles from './styles.module.css';
import { useEffect, useState } from "react";
import { ControladorSlot } from 'Layouts/ControladorSlot';

import { useContextoPerformance } from "Contextos/ContextoPerformace/contexto";
import { obtemDadosProximaSessao } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { SessaoDto } from 'types-nora-api';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { ContextoSessoesPrevistasProvider, useContextoSessoesPrevistas } from 'Contextos/ContextoSessoesPrevistas/contexto';

export default function PaginaSessao() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoSessoesPrevistasProvider>
                <PaginaSessao_Slot/>
            </ContextoSessoesPrevistasProvider>
        </ControladorSlot>
    );
};

function PaginaSessao_Slot() {
    return true ? <PaginaSessao_EmEspera /> : <PaginaSessao_EmPreparo />
};

function PaginaSessao_EmEspera() {
    const { listaEpisodiosPrevistos } = useContextoSessoesPrevistas();

    return (
        <div id={styles.recipiente_sessao_prevista}>
            {listaEpisodiosPrevistos.length === 0 ? (
                <h1>Nenhuma Sessão Prevista</h1>
            ) : (
                <h1>Sessões</h1>
            )}
        </div>
    );
};

function PaginaSessao_EmPreparo() {
    return (
        <></>
    );
};