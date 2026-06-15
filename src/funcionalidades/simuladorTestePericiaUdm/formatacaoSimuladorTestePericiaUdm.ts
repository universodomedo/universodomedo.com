import type { MedianaAnaliseTestePericia, PatentePericiaCompletaDto, ResultadoAnaliseCenarioTestePericia } from 'types-nora-api';

import { formataNumeroDistribuicaoTeste, formataPercentualDistribuicaoTeste } from 'Funcionalidades/simuladorDistribuicaoTeste/formatacaoSimuladorDistribuicaoTeste';
import type { CenarioSimuladorTestePericiaUdm } from './simuladorTestePericiaUdm.tipos';

export { formataNumeroDistribuicaoTeste, formataPercentualDistribuicaoTeste };

export function formataMedianaTestePericiaUdm(mediana: MedianaAnaliseTestePericia): string {
    if (mediana.inferior === mediana.superior) return formataNumeroDistribuicaoTeste(mediana.valor);
    return `${formataNumeroDistribuicaoTeste(mediana.inferior)}–${formataNumeroDistribuicaoTeste(mediana.superior)} (${formataNumeroDistribuicaoTeste(mediana.valor)})`;
};

export function formataModasTestePericiaUdm(resultado: ResultadoAnaliseCenarioTestePericia): string {
    const modas = resultado.estatisticas.modas;
    if (modas.length === resultado.distribuicao.length) return `${resultado.estatisticas.minimo}–${resultado.estatisticas.maximo} (todos)`;
    if (modas.length <= 6) return modas.join(', ');
    return `${modas.slice(0, 6).join(', ')} +${modas.length - 6}`;
};

export function descreveCenarioTestePericiaUdm(cenario: CenarioSimuladorTestePericiaUdm, patente: PatentePericiaCompletaDto | null): string {
    const valorAtributoFinal = cenario.valorAtributoBase + cenario.incrementoModificadoresAtributo;
    return `Atributo ${valorAtributoFinal} · ${patente?.nome ?? `Patente ${cenario.idPatentePericia}`}`;
};

export function criaResumoAnaliticoTestePericiaUdm(cenario: CenarioSimuladorTestePericiaUdm, patente: PatentePericiaCompletaDto | null, resultado: ResultadoAnaliseCenarioTestePericia): string {
    const pontoMinimo = resultado.distribuicao[0];
    const pontoMaximo = resultado.distribuicao[resultado.distribuicao.length - 1];
    const pontosModa = resultado.distribuicao.filter(ponto => resultado.estatisticas.modas.includes(ponto.valorFinal));
    const probabilidadeModa = pontosModa[0]?.probabilidade ?? 0;
    const descricaoModa = resultado.estatisticas.modas.length === 1 ? `o valor mais provável é ${resultado.estatisticas.modas[0]}` : `os valores mais prováveis são ${resultado.estatisticas.modas.join(', ')}`;
    const descricaoCenario = descreveCenarioTestePericiaUdm(cenario, patente);
    return `Com ${descricaoCenario.toLowerCase()}, ${descricaoModa}, com ${formataPercentualDistribuicaoTeste(probabilidadeModa)} de chance. O menor resultado é ${pontoMinimo.valorFinal}, com ${formataPercentualDistribuicaoTeste(pontoMinimo.probabilidade)}, e o maior é ${pontoMaximo.valorFinal}, com ${formataPercentualDistribuicaoTeste(pontoMaximo.probabilidade)} de chance.`;
};