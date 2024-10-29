// #region Imports
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class Execucao {
    public numeroAcoesAtuais: number = 0;

    constructor(
        private _idTipoExecucao: number,
        public numeroAcoesMaximas: number
    ) {
        this.recarregaNumeroAcoes();
    }

    get refTipoExecucao(): TipoExecucao { return SingletonHelper.getInstance().tipos_execucao.find(tipo_execucao => tipo_execucao.id === this._idTipoExecucao)!; }
    recarregaNumeroAcoes(): void { this.numeroAcoesAtuais = this.numeroAcoesMaximas; }
}

export class TipoExecucao {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}