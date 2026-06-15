import { useMemo } from 'react';

import type { ConfiguracaoCenarioDistribuicaoTeste, ResultadoTeoricoCenarioTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/simuladorDistribuicaoTeste.tipos';
import { preparaSeriesGraficosDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/seriesGraficosDistribuicaoTeste';
import CurvasDistribuicoes from './CurvasDistribuicoes';
import HistogramaDistribuicoes from './HistogramaDistribuicoes';
import LegendaGraficos from './LegendaGraficos';
import styles from './styles.module.css';

interface PropsPainelGraficos {
    readonly cenarios: readonly ConfiguracaoCenarioDistribuicaoTeste[];
    readonly resultadosTeoricos: readonly ResultadoTeoricoCenarioTeste[];
};

export default function PainelGraficosDistribuicoes({ cenarios, resultadosTeoricos }: PropsPainelGraficos) {
    const dados = useMemo(() => preparaSeriesGraficosDistribuicaoTeste(cenarios, resultadosTeoricos), [cenarios, resultadosTeoricos]);

    return (
        <section className={styles.secaoGraficos}>
            <LegendaGraficos series={dados.series} />
            <div className={styles.gradeGraficos}>
                <article className={styles.painelGrafico}>
                    <header><h2>Histograma</h2><span>Probabilidade exata por faixa de resultado</span></header>
                    <HistogramaDistribuicoes dados={dados} />
                </article>
                <article className={styles.painelGrafico}>
                    <header><h2>Curva estatística</h2><span>Linhas verticais tracejadas indicam as medianas</span></header>
                    <CurvasDistribuicoes dados={dados} />
                </article>
            </div>
            {dados.larguraBin > 1 && <span className={styles.avisoBins}>Resultados agrupados em faixas de {dados.larguraBin} valores para manter a leitura do gráfico.</span>}
        </section>
    );
};