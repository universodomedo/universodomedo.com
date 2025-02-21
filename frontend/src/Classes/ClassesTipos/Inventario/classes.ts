import { Item, DadosItem, DadosItemSemIdentificador } from 'Classes/ClassesTipos/index.ts';

export type DadosInventario = {
    identificadorProximoItem: number;
    dadosItens: DadosItem[];
};

export type Inventario = {
    itens: Item[];
    readonly agrupamento: Item[];
    readonly espacosUsados: number;
    readonly numeroItensCategoria: (valorCategoria: number) => number;
    adicionarItem: (dadosItem: DadosItemSemIdentificador) => void;
    removerItem: (item: Item) => void;
};

export type CapacidadeDeCarga = {
    capacidadeNatural: number;
    capacidadeExtraPorForca: number;
    readonly capacidadeTotal: number;
};