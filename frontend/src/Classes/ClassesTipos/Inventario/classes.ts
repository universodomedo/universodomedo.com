// // #region Imports
import { Item, Acao } from 'Classes/ClassesTipos/index.ts';

// import { getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';
// // #endregion

export type EspacoInventario = {
    capacidadeNatural: number;
    capacidadeExtraPorForca: number;
    readonly capacidadeTotal: number;
};

export type Inventario = {
    items: Item[];
    readonly agrupamento: Item[];
    readonly espacosUsados: number;
    readonly acoes: Acao[];
    readonly numeroItensCategoria: (valorCategoria: number) => number;
    adicionarItem: (item: Item) => void;
    removerItem: (item: Item) => void;
};

// export class Inventario {
//     public items: Item[] = [];

//     constructor() { }

//     get agrupamento(): Item[] {
//         return [
//             ...(this.items.reduce((itemAgrupado, itemAtual) => {
//                 if (!itemAtual.agrupavel || !itemAgrupado.some(item => item.agrupavel && item.nomeExibicao === itemAtual.nomeExibicao && !item.itemEstaEmpunhado)) {
//                     itemAgrupado.push(itemAtual);
//                 }
//                 return itemAgrupado;
//             }, [] as typeof this.items)),
//         ];
//     }

//     get espacosUsados(): number { return this.items.reduce((acc, cur) => { return acc + cur.dados.peso }, 0) }
//     public acoesInventario = (): Acao[] => { return this.items.reduce((acc: Acao[], item) => acc.concat(item.acoes), []); }

//     public adicionarItemNoInventario = (item: Item): void => { this.items.push(item); }
//     public removerItem(idItem: number): void {
//         this.items.find(item => item.id === idItem)?.desativaBuffsItem();

//         this.items = this.items.filter(item => item.id !== idItem);
//         getPersonagemFromContext().onUpdate();
//     }

//     numeroItensCategoria(valorCategoria: number): number { return this.items.filter(item => item.dados.categoria === valorCategoria).length; }
// }