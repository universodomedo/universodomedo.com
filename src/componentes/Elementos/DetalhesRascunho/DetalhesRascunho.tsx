'use client';

import styles from './styles.module.css';

import { useContextoMestreRascunhosSessoesUnicas } from 'Contextos/ContextoMestreRascunhosSessoesUnicas/contexto';
import { useContextoRascunho } from "Contextos/ContextoRascunho/contexto";
import { CorpoRascunho } from './componentes';

export default function DetalhesRascunho_Conteudo() {
    const { limpaRascunhoSelecionado } = useContextoMestreRascunhosSessoesUnicas();
    const { alteraEstadoModalEdicao, rascunho } = useContextoRascunho();

    function fechaRascunho() {
        limpaRascunhoSelecionado();
    };

    return (
        <div id={styles.recipiente_detalhes_rascunho}>
            <h1>{rascunho.titulo}</h1>
            <CorpoRascunho />
            <div id={styles.recipiente_botoes_rascunho}>
                <button onClick={() => alteraEstadoModalEdicao(true)}>Editar</button>
                <button disabled={!rascunho.possuiDetalhesConfigurados} onClick={() => console.log(`implementar Criar Sessão`)}>Criar Sessão</button>
                <button onClick={fechaRascunho}>Fechar</button>
            </div>
        </div>
    );
};