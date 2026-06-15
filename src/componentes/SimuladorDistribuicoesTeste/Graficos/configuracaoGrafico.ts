import { scaleLinear } from 'd3-scale';

export const GRAFICO_LARGURA = 1000;
export const GRAFICO_ALTURA = 360;
export const GRAFICO_MARGEM = { esquerda: 72, direita: 24, topo: 24, inferior: 58 } as const;
export const GRAFICO_LARGURA_INTERNA = GRAFICO_LARGURA - GRAFICO_MARGEM.esquerda - GRAFICO_MARGEM.direita;
export const GRAFICO_ALTURA_INTERNA = GRAFICO_ALTURA - GRAFICO_MARGEM.topo - GRAFICO_MARGEM.inferior;

export function criaEscalaXGrafico(minimo: number, maximo: number) { return scaleLinear().domain([minimo, maximo]).range([GRAFICO_MARGEM.esquerda, GRAFICO_LARGURA - GRAFICO_MARGEM.direita]); };

export function criaEscalaYGrafico(maiorProbabilidade: number) { return scaleLinear().domain([0, Math.max(maiorProbabilidade, 0.01)]).nice().range([GRAFICO_ALTURA - GRAFICO_MARGEM.inferior, GRAFICO_MARGEM.topo]); };