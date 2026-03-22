import styles from '../styles.module.css';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { EstatisticaDanificavelCompletaDto } from 'types-nora-api';
import { TooltipEvolucao_EstatisticaComGanhoPorAtributo } from '../componentes-edicao/tooltips-edicao';

export function CorpoEstatistica({ estatisticaDanificavel, exibeDetalhesAtributos }: { estatisticaDanificavel: EstatisticaDanificavelCompletaDto; exibeDetalhesAtributos?: boolean }) {
    const { ganhos } = useContextoEdicaoFicha();

    const valorAnterior = ganhos.fichaSendoEvoluida.fichaDeJogo.estatisticasDanificaveis.find(estatisticaDanificavelFichaAnterior => estatisticaDanificavelFichaAnterior.estatisticaDanificavel.id === estatisticaDanificavel.id)!.valorMaximo;
    const valorAtual = ganhos.fichaDeJogoEvoluida.estatisticasDanificaveis.find(estatisticaDanificavelFichaAtual => estatisticaDanificavelFichaAtual.estatisticaDanificavel.id === estatisticaDanificavel.id)!.valorMaximo;

    return (
        <div className={styles.visualizador_estatistica}>
            <TooltipEvolucao_EstatisticaComGanhoPorAtributo estatisticaDanificavel={estatisticaDanificavel} exibeDetalhesAtributos={exibeDetalhesAtributos}>
                <h2 className={styles.nome_estatistica}>{estatisticaDanificavel.nomeAbreviado}</h2>
            </TooltipEvolucao_EstatisticaComGanhoPorAtributo>
            <h2 className={styles.alteracao_valor_estatistica}>{`${valorAnterior.toFixed(1)} → ${valorAtual.toFixed(1)}`}</h2>
        </div>
    );
};