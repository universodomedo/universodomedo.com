// #region Imports
import { MDL_TipoDano } from "udm-types";
import { Personagem } from "Types/classes.tsx";
// #endregion

export class FichaHelper {
    static instance: FichaHelper;
    private _personagem?:Personagem;
    private _tiposDano:MDL_TipoDano[] = [];

    private constructor() {
      this._tiposDano = [];
    }

    static getInstance() {
        if (!FichaHelper.instance) {
          FichaHelper.instance = new FichaHelper();
        }

        return FichaHelper.instance;
    }

    public set tiposDano(tiposDano:MDL_TipoDano[]) { this._tiposDano = tiposDano }
    public get tiposDano():MDL_TipoDano[] { return this._tiposDano }

    public set personagem(personagem:Personagem) { this._personagem = personagem }
    public get personagem():Personagem { return this._personagem! }
}