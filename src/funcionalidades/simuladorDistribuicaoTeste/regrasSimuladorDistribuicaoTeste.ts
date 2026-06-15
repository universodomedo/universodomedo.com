import type { ConfiguracaoCenarioDistribuicaoTeste } from './simuladorDistribuicaoTeste.tipos.ts';

export const LIMITES_SIMULADOR_DISTRIBUICAO_TESTE = {
    quantidadeDadosMinima: -20,
    quantidadeDadosMaxima: 20,
    quantidadeFacesMinima: 2,
    quantidadeFacesMaxima: 100,
    quantidadeCenariosMaxima: 8,
} as const;

export function validaConfiguracaoCenarioDistribuicaoTeste(cenario: ConfiguracaoCenarioDistribuicaoTeste): void {
    if (!Number.isInteger(cenario.quantidadeDados) || cenario.quantidadeDados === 0 || cenario.quantidadeDados < LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeDadosMinima || cenario.quantidadeDados > LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeDadosMaxima) throw new Error(`A quantidade N deve estar entre ${LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeDadosMinima} e ${LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeDadosMaxima}, exceto zero.`);
    if (!Number.isInteger(cenario.quantidadeFaces) || cenario.quantidadeFaces < LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeFacesMinima || cenario.quantidadeFaces > LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeFacesMaxima) throw new Error(`A quantidade de faces deve estar entre ${LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeFacesMinima} e ${LIMITES_SIMULADOR_DISTRIBUICAO_TESTE.quantidadeFacesMaxima}.`);
    if (!Number.isSafeInteger(cenario.bonus)) throw new Error('O bônus deve ser um número inteiro seguro.');
};