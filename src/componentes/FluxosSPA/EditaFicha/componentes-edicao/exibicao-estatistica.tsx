import styles from '../styles.module.css';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { EstatisticaDanificavelCompletaDto } from 'types-nora-api';
import { TooltipEvolucao_EstatisticaComGanhoPorAtributo } from '../componentes-edicao/tooltips-edicao';

export function CorpoEstatistica({ estatisticaDanificavel, exibeDetalhesAtributos }: { estatisticaDanificavel: EstatisticaDanificavelCompletaDto; exibeDetalhesAtributos?: boolean }) {
    const { ganhos } = useContextoEdicaoFicha();

    const estatisticaAtual = ganhos.fichaDeJogoEvoluida.estatisticasDanificaveis.find(estatisticaDanificavelFichaAtual => estatisticaDanificavelFichaAtual.estatisticaDanificavel.id === estatisticaDanificavel.id);
    if (!estatisticaAtual) return null;

    const estatisticaAnterior = ganhos.fichaSendoEvoluida.fichaDeJogo.estatisticasDanificaveis.find(estatisticaDanificavelFichaAnterior => estatisticaDanificavelFichaAnterior.estatisticaDanificavel.id === estatisticaDanificavel.id);
    const valorAtual = estatisticaAtual.valorMaximo;
    const valorAnterior = estatisticaAnterior?.valorMaximo;

    if (valorAnterior !== undefined && valorAnterior === valorAtual) return null;

    const textoAlteracao = valorAnterior === undefined ? String(valorAtual) : `${valorAnterior} → ${valorAtual}`;

    return (
        <div className={styles.visualizador_estatistica}>
            <TooltipEvolucao_EstatisticaComGanhoPorAtributo estatisticaDanificavel={estatisticaDanificavel} exibeDetalhesAtributos={exibeDetalhesAtributos}>
                <h2 className={styles.nome_estatistica}>{estatisticaDanificavel.nomeAbreviado}</h2>
            </TooltipEvolucao_EstatisticaComGanhoPorAtributo>
            <h2 className={styles.alteracao_valor_estatistica}>{textoAlteracao}</h2>
        </div>
    );
};