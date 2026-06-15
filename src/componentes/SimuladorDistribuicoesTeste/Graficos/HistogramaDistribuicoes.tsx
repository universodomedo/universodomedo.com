import type { SeriesGraficosDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/seriesGraficosDistribuicaoTeste';
import { criaEscalaYGrafico, GRAFICO_ALTURA, GRAFICO_ALTURA_INTERNA, GRAFICO_LARGURA, GRAFICO_LARGURA_INTERNA, GRAFICO_MARGEM } from './configuracaoGrafico';
import EixosGrafico from './EixosGrafico';

export default function HistogramaDistribuicoes({ dados }: { dados: SeriesGraficosDistribuicaoTeste; }) {
    const escalaY = criaEscalaYGrafico(dados.maiorProbabilidade);
    const quantidadeBins = dados.series[0]?.pontos.length ?? 1;
    const larguraGrupo = GRAFICO_LARGURA_INTERNA / quantidadeBins;
    const larguraBarra = Math.max(0.6, (larguraGrupo / dados.series.length) * 0.78);

    return (
        <svg viewBox={`0 0 ${GRAFICO_LARGURA} ${GRAFICO_ALTURA}`} role="img" aria-label="Histograma comparativo das distribuições">
            <EixosGrafico minimo={dados.minimo} maximo={dados.maximo} maiorProbabilidade={dados.maiorProbabilidade} />
            {dados.series.map((serie, indiceSerie) => serie.pontos.map((ponto, indiceBin) => {
                const altura = GRAFICO_ALTURA - GRAFICO_MARGEM.inferior - escalaY(ponto.probabilidade);
                const x = GRAFICO_MARGEM.esquerda + indiceBin * larguraGrupo + indiceSerie * (larguraGrupo / dados.series.length) + (larguraGrupo / dados.series.length - larguraBarra) / 2;
                return <rect key={`${serie.cenarioId}-${indiceBin}`} x={x} y={GRAFICO_ALTURA - GRAFICO_MARGEM.inferior - altura} width={larguraBarra} height={Math.min(GRAFICO_ALTURA_INTERNA, altura)} fill={serie.cor} opacity={0.72} />;
            }))}
        </svg>
    );
};