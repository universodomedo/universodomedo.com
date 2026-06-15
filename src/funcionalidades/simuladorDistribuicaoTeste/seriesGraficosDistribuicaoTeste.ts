import type { ConfiguracaoCenarioDistribuicaoTeste, ResultadoTeoricoCenarioTeste } from './simuladorDistribuicaoTeste.tipos';

export interface PontoSerieGraficoDistribuicaoTeste {
    readonly resultado: number;
    readonly probabilidade: number;
};

export interface SerieGraficoDistribuicaoTeste {
    readonly cenarioId: string;
    readonly nome: string;
    readonly cor: string;
    readonly mediana: number;
    readonly pontos: readonly PontoSerieGraficoDistribuicaoTeste[];
};

export interface SeriesGraficosDistribuicaoTeste {
    readonly minimo: number;
    readonly maximo: number;
    readonly larguraBin: number;
    readonly maiorProbabilidade: number;
    readonly series: readonly SerieGraficoDistribuicaoTeste[];
};

export function preparaSeriesGraficosDistribuicaoTeste(cenarios: readonly ConfiguracaoCenarioDistribuicaoTeste[], resultadosTeoricos: readonly ResultadoTeoricoCenarioTeste[], quantidadeMaximaBins = 120): SeriesGraficosDistribuicaoTeste {
    const minimo = Math.min(...resultadosTeoricos.map(resultado => resultado.distribuicao.minimo));
    const maximo = Math.max(...resultadosTeoricos.map(resultado => resultado.distribuicao.maximo));
    const larguraBin = Math.max(1, Math.ceil((maximo - minimo + 1) / quantidadeMaximaBins));
    const quantidadeBins = Math.ceil((maximo - minimo + 1) / larguraBin);
    let maiorProbabilidade = 0;

    const series = cenarios.map(cenario => {
        const teorico = resultadosTeoricos.find(resultado => resultado.cenarioId === cenario.id);
        if (!teorico) throw new Error(`Resultado teórico não encontrado para ${cenario.nome}.`);
        const pontos = agregaProbabilidades(teorico.distribuicao.minimo, teorico.distribuicao.probabilidades, minimo, maximo, larguraBin, quantidadeBins);
        pontos.forEach(ponto => { if (ponto.probabilidade > maiorProbabilidade) maiorProbabilidade = ponto.probabilidade; });
        return { cenarioId: cenario.id, nome: cenario.nome, cor: cenario.cor, mediana: teorico.estatisticas.mediana.valor, pontos };
    });

    return { minimo, maximo, larguraBin, maiorProbabilidade, series };
};

function agregaProbabilidades(minimoDistribuicao: number, probabilidadesDistribuicao: ArrayLike<number>, minimoGlobal: number, maximoGlobal: number, larguraBin: number, quantidadeBins: number): readonly PontoSerieGraficoDistribuicaoTeste[] {
    const probabilidades = new Float64Array(quantidadeBins);

    for (let indice = 0; indice < probabilidadesDistribuicao.length; indice += 1) {
        const resultado = minimoDistribuicao + indice;
        const indiceBin = Math.floor((resultado - minimoGlobal) / larguraBin);
        probabilidades[indiceBin] += probabilidadesDistribuicao[indice];
    }

    return Array.from(probabilidades, (probabilidade, indice) => ({ resultado: Math.min(maximoGlobal, minimoGlobal + indice * larguraBin + (larguraBin - 1) / 2), probabilidade }));
};