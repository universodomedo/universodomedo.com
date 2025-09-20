'use client';

import styles from './styles.module.css';
import { JSX } from 'react';

import { useContextoRascunho } from "Contextos/ContextoRascunho/contexto";
import { DadosResumo } from './subcomponentes';
import { useContextoRascunhosMestre } from 'Contextos/ContextoRascunhosMestre/contexto';

export function DetalhesRascunho_Conteudo_Corpo() {
    const { rascunho } = useContextoRascunho();

    function renderCorpo(): JSX.Element {
        return (
            <div id={styles.recipiente_corpo_detalhes_rascunho}>
                {!rascunho ? (
                    <h2>Rascunho não encotrado</h2>
                ) : (
                    <>
                        {!rascunho.possuiDetalhesConfigurados ? (
                            <h3>Não existem configurações para esse Rascunho</h3>
                        ) : (
                            <DadosResumo rascunho={rascunho} />
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <>
            {rascunho && (<h1>{rascunho.titulo}</h1>)}
            {renderCorpo()}
        </>
    );
};

export function DetalhesRascunho_Conteudo_Botoes() {
    const { limpaRascunhoSelecionado } = useContextoRascunhosMestre();
    const { alteraEstadoModalEdicao, rascunho, textoBotaoCriar, executaCriacao } = useContextoRascunho();

    function fechaRascunho() {
        limpaRascunhoSelecionado();
    };

    const botaoFechar = <button onClick={fechaRascunho}>Fechar</button>;

    if (!rascunho) return botaoFechar;

    return (
        <>
            <button onClick={() => alteraEstadoModalEdicao(true)}>Editar</button>
            <button disabled={!rascunho.possuiDetalhesConfigurados} onClick={executaCriacao}>{textoBotaoCriar}</button>
            {botaoFechar}
        </>
    );
};