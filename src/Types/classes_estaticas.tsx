// #region Imports
import { MDL_Elemento, MDL_TipoDano } from "udm-types";
import { Circulo, Elemento } from "Types/classes.tsx";
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

export class SingletonHelper {
  static instance: SingletonHelper;
  private _elementos:Elemento[] = [];
  private _circulos:Circulo[] = [];

  static getInstance() {
    if (!SingletonHelper.instance) {
      SingletonHelper.instance = new SingletonHelper();
    }

    return SingletonHelper.instance;
  }

  public set elementos(elementos:Elemento[]) { this._elementos = elementos }
  public get elementos():Elemento[] { return this._elementos }

  public set circulos(circulos:Circulo[]) { this._circulos = circulos }
  public get circulos():Circulo[] { return this._circulos }
}