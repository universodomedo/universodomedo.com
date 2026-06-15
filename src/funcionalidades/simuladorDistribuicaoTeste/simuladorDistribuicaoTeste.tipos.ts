export interface ConfiguracaoCenarioDistribuicaoTeste {
    readonly id: string;
    readonly nome: string;
    readonly quantidadeDados: number;
    readonly quantidadeFaces: number;
    readonly bonus: number;
    readonly cor: string;
};

export interface DistribuicaoProbabilidadeTeste {
    readonly minimo: number;
    readonly maximo: number;
    readonly probabilidades: Float64Array;
};

export interface MedianaDistribuicaoTeste {
    readonly inferior: number;
    readonly superior: number;
    readonly valor: number;
};

export interface ProbabilidadeAcumuladaTeste {
    readonly limiar: number;
    readonly probabilidade: number;
};

export interface EstatisticasDistribuicaoTeste {
    readonly media: number;
    readonly mediana: MedianaDistribuicaoTeste;
    readonly modas: readonly number[];
    readonly desvioPadrao: number;
    readonly minimo: number;
    readonly maximo: number;
    readonly probabilidadesAcumuladas: readonly ProbabilidadeAcumuladaTeste[];
};

export interface ResultadoTeoricoCenarioTeste {
    readonly cenarioId: string;
    readonly distribuicao: DistribuicaoProbabilidadeTeste;
    readonly estatisticas: EstatisticasDistribuicaoTeste;
};