// #region Imports
import { LinhaEfeito } from 'Classes/ClassesTipos/index.ts';
// #endregion

export type TipoDanoModelo = {
    id: number;
    nome: string;
    idLinhaEfeito: number;
    idDanoPertencente?: number;
}

export type TipoDano = TipoDanoModelo & {
    readonly refLinhaEfeito: LinhaEfeito;
    readonly refTipoDanoPertecente: TipoDano | undefined;
}

export type ReducaoDano = {
    valor: number,
    readonly refTipoDano: TipoDano;
    readonly valorTotal: number;
};

export type DadosReducaoDano = Omit<ReducaoDano, 'refTipoDano' | 'valorTotal'> & {
    idTipoDano: number
}


// export class TipoDano {
//     constructor(
//         public id: number,
//         public nome: string,
//         private _idLinhaEfeito: number,
//         private _idDanoPertencente?: number,
//     ) { }

//     get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
//     get refTipoDanoPertecente(): TipoDano | undefined { return SingletonHelper.getInstance().tipos_dano.find(tipo_dano => tipo_dano.id === this._idDanoPertencente); }
// }

// export class ReducaoDano {
//     constructor(
//         private _idTipoDano: number,
//         private _valor: number,
//     ) { }

//     get refTipoDano(): TipoDano { return SingletonHelper.getInstance().tipos_dano.find(tipo_dano => tipo_dano.id === this._idTipoDano)!; }
//     get valorTotal(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(this._valor, this.refTipoDano.refLinhaEfeito.id); }
// }

// export class DanoGeral { // traduz em 1 unico ataque
//     public listaDano: InstanciaDano[]; // são as diferentes composições dentro desse unico ataque

//     constructor(listaDano: InstanciaDano[]) {
//         this.listaDano = listaDano;
//     }
// }

// export class InstanciaDano {
//     public valor: number;
//     public tipoDano: TipoDano;

//     constructor(valor: number, tipoDano: TipoDano) {
//         this.valor = valor;
//         this.tipoDano = tipoDano;
//     }
// }