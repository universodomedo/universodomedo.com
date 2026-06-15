import type { ResultadoAnaliseCenarioTestePericia } from 'types-nora-api';

import type { SeriesGraficosDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/seriesGraficosDistribuicaoTeste';
import type { CenarioSimuladorTestePericiaUdm } from './simuladorTestePericiaUdm.tipos';

export function preparaSeriesGraficosSimuladorTestePericiaUdm(cenarios: readonly CenarioSimuladorTestePericiaUdm[], resultados: readonly ResultadoAnaliseCenarioTestePericia[], quantidadeMaximaBins = 120): SeriesGraficosDistribuicaoTeste {
    const minimo = Math.min(...resultados.map(resultado => resultado.estatisticas.minimo));
    const maximo = Math.max(...resultados.map(resultado => resultado.estatisticas.maximo));
    const larguraBin = Math.max(1, Math.ceil((maximo - minimo + 1) / quantidadeMaximaBins));
    const quantidadeBins = Math.ceil((maximo - minimo + 1) / larguraBin);
    let maiorProbabilidade = 0;

    const series = cenarios.map(cenario => {
        const resultado = resultados.find(item => item.cenarioId === cenario.id);
        if (!resultado) throw new Error(`Resultado da análise não encontrado para ${cenario.nome}.`);
        const probabilidades = new Float64Array(quantidadeBins);

        for (const ponto of resultado.distribuicao) {
            const indiceBin = Math.floor((ponto.valorFinal - minimo) / larguraBin);
            probabilidades[indiceBin] += ponto.probabilidade;
        }

        const pontos = Array.from(probabilidades, (probabilidade, indice) => {
            if (probabilidade > maiorProbabilidade) maiorProbabilidade = probabilidade;
            return { resultado: Math.min(maximo, minimo + indice * larguraBin + (larguraBin - 1) / 2), probabilidade };
        });

        return { cenarioId: cenario.id, nome: cenario.nome, cor: cenario.cor, mediana: resultado.estatisticas.mediana.valor, pontos };
    });

    return { minimo, maximo, larguraBin, maiorProbabilidade, series };
};