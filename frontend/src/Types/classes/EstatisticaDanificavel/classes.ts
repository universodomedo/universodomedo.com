// #region Imports
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class EstatisticaDanificavel {
    public valor: number

    constructor(
        private _idEstatisticaDanificavel: number,
        public valorMaximo: number,
        valor?: number,
    ) {
        this.valor = valor !== undefined ? valor : valorMaximo;
    }

    get refEstatisticaDanificavel(): TipoEstatisticaDanificavel {
        return SingletonHelper.getInstance().tipo_estatistica_danificavel.find(estatistica_danificavel => estatistica_danificavel.id === this._idEstatisticaDanificavel)!;
    }

    public aplicarDanoFinal(valor: number): void {
        // LoggerHelper.getInstance().adicionaMensagem(`Recebeu ${valor} de Dano`);
        // LoggerHelper.getInstance().adicionaMensagem(`De ${this.valor} de ${this.refEstatisticaDanificavel.nomeAbrev} para ${Math.max(this.valor - valor, 0)}`, true);
        // LoggerHelper.getInstance().fechaNivelLogMensagem();
        this.valor = Math.max(this.valor - valor, 0);
        // LoggerHelper.getInstance().saveLog();
    }
    public aplicarCura(valor: number): void {
        // LoggerHelper.getInstance().adicionaMensagem(`Recebeu ${valor} de Cura`);
        // LoggerHelper.getInstance().adicionaMensagem(`De ${this.valor} de ${this.refEstatisticaDanificavel.nomeAbrev} para ${Math.min(this.valor + valor, this.valorMaximo)}`, true);
        // LoggerHelper.getInstance().fechaNivelLogMensagem();
        this.valor = Math.min(this.valor + valor, this.valorMaximo);
        // LoggerHelper.getInstance().saveLog();
    }

    public alterarValorMaximo(valorMaximo: number): void {
        this.valorMaximo = this.valor = valorMaximo;
    }
}

export class TipoEstatisticaDanificavel {
    constructor(
        public id: number,
        public nome: string,
        public nomeAbrev: string,
        public cor: string,
        public descricao: string,
    ) { }
}