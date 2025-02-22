import { Item, TipoCategoria } from "Classes/ClassesTipos/index.ts";

export type Particao = {
    readonly nome: string;
    
    readonly cargaFinal: number;
    readonly bloqueada: boolean;

    itens: Item[];

    tipoParticao?: 'Desconsidera Carga' | 'Desconsidera Categoria';

    particaoLimiteCarga?: ParticaoLimiteCarga;
    particaoLimiteCategoria?: ParticaoLimiteCategoria;
    particaoLimiteQuantidade?: ParticaoLimiteQuantidade;
    particaoRegraInterna?: ParticaoRegraInterna;
};

export type ParticaoRegraInterna = {
    idTipoItem?: number;
};

// #region Limites da Particao
export type ParticaoLimiteCarga = {
    readonly limite: number;
};

export type ParticaoLimiteCategoria = {
    limitesCategoria: LimiteCategoria[];
};

export type ParticaoLimiteQuantidade = {
    numeroMaximoDeItens: number;
};
// #endregion

// #region Dados de Limites
export type LimiteCategoria = {
    tipoCategoria: TipoCategoria;
    quantidadeMaxima: number;
};

export type DadosLimiteCategoria = Pick<LimiteCategoria, 'quantidadeMaxima'> & {
    idTipoCategoria: number;
};
// #endregion