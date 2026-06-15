import assert from 'node:assert/strict';

import { calculaDistribuicaoTeoricaTeste, calculaResultadoTeoricoCenarioTeste } from './distribuicaoTeoricaTeste.ts';
import { criaResumoAnaliticoDistribuicaoTeste } from './resumoAnaliticoDistribuicaoTeste.ts';
import { preparaSeriesGraficosDistribuicaoTeste } from './seriesGraficosDistribuicaoTeste.ts';
import type { ConfiguracaoCenarioDistribuicaoTeste } from './simuladorDistribuicaoTeste.tipos.ts';

const cenarioD20 = criaCenario('d20', 1, 20, 0);
const resultadoD20 = calculaResultadoTeoricoCenarioTeste(cenarioD20, [20]);

assert.equal(resultadoD20.distribuicao.minimo, 1);
assert.equal(resultadoD20.distribuicao.maximo, 20);
assert.ok(aproximadamenteIgual(resultadoD20.estatisticas.media, 10.5));
assert.deepEqual(resultadoD20.estatisticas.mediana, { inferior: 10, superior: 11, valor: 10.5 });
assert.deepEqual(resultadoD20.estatisticas.modas, Array.from({ length: 20 }, (_, indice) => indice + 1));
assert.ok(Math.abs(resultadoD20.estatisticas.probabilidadesAcumuladas[0].probabilidade - 0.05) < 1e-12);
assert.ok(resultadoD20.distribuicao.probabilidades.every(probabilidade => Math.abs(probabilidade - 0.05) < 1e-12));
assert.equal(criaResumoAnaliticoDistribuicaoTeste(cenarioD20, resultadoD20), 'Ao jogar 1d20, todos os valores de 1 a 20 são igualmente prováveis, com 5,00% cada. O menor valor é 1 e o maior é 20, ambos com 5,00% de chance.');
assert.equal(preparaSeriesGraficosDistribuicaoTeste([cenarioD20], [resultadoD20]).series[0].mediana, 10.5);

const resultado2d6 = calculaResultadoTeoricoCenarioTeste(criaCenario('2d6', 2, 6, 0), [6]);
assert.ok(aproximadamenteIgual(resultado2d6.estatisticas.media, 161 / 36));
assert.deepEqual(resultado2d6.estatisticas.modas, [6]);
assert.ok(aproximadamenteIgual(resultado2d6.estatisticas.probabilidadesAcumuladas[0].probabilidade, 11 / 36));

const resultado3d20 = calculaResultadoTeoricoCenarioTeste(criaCenario('3d20', 3, 20, 5), [50]);
assert.equal(resultado3d20.distribuicao.minimo, 6);
assert.equal(resultado3d20.distribuicao.maximo, 25);
assert.ok(aproximadamenteIgual(resultado3d20.estatisticas.media, 20.4875));
assert.deepEqual(resultado3d20.estatisticas.modas, [25]);
assert.equal(criaResumoAnaliticoDistribuicaoTeste(criaCenario('3d20', 3, 20, 5), resultado3d20), 'Ao jogar 3d20 + 5, o valor mais provável é 25, com 14,26% de chance. O menor valor é 6, com 0,0125%, e o maior é 25, com 14,26% de chance.');

const resultado5d20 = calculaResultadoTeoricoCenarioTeste(criaCenario('5d20', 5, 20, 5), [20]);
assert.ok(aproximadamenteIgual(resultado5d20.estatisticas.media, 22.14584375));

const resultadoMenor3d20 = calculaResultadoTeoricoCenarioTeste(criaCenario('-2d20', -2, 20, 5), [20]);
assert.equal(resultadoMenor3d20.distribuicao.minimo, 6);
assert.equal(resultadoMenor3d20.distribuicao.maximo, 25);
assert.ok(aproximadamenteIgual(resultadoMenor3d20.estatisticas.media, 10.5125));
assert.deepEqual(resultadoMenor3d20.estatisticas.modas, [6]);
assert.ok(aproximadamenteIgual(resultadoMenor3d20.distribuicao.probabilidades[0], 1 - Math.pow(19 / 20, 3)));
assert.throws(() => calculaDistribuicaoTeoricaTeste(criaCenario('zero', 0, 20, 0)), /exceto zero/);

const semBonus = calculaDistribuicaoTeoricaTeste(criaCenario('sem-bonus', 3, 12, 0));
const comBonus = calculaDistribuicaoTeoricaTeste(criaCenario('com-bonus', 3, 12, 10));
assert.deepEqual(Array.from(semBonus.probabilidades), Array.from(comBonus.probabilidades));
assert.equal(comBonus.minimo - semBonus.minimo, 10);
assert.ok(Math.abs(Array.from(resultado3d20.distribuicao.probabilidades).reduce((total, probabilidade) => total + probabilidade, 0) - 1) < 1e-12);

console.log('Simulador de distribuição: validações concluídas com sucesso.');

function criaCenario(id: string, quantidadeDados: number, quantidadeFaces: number, bonus: number): ConfiguracaoCenarioDistribuicaoTeste {
    return { id, nome: id, quantidadeDados, quantidadeFaces, bonus, cor: '#ffffff' };
};

function aproximadamenteIgual(valor: number, esperado: number): boolean { return Math.abs(valor - esperado) < 1e-12; };