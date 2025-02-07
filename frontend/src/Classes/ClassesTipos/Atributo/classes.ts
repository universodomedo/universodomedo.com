import { LinhaEfeito } from "Classes/ClassesTipos/index.ts";

export type AtributoModelo = {
    id: number;
    idLinhaEfeito: number;
    nome: string;
    descricao: string;
};

export type Atributo = AtributoModelo & {
    readonly nomeAbreviado: string;
    readonly refLinhaEfeito: LinhaEfeito;
};

export type AtributoPersonagem = {
    valor: number;
    readonly refAtributo: Atributo;
    readonly valorTotal: number;
    readonly detalhesValor: string[];
}





// export type AtributoPersonagemService = {
//     valor: number;
//     readonly valorTotal: number;
//     readonly detalhesValor: string[];

//     readonly refAtributo: Atributoa;
// }

// export class Atributo {
//     constructor(
//         public id: number,
//         private _idLinhaEfeito: number,
//         public nome: string,
//         public nomeAbrev: string,
//         public descricao: string,
//     ) { }

//     get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
// }

// export interface AtributoPersonagem {
//     valor: number;
//     readonly refAtributo: Atributo;
//     readonly valorTotal: number;
//     readonly detalhesValor: string[];
// }

// export class AtributoPersonagem {
//     constructor(
//         private _idAtributo: number,
//         public valor: number
//     ) { }

//     get refAtributo(): Atributo { return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this._idAtributo)!; }
//     get valorTotal(): number { return this.valor; }
//     // get valorTotal(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(this.valor, this.refAtributo.refLinhaEfeito.id); }

//     get detalhesValor(): string[] { return ['']; }
//     // get detalhesValor(): string[] { return [`Valor Natural: ${this.valor}`].concat(getPersonagemFromContext().obterDetalhesPorLinhaEfeito(this.refAtributo.refLinhaEfeito.id)); }
// }