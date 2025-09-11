'use client';

import styles from './styles.module.css';

import { useContextoRascunho } from "Contextos/ContextoRascunho/contexto";
import { DadosResumo } from './subcomponentes';

export function CorpoRascunho() {
    const { rascunho } = useContextoRascunho();

    return (
        <div id={styles.recipiente_corpo_detalhes_rascunho}>
            {!rascunho.possuiDetalhesConfigurados ? (
                <h3>Não existem configurações para esse Rascunho</h3>
            ) : (
                <DadosResumo rascunho={rascunho} />
            )}
        </div>
    );
};