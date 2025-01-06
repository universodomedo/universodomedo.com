// #region Imports
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export class Atributo {
    constructor(
        public id: number,
        private _idLinhaEfeito: number,
        public nome: string,
        public nomeAbrev: string,
        public descricao: string,
    ) { }

    get refBuffAtivo(): number { return getPersonagemFromContext().controladorModificadores.valorPorIdLinhaEfeito(this._idLinhaEfeito); }
}

export class AtributoPersonagem {
    constructor(
        private _idAtributo: number,
        public valor: number
    ) { }

    get refAtributo(): Atributo { return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this._idAtributo)!; }
    get valorBonus(): number { return this.refAtributo.refBuffAtivo; }
    get valorTotal(): number { return this.valor + this.valorBonus; }
}