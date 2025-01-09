// #region Imports
import { LinhaEfeito } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
// #endregion

export class Execucao {
    public numeroAcoesAtuais: number = 0;

    constructor(
        private _idTipoExecucao: number,
        public numeroAcoesMaximas: number
    ) { }

    get refTipoExecucao(): TipoExecucao { return SingletonHelper.getInstance().tipos_execucao.find(tipo_execucao => tipo_execucao.id === this._idTipoExecucao)!; }
    get valorTotal(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(this.numeroAcoesMaximas, this.refTipoExecucao.refLinhaEfeito.id)};

    recarregaNumeroAcoes(): void { this.numeroAcoesAtuais = this.valorTotal; }
}

export class TipoExecucao {
    constructor(
        public id: number,
        private _idLinhaEfeito: number,
        public nome: string,
    ) { }

    get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
}