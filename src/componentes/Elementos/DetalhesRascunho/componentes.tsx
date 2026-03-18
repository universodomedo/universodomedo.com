'use client';

import styles from './styles.module.css';

import { JSX } from 'react';

import { useContextoRascunho } from "Contextos/ContextoRascunho/contexto";
import { DadosResumo } from './subcomponentes';
import { useContextoPaginaRascunhosMestre__ComRascunhoSelecionado } from 'Contextos/ContextoPaginaRascunhosMestre__ComRascunhoSelecionado/contexto';

export default function DetalhesRascunho_Conteudo() {
    return (
        <div id={styles.recipiente_detalhes_rascunho}>
            <DetalhesRascunho_Conteudo_Corpo />
            <div id={styles.recipiente_botoes_rascunho}>
                <DetalhesRascunho_Conteudo_Botoes />
            </div>
        </div>
    );
};

function DetalhesRascunho_Conteudo_Corpo() {
    const { rascunho } = useContextoRascunho();

    return (
        <>
            {rascunho && (<h1>{rascunho.titulo}</h1>)}
            {RenderCorpo()}
        </>
    );
};

function RenderCorpo(): JSX.Element {
    const { rascunho } = useContextoRascunho();
    
    return (
        <div id={styles.recipiente_corpo_detalhes_rascunho}>
            {!rascunho ? (
                <h2>Rascunho não encontrado</h2>
            ) : (
                <DadosResumo rascunho={rascunho} />
            )}
        </div>
    );
};

function DetalhesRascunho_Conteudo_Botoes() {
    const { deselecionaRascunho } = useContextoPaginaRascunhosMestre__ComRascunhoSelecionado();
    const { alteraEstadoModalEdicao } = useContextoRascunho();

    return (
        <>
            <button onClick={deselecionaRascunho}>Fechar</button>
            <button onClick={() => alteraEstadoModalEdicao(true)}>Editar</button>
        </>
    );
};