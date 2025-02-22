import { Item, TipoCategoria } from "Classes/ClassesTipos/index.ts";

export type Particao = {
    readonly nome: string;
    
    readonly cargaFinal: number;
    readonly bloqueada: boolean;

    itens: Item[];

    particaoLimiteCarga?: ParticaoLimiteCarga;
    particaoRegraInterna?: ParticaoRegraInterna;
    particaoLimiteCategoria?: ParticaoLimiteCategoria;
};

export type ParticaoLimiteCarga = {
    readonly limite: number;
};

export type ParticaoRegraInterna = {
    idTipoItem?: number;
};

export type ParticaoLimiteCategoria = {
    limitesCategoria: LimiteCategoria[];
};

export type LimiteCategoria = {
    tipoCategoria: TipoCategoria;
    quantidadeMaxima: number;
};

export type DadosLimiteCategoria = Pick<LimiteCategoria, 'quantidadeMaxima'> & {
    idTipoCategoria: number;
};