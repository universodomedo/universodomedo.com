import type { PropriedadesHabilidadeEspecialProjetada } from 'types-nora-api';

export function descrevePropriedadesHabilidadeEspecial(propriedades: PropriedadesHabilidadeEspecialProjetada): string {
    if (propriedades.tipo === 'modificador_parametrizado_teste_pericia_valor_maximo') return `Valor Máximo de Perícia +${propriedades.valor ?? 0} (argumento: Perícia)`;

    return 'Sem comportamento runtime';
};
