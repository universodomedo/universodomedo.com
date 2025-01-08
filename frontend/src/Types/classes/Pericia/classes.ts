// #region Imports
import { Atributo, AtributoPersonagem, LinhaEfeito } from 'Types/classes/index.ts';
import { LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
import { ExecutaTestePericiaGenerico } from 'Recursos/Ficha/Procedimentos';
// #endregion

export class Pericia {
    constructor(
        public id: number,
        private _idLinhaEfeito: number,
        private _idAtributo: number,
        public nome: string,
        public nomeAbrev: string,
        public descricao: string
    ) { }

    get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
    get refAtributo(): Atributo { return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this._idAtributo)!; }
}

export class PatentePericia {
    constructor(
        public id: number,
        public nome: string,
        public valor: number,
    ) { }
}

export class PericiaPatentePersonagem {
    constructor(
        private _idPericia: number,
        private _idPatentePericia: number
    ) { }

    get refPericia(): Pericia { return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === this._idPericia)!; }
    get refPatente(): PatentePericia { return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === this._idPatentePericia)!; }
    get refAtributoPersonagem(): AtributoPersonagem { return getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === this.refPericia.refAtributo.id)!; }

    get valorNivelPatente(): number { return this.refPatente.id; }
    get valorBonusPatente(): number { return this.refPatente.valor; }
    get valorTotal(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(this.valorBonusPatente, this.refPericia.refLinhaEfeito.id); }

    realizarTeste = () => {
        const resultado = ExecutaTestePericiaGenerico(this.refAtributoPersonagem, this);
        LoggerHelper.getInstance().saveLog();
        return resultado;
    }
}