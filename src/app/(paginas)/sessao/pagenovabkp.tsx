'use client';

import styles from './styles.module.css';
import { useEffect, useState } from "react";
import { ControladorSlot } from 'Layouts/ControladorSlot';

import { useContextoPerformance } from "Contextos/ContextoPerformace/contexto";
import { obtemDadosProximaSessao } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { SessaoDto } from 'types-nora-api';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function PaginaSessao() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: false }}>
            <PaginaSessao_Slot/>
        </ControladorSlot>
    );
};

function PaginaSessao_Slot() {
    return true ? <PaginaSessao_EmEspera /> : <PaginaSessao_EmPreparo />
};

function PaginaSessao_EmEspera() {
    return (
        <div id={styles.recipiente_sessao_prevista}>
            
        </div>
    );
};

function PaginaSessao_EmPreparo() {
    return (
        <></>
    );
};