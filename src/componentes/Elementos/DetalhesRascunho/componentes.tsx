'use client';

import { DetalheRascunhoSessaoUnicaDto } from 'types-nora-api';
import styles from './styles.module.css';

import { useContextoRascunho } from "Contextos/ContextoRascunho/contexto";

export function CorpoRascunho() {
    const { rascunho } = useContextoRascunho();

    return (
        <div id={styles.recipiente_corpo_detalhes_rascunho}>
            {!rascunho.possuiDetalhesConfigurados ? (
                <h3>Não existem configurações para esse Rascunho</h3>
            ) : (
                <DadosResumo detalheRascunhoSessaoUnica={rascunho.detalheRascunhoSessaoUnica!} />
            )}
        </div>
    );
};

function DadosResumo({ detalheRascunhoSessaoUnica }: { detalheRascunhoSessaoUnica: DetalheRascunhoSessaoUnicaDto }) {
    return (
        <>
            <div id={styles.recipiente_opcoes_detalhes_rascunho}>
                <div className={styles.opcao_detalhe_rascunho}>
                    <h2>Jogadores</h2>
                    <h3>4-8</h3>
                </div>
                <div className={styles.opcao_detalhe_rascunho}>
                    <h2>GEP</h2>
                    <h3>{detalheRascunhoSessaoUnica.nivelPersonagem.valorNivel}</h3>
                </div>
                <div className={styles.opcao_detalhe_rascunho}>
                    <h2>Dificuldade</h2>
                    <h3>{detalheRascunhoSessaoUnica.dificuldadeSessao.descricao}</h3>
                </div>
                <div className={styles.opcao_detalhe_rascunho}>
                    <h2>Tipo de Sessão</h2>
                    <h3>{detalheRascunhoSessaoUnica.tipoSessao.descricao}</h3>
                </div>
            </div>
            <div id={styles.recipiente_descricao_detalhes_rascunho}>
                {detalheRascunhoSessaoUnica.descricao}
            </div>
        </>
    );
};