// #region Imports
import { adicionaSinalEmNumeroParaExibicao, Atributo, AtributoPersonagem, LinhaEfeito } from 'Classes/ClassesTipos/index.ts';
import { LoggerHelper, SingletonHelper } from 'Classes/classes_estaticas.ts';

import { getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';
import { ExecutaTestePericiaGenerico } from 'Recursos/Ficha/Procedimentos.ts';
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
        public corTexto: string,
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

    get valorNivelPatente(): number { return this.refPatente.id - 1; }
    get valorBonusPatente(): number { return this.refPatente.valor; }

    get valorEfeito(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(0, this.refPericia.refLinhaEfeito.id); }
    get valorTotal(): number { return this.valorEfeito + this.valorBonusPatente; }

    get detalhesValor(): string[] { return [`Patente ${this.refPatente.nome}: ${this.refPatente.valor}`].concat(getPersonagemFromContext().obterDetalhesPorLinhaEfeito(this.refPericia.refLinhaEfeito.id)); }

    realizarTeste = () => {
        const resultado = ExecutaTestePericiaGenerico(this.refAtributoPersonagem, this);
        LoggerHelper.getInstance().saveLog();
        return resultado;
    }
}