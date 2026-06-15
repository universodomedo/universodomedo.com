import { formataNotacaoCenarioDistribuicaoTeste, formataNumeroDistribuicaoTeste } from './formatacaoSimuladorDistribuicaoTeste.ts';
import type { ConfiguracaoCenarioDistribuicaoTeste, ResultadoTeoricoCenarioTeste } from './simuladorDistribuicaoTeste.tipos.ts';

export function criaResumoAnaliticoDistribuicaoTeste(cenario: ConfiguracaoCenarioDistribuicaoTeste, resultado: ResultadoTeoricoCenarioTeste): string {
    const { distribuicao, estatisticas } = resultado;
    const probabilidadeMinimo = distribuicao.probabilidades[0];
    const probabilidadeMaximo = distribuicao.probabilidades[distribuicao.probabilidades.length - 1];
    const probabilidadeModa = distribuicao.probabilidades[estatisticas.modas[0] - distribuicao.minimo];
    const notacao = formataNotacaoCenarioDistribuicaoTeste(cenario);

    if (estatisticas.modas.length === distribuicao.probabilidades.length) return `Ao jogar ${notacao}, todos os valores de ${estatisticas.minimo} a ${estatisticas.maximo} são igualmente prováveis, com ${formataPercentualAnalitico(probabilidadeModa)} cada. O menor valor é ${estatisticas.minimo} e o maior é ${estatisticas.maximo}, ambos com ${formataPercentualAnalitico(probabilidadeModa)} de chance.`;

    const descricaoModa = estatisticas.modas.length === 1 ? `o valor mais provável é ${estatisticas.modas[0]}` : `os valores mais prováveis são ${estatisticas.modas.map(formataNumeroDistribuicaoTeste).join(', ')}`;
    return `Ao jogar ${notacao}, ${descricaoModa}, com ${formataPercentualAnalitico(probabilidadeModa)} de chance. O menor valor é ${estatisticas.minimo}, com ${formataPercentualAnalitico(probabilidadeMinimo)}, e o maior é ${estatisticas.maximo}, com ${formataPercentualAnalitico(probabilidadeMaximo)} de chance.`;
};

function formataPercentualAnalitico(probabilidade: number): string {
    const percentual = probabilidade * 100;
    if (percentual === 0) return '0%';
    if (percentual < 0.00000001) return '< 0,00000001%';
    const maximoCasas = percentual >= 1 ? 2 : percentual >= 0.01 ? 4 : 8;
    return `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: maximoCasas }).format(percentual)}%`;
};