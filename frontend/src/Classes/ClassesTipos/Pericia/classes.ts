import { Atributo, AtributoPersonagem, LinhaEfeito } from 'Classes/ClassesTipos/index.ts';

export type PericiaModelo = {
    id: number;
    idLinhaEfeito: number;
    idAtributo: number;
    nome: string;
    descricao: string;
};

export type Pericia = PericiaModelo & {
    readonly nomeAbreviado: string;
    readonly refLinhaEfeito: LinhaEfeito;
    readonly refAtributo: Atributo;
};

export type PatentePericiaModelo = {
    id: number;
    nome: string;
    valor: number;
    corTexto: string;
};

export type PatentePericia = PatentePericiaModelo;

export type PericiaPatentePersonagem = {
    readonly refPericia: Pericia;
    readonly refPatente: PatentePericia;
    readonly refAtributoPersonagem: AtributoPersonagem;

    readonly valorNivelPatente: number;
    readonly valorBonusPatente: number;

    readonly valorEfeito: number;
    readonly valorTotal: number;
    readonly detalhesValor: string[];
    
    realizarTeste: () => void;
}

export type DadosPericiaPatentePersonagem = {
    idPericia: number;
    idPatentePericia: number;
}


// export class Pericia {
//     constructor(
//         public id: number,
//         private _idLinhaEfeito: number,
//         private _idAtributo: number,
//         public nome: string,
//         public nomeAbrev: string,
//         public descricao: string
//     ) { }

//     get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
//     get refAtributo(): Atributo { return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this._idAtributo)!; }
// }

// export interface IPatentePericia {
//     id: number;
//     nome: string;
//     valor: number;
//     corTexto: string;
// }

// export interface IPericiaPatentePersonagem {
//     readonly refPericia: Pericia;
//     readonly refPatente: IPatentePericia;
//     readonly refAtributoPersonagem: AtributoPersonagem;
//     readonly valorNivelPatente: number;
//     readonly valorBonusPatente: number;
//     readonly valorEfeito: number;
//     readonly valorTotal: number;
//     readonly detalhesValor: string[];
    
//     realizarTeste: () => void;
// }