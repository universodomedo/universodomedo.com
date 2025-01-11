// #region Imports

// #endregion

export class DificuldadeAberta {

}

export class DificuldadeDinamica {
    private _dificuldadeInicial: number;
    private _modificadorDificuldadeInicial: number = 0;
    public listaModificadoresDificuldade: number[] = [];

    public dificuldadeAtual: number;
    public modificadorDificuldadeAtual: number;
    private indiceListaModificadores: number = 0;

    constructor({ dificuldadeInicial, modificadorDificuldadeInicial = 0, listaModificadoresDificuldade = [] }: { dificuldadeInicial: number, modificadorDificuldadeInicial?: number, listaModificadoresDificuldade?: number[]}) {
        this._dificuldadeInicial = dificuldadeInicial;
        this._modificadorDificuldadeInicial = modificadorDificuldadeInicial;
        this.listaModificadoresDificuldade = listaModificadoresDificuldade;

        this.dificuldadeAtual = this._dificuldadeInicial;
        this.modificadorDificuldadeAtual = this._modificadorDificuldadeInicial;
    }

    atualizaDificuldade() {
        this.dificuldadeAtual += this.modificadorDificuldadeAtual;

        if (this.indiceListaModificadores < this.listaModificadoresDificuldade.length) {
            this.modificadorDificuldadeAtual += this.listaModificadoresDificuldade[this.indiceListaModificadores];

            this.indiceListaModificadores++;
        }
    }

    resetaDificuldade() { this.dificuldadeAtual = this._dificuldadeInicial; }
    resetaModificadorDificuldade() { this.modificadorDificuldadeAtual = this._modificadorDificuldadeInicial; this.indiceListaModificadores = 0; }
}