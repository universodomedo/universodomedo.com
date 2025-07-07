'use client';

import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_Estatisticas, GanhosEvolucao, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { CorpoEstatistica } from './componentes-edicao/exibicao-estatistica';

export default function EdicaoEstatisticas() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaEstatisticas = ganhos.etapaAtual as EtapaGanhoEvolucao_Estatisticas;

    return (
        <div className={`${styles.editando_ficha_estatisticas} ${styles.tira_margem}`}>
            {etapaEstatisticas.dadosGanhoAgrupados.map(ganhoEstatistica => {
                const estatisticaDanificavel = GanhosEvolucao.dadosReferencia.estatisticasDanificaveis.find(estatisticaDanificavel => estatisticaDanificavel.id === ganhoEstatistica.idEstatistica)!;

                return (
                    <CorpoEstatistica key={estatisticaDanificavel.id} estatisticaDanificavel={estatisticaDanificavel} exibeDetalhesAtributos={false} />
                );
            })}
        </div>
    );
};