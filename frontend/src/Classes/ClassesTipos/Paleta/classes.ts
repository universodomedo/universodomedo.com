// #region Imports

// #endregion

export interface PaletaCores {
    corPrimaria: string,
    corSecundaria?: string,
    corTerciaria?: string
}

export class CorTooltip {
    constructor(
        private _corPrimaria: string,
        private _corSecundaria?: string,
        private _corTerciaria?: string,
    ) { }

    get cores(): PaletaCores {
        return {
            corPrimaria: this._corPrimaria,
            corSecundaria: this._corSecundaria ? this._corSecundaria : this._corPrimaria,
            corTerciaria: this._corTerciaria ? this._corTerciaria : this._corPrimaria,
        }
    }
}