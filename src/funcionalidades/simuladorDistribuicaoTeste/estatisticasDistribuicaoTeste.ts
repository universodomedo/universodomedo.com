import type { EstatisticasDistribuicaoTeste, MedianaDistribuicaoTeste } from './simuladorDistribuicaoTeste.tipos.ts';

export function calculaEstatisticasDistribuicaoTeste(minimo: number, pesos: ArrayLike<number>, limiares: readonly number[]): EstatisticasDistribuicaoTeste {
    const total = somaPesos(pesos);
    if (total <= 0) throw new Error('A distribuição precisa possuir peso total positivo.');

    let media = 0;
    let maiorPeso = 0;

    for (let indice = 0; indice < pesos.length; indice += 1) {
        const peso = pesos[indice];
        media += (minimo + indice) * peso;
        if (peso > maiorPeso) maiorPeso = peso;
    }

    media /= total;

    let variancia = 0;
    const modas: number[] = [];
    const toleranciaModa = Math.max(1e-12, maiorPeso * 1e-12);

    for (let indice = 0; indice < pesos.length; indice += 1) {
        const peso = pesos[indice];
        const valor = minimo + indice;
        variancia += ((valor - media) ** 2) * peso;
        if (Math.abs(peso - maiorPeso) <= toleranciaModa) modas.push(valor);
    }

    return {
        media,
        mediana: calculaMediana(minimo, pesos, total),
        modas,
        desvioPadrao: Math.sqrt(variancia / total),
        minimo,
        maximo: minimo + pesos.length - 1,
        probabilidadesAcumuladas: limiares.map(limiar => ({ limiar, probabilidade: calculaProbabilidadeAcumulada(minimo, pesos, total, limiar) })),
    };
};

function somaPesos(pesos: ArrayLike<number>): number {
    let total = 0;
    for (let indice = 0; indice < pesos.length; indice += 1) total += pesos[indice];
    return total;
};

function calculaMediana(minimo: number, pesos: ArrayLike<number>, total: number): MedianaDistribuicaoTeste {
    const metade = total / 2;
    const tolerancia = Math.max(1e-12, total * 1e-12);
    let acumulado = 0;

    for (let indice = 0; indice < pesos.length; indice += 1) {
        acumulado += pesos[indice];
        if (acumulado + tolerancia < metade) continue;

        const inferior = minimo + indice;
        if (Math.abs(acumulado - metade) > tolerancia) return { inferior, superior: inferior, valor: inferior };

        for (let proximoIndice = indice + 1; proximoIndice < pesos.length; proximoIndice += 1) {
            if (pesos[proximoIndice] <= 0) continue;
            const superior = minimo + proximoIndice;
            return { inferior, superior, valor: (inferior + superior) / 2 };
        }

        return { inferior, superior: inferior, valor: inferior };
    }

    const valor = minimo + pesos.length - 1;
    return { inferior: valor, superior: valor, valor };
};

function calculaProbabilidadeAcumulada(minimo: number, pesos: ArrayLike<number>, total: number, limiar: number): number {
    const indiceInicial = Math.max(0, Math.ceil(limiar - minimo));
    let acumulado = 0;
    for (let indice = indiceInicial; indice < pesos.length; indice += 1) acumulado += pesos[indice];
    return acumulado / total;
};