'use client';

import styles from './styles.module.css';

import { useContextoRascunhosMestre } from 'Contextos/ContextoRascunhosMestre/contexto';
import { useContextoRascunho } from "Contextos/ContextoRascunho/contexto";
import { CorpoRascunho } from './componentes';

export default function DetalhesRascunho_Conteudo() {
    const { limpaRascunhoSelecionado } = useContextoRascunhosMestre();
    const { alteraEstadoModalEdicao, rascunho, textoBotaoCriar, executaCriacao } = useContextoRascunho();

    function fechaRascunho() {
        limpaRascunhoSelecionado();
    };

    return (
        <div id={styles.recipiente_detalhes_rascunho}>
            <h1>{rascunho.titulo}</h1>
            <CorpoRascunho />
            <div id={styles.recipiente_botoes_rascunho}>
                <button onClick={() => alteraEstadoModalEdicao(true)}>Editar</button>
                <button disabled={!rascunho.possuiDetalhesConfigurados} onClick={executaCriacao}>{textoBotaoCriar}</button>
                <button onClick={fechaRascunho}>Fechar</button>
            </div>
        </div>
    );
};