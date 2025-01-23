// #region Imports
import { LinhaEfeito } from 'Classes/ClassesTipos/index.ts';
import { SingletonHelper } from 'Classes/classes_estaticas.ts';

import { getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';
// #endregion

export class TipoDano {
    constructor(
        public id: number,
        public nome: string,
        private _idLinhaEfeito: number,
        private _idDanoPertencente?: number,
    ) { }

    get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
    get refTipoDanoPertecente(): TipoDano | undefined { return SingletonHelper.getInstance().tipos_dano.find(tipo_dano => tipo_dano.id === this._idDanoPertencente); }
}

export class ReducaoDano {
    constructor(
        private _idTipoDano: number,
        private _valor: number,
    ) { }

    get refTipoDano(): TipoDano { return SingletonHelper.getInstance().tipos_dano.find(tipo_dano => tipo_dano.id === this._idTipoDano)!; }
    get valorTotal(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(this._valor, this.refTipoDano.refLinhaEfeito.id); }
}

export class DanoGeral { // traduz em 1 unico ataque
    public listaDano: InstanciaDano[]; // são as diferentes composições dentro desse unico ataque

    constructor(listaDano: InstanciaDano[]) {
        this.listaDano = listaDano;
    }
}

export class InstanciaDano {
    public valor: number;
    public tipoDano: TipoDano;

    constructor(valor: number, tipoDano: TipoDano) {
        this.valor = valor;
        this.tipoDano = tipoDano;
    }
}