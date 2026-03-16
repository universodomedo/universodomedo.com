'use client';

import styles from './styles.module.css';

import { FichaTemporariaVisualizacaoDetalhadaDto, VIEW_SessaoDeJogadorDto } from 'types-nora-api';

import { ContextoSelecionarFichaSessaoUnicaProvider, useContextoSelecionarFichaSessaoUnica } from 'Contextos/ContextoSelecionarFichaSessaoUnica/contexto';
import SelecionadorFichaTemporaria from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorFichaTemporaria/SelecionadorFichaTemporaria';

export default function RecipienteSelecionarFichaSessaoUnica({ sessao, fichas }: { sessao: VIEW_SessaoDeJogadorDto; fichas: FichaTemporariaVisualizacaoDetalhadaDto[] }) {
    return (
        <ContextoSelecionarFichaSessaoUnicaProvider sessao={sessao} fichas={fichas}>
            <RecipienteSelecionadorFichaTemporaria/>
        </ContextoSelecionarFichaSessaoUnicaProvider>
    );
};

function RecipienteSelecionadorFichaTemporaria() {
    const { fichas, idFichaTemporariaSelecionada, setIdFichaTemporariaSelecionada, fichaSelecionada, selecionarFichaTemporariaParaSessao, podeSalvar } = useContextoSelecionarFichaSessaoUnica();

    return (
        <div className={styles.recipiente_dados_selecionador_ficha_temporaria_para_sessao}>
            <div className={styles.recipiente_elementos_selecionador_ficha_temporaria_para_sessao}>
                <div className={styles.recipiente_selecionador_selecionador_ficha_temporaria_para_sessao}>
                    <SelecionadorFichaTemporaria options={fichas} idSelecionado={idFichaTemporariaSelecionada} onSelectIdFicha={idFichaTemporaria => { setIdFichaTemporariaSelecionada(idFichaTemporaria); }} />
                </div>
                <button onClick={selecionarFichaTemporariaParaSessao} disabled={!podeSalvar}>Selecionar</button>
            </div>
            {fichaSelecionada && (
                <div className={styles.recipiente_dados_ficha_selecionada}>
                    <h2>{fichaSelecionada.nome} | {fichaSelecionada.nivel?.nomeVisualizacao}</h2> 
                    <h3>{fichaSelecionada.descricao}</h3>
                </div>
            )}
        </div>
    );
};