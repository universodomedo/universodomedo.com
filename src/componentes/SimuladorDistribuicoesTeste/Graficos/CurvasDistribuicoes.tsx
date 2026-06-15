import type { SeriesGraficosDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/seriesGraficosDistribuicaoTeste';
import { formataNumeroDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/formatacaoSimuladorDistribuicaoTeste';
import { criaEscalaXGrafico, criaEscalaYGrafico, GRAFICO_ALTURA, GRAFICO_LARGURA, GRAFICO_MARGEM } from './configuracaoGrafico';
import EixosGrafico from './EixosGrafico';

export default function CurvasDistribuicoes({ dados }: { dados: SeriesGraficosDistribuicaoTeste; }) {
    const escalaX = criaEscalaXGrafico(dados.minimo, dados.maximo);
    const escalaY = criaEscalaYGrafico(dados.maiorProbabilidade);

    return (
        <svg viewBox={`0 0 ${GRAFICO_LARGURA} ${GRAFICO_ALTURA}`} role="img" aria-label="Curvas comparativas das distribuições">
            <EixosGrafico minimo={dados.minimo} maximo={dados.maximo} maiorProbabilidade={dados.maiorProbabilidade} />
            {dados.series.map(serie => (
                <line key={`mediana-${serie.cenarioId}`} x1={escalaX(serie.mediana)} x2={escalaX(serie.mediana)} y1={GRAFICO_MARGEM.topo} y2={GRAFICO_ALTURA - GRAFICO_MARGEM.inferior} stroke={serie.cor} strokeWidth={2} strokeDasharray="7 6" opacity={0.82} vectorEffect="non-scaling-stroke">
                    <title>{`${serie.nome}: mediana ${formataNumeroDistribuicaoTeste(serie.mediana)}`}</title>
                </line>
            ))}
            {dados.series.map(serie => <polyline key={serie.cenarioId} points={serie.pontos.map(ponto => `${escalaX(ponto.resultado)},${escalaY(ponto.probabilidade)}`).join(' ')} fill="none" stroke={serie.cor} strokeWidth={3.2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />)}
        </svg>
    );
};