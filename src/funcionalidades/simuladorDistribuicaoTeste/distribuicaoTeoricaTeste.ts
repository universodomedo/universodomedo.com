import { calculaEstatisticasDistribuicaoTeste } from './estatisticasDistribuicaoTeste.ts';
import { validaConfiguracaoCenarioDistribuicaoTeste } from './regrasSimuladorDistribuicaoTeste.ts';
import type { ConfiguracaoCenarioDistribuicaoTeste, DistribuicaoProbabilidadeTeste, ResultadoTeoricoCenarioTeste } from './simuladorDistribuicaoTeste.tipos.ts';

export function calculaDistribuicaoTeoricaTeste(cenario: ConfiguracaoCenarioDistribuicaoTeste): DistribuicaoProbabilidadeTeste {
    validaConfiguracaoCenarioDistribuicaoTeste(cenario);

    const probabilidades = new Float64Array(cenario.quantidadeFaces);
    const pegaMaiorDado = cenario.quantidadeDados > 0;
    const quantidadeLancamentos = pegaMaiorDado ? cenario.quantidadeDados : Math.abs(cenario.quantidadeDados) + 1;

    for (let indice = 0; indice < probabilidades.length; indice += 1) {
        const face = indice + 1;
        probabilidades[indice] = pegaMaiorDado ? calculaProbabilidadeMaiorDado(face, cenario.quantidadeFaces, quantidadeLancamentos) : calculaProbabilidadeMenorDado(face, cenario.quantidadeFaces, quantidadeLancamentos);
    }

    return { minimo: 1 + cenario.bonus, maximo: cenario.quantidadeFaces + cenario.bonus, probabilidades };
};

export function calculaResultadoTeoricoCenarioTeste(cenario: ConfiguracaoCenarioDistribuicaoTeste, limiares: readonly number[]): ResultadoTeoricoCenarioTeste {
    const distribuicao = calculaDistribuicaoTeoricaTeste(cenario);
    return { cenarioId: cenario.id, distribuicao, estatisticas: calculaEstatisticasDistribuicaoTeste(distribuicao.minimo, distribuicao.probabilidades, limiares) };
};

function calculaProbabilidadeMaiorDado(face: number, quantidadeFaces: number, quantidadeLancamentos: number): number { return Math.pow(face / quantidadeFaces, quantidadeLancamentos) - Math.pow((face - 1) / quantidadeFaces, quantidadeLancamentos); };

function calculaProbabilidadeMenorDado(face: number, quantidadeFaces: number, quantidadeLancamentos: number): number { return Math.pow((quantidadeFaces - face + 1) / quantidadeFaces, quantidadeLancamentos) - Math.pow((quantidadeFaces - face) / quantidadeFaces, quantidadeLancamentos); };