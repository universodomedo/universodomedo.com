// #region Imports
import { FichaHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class Atributo {
    constructor(
        public id: number,
        private _idBuff: number,
        public nome: string,
        public nomeAbrev: string,
        public descricao: string,
    ) { }

    get refBuffAtivo(): number {
        return FichaHelper.getInstance().personagem.buffsAplicados.buffPorId(this._idBuff);
    }
}

export class AtributoPersonagem {
    constructor(
        private _idAtributo: number,
        public valor: number
    ) { }

    get refAtributo(): Atributo {
        return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this._idAtributo)!;
    }

    get valorBonus(): number {
        return this.refAtributo.refBuffAtivo;
    }

    get valorTotal(): number {
        return this.valor + this.valorBonus;
    }
}