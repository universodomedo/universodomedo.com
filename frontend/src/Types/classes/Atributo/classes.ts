// #region Imports
import { adicionaSinalEmNumeroParaExibicao, LinhaEfeito } from 'Types/classes/index.ts';
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

    get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
}

export class AtributoPersonagem {
    constructor(
        private _idAtributo: number,
        public valor: number
    ) { }

    get refAtributo(): Atributo { return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this._idAtributo)!; }
    get valorTotal(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(this.valor, this.refAtributo.refLinhaEfeito.id); }

    get detalhesValor(): string[] { return [`Valor Natural: ${this.valor}`].concat(getPersonagemFromContext().obterDetalhesPorLinhaEfeito(this.refAtributo.refLinhaEfeito.id)); }
}