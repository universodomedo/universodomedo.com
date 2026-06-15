import { useMemo } from 'react';
import type { ResultadoAnaliseCenarioTestePericia } from 'types-nora-api';

import CurvasDistribuicoes from 'Componentes/SimuladorDistribuicoesTeste/Graficos/CurvasDistribuicoes';
import HistogramaDistribuicoes from 'Componentes/SimuladorDistribuicoesTeste/Graficos/HistogramaDistribuicoes';
import LegendaGraficos from 'Componentes/SimuladorDistribuicoesTeste/Graficos/LegendaGraficos';
import { preparaSeriesGraficosSimuladorTestePericiaUdm } from 'Funcionalidades/simuladorTestePericiaUdm/seriesGraficosSimuladorTestePericiaUdm';
import type { CenarioSimuladorTestePericiaUdm } from 'Funcionalidades/simuladorTestePericiaUdm/simuladorTestePericiaUdm.tipos';
import styles from './styles.module.css';

interface PropsPainelGraficosTestePericiaUdm {
    readonly cenarios: readonly CenarioSimuladorTestePericiaUdm[];
    readonly resultados: readonly ResultadoAnaliseCenarioTestePericia[];
};

export default function PainelGraficosTestePericiaUdm({ cenarios, resultados }: PropsPainelGraficosTestePericiaUdm) {
    const dados = useMemo(() => preparaSeriesGraficosSimuladorTestePericiaUdm(cenarios, resultados), [cenarios, resultados]);

    return (
        <section className={styles.secaoGraficos}>
            <LegendaGraficos series={dados.series} />
            <div className={styles.gradeGraficos}>
                <article className={styles.painelGrafico}>
                    <header><h2>Histograma</h2><span>Probabilidade matemática por faixa de resultado final</span></header>
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