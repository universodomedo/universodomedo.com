import type { ConfiguracaoCenarioDistribuicaoTeste, EstatisticasDistribuicaoTeste, MedianaDistribuicaoTeste } from './simuladorDistribuicaoTeste.tipos';

const FORMATADOR_NUMERO = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 });
const FORMATADOR_PERCENTUAL = new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formataNumeroDistribuicaoTeste(valor: number): string { return FORMATADOR_NUMERO.format(valor); };

export function formataPercentualDistribuicaoTeste(valor: number): string { return FORMATADOR_PERCENTUAL.format(valor); };

export function formataNotacaoCenarioDistribuicaoTeste(cenario: ConfiguracaoCenarioDistribuicaoTeste): string {
    const bonus = cenario.bonus === 0 ? '' : cenario.bonus > 0 ? ` + ${cenario.bonus}` : ` - ${Math.abs(cenario.bonus)}`;
    return `${cenario.quantidadeDados}d${cenario.quantidadeFaces}${bonus}`;
};

export function formataMedianaDistribuicaoTeste(mediana: MedianaDistribuicaoTeste): string {
    if (mediana.inferior === mediana.superior) return formataNumeroDistribuicaoTeste(mediana.valor);
    return `${formataNumeroDistribuicaoTeste(mediana.inferior)}–${formataNumeroDistribuicaoTeste(mediana.superior)} (${formataNumeroDistribuicaoTeste(mediana.valor)})`;
};

export function formataModasDistribuicaoTeste(estatisticas: EstatisticasDistribuicaoTeste): string {
    if (estatisticas.modas.length === estatisticas.maximo - estatisticas.minimo + 1) return `${estatisticas.minimo}–${estatisticas.maximo} (todos)`;
    if (estatisticas.modas.length <= 6) return estatisticas.modas.join(', ');
    return `${estatisticas.modas.slice(0, 6).join(', ')} +${estatisticas.modas.length - 6}`;
};