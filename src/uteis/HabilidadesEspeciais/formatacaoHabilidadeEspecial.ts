import type { PropriedadesHabilidadeEspecialProjetada } from 'types-nora-api';

export function descrevePropriedadesHabilidadeEspecial(propriedades: PropriedadesHabilidadeEspecialProjetada): string {
    if (propriedades.tipo === 'parametrizada_por_pericia') return 'Parametrizada por Perícia';

    return 'Sem argumento';
};
