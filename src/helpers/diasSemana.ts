export type dds = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function obtemDiaDaSemanaPorExtensoPorDDS(dds: dds): string {
    const diasDaSemana = [
        'Domingo',
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado',
    ];

    return diasDaSemana[dds];
}