// #region Imports
import { MDL_Elemento, MDL_TipoDano } from "udm-types";
import { Circulo, Elemento, NivelRitual, CirculoRitual, BuffRef, Alcance, FormatoAlcance, Duracao, Execucao, TipoAcao, TipoAlvo, TipoCusto, TipoDano, CirculoNivelRitual } from "Types/classes.tsx";
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
  private _niveis_ritual:NivelRitual[] = [];
  private _circulos_ritual:CirculoRitual[] = [];
  private _circulos_niveis_ritual:CirculoNivelRitual[] = [];
  private _buffs:BuffRef[] = [];
  private _alcances:Alcance[] = [];
  private _formatos_alcance:FormatoAlcance[] = [];
  private _duracoes:Duracao[] = [];
  private _execucoes:Execucao[] = [];
  private _tipos_acao:TipoAcao[] = [];
  private _tipos_alvo:TipoAlvo[] = [];
  private _tipos_custo:TipoCusto[] = [];
  private _tipos_dano:TipoDano[] = [];

  static getInstance() {
    if (!SingletonHelper.instance) {
      SingletonHelper.instance = new SingletonHelper();
    }

    return SingletonHelper.instance;
  }

  public set elementos(value:Elemento[]) { this._elementos = value }
  public get elementos():Elemento[] { return this._elementos }
  
  public set niveis_ritual(value:NivelRitual[]) { this._niveis_ritual = value }
  public get niveis_ritual():NivelRitual[] { return this._niveis_ritual }

  public set circulos_ritual(value:CirculoRitual[]) { this._circulos_ritual = value }
  public get circulos_ritual():CirculoRitual[] { return this._circulos_ritual }

  public set circulos_niveis_ritual(value:CirculoNivelRitual[]) { this._circulos_niveis_ritual = value }
  public get circulos_niveis_ritual():CirculoNivelRitual[] { return this._circulos_niveis_ritual }

  public set buffs(value:BuffRef[]) { this._buffs = value }
  public get buffs():BuffRef[] { return this._buffs }

  public set alcances(value:Alcance[]) { this._alcances = value }
  public get alcances():Alcance[] { return this._alcances }

  public set formatos_alcance(value:FormatoAlcance[]) { this._formatos_alcance = value }
  public get formatos_alcance():FormatoAlcance[] { return this._formatos_alcance }

  public set duracoes(value:Duracao[]) { this._duracoes = value }
  public get duracoes():Duracao[] { return this._duracoes }

  public set execucoes(value:Execucao[]) { this._execucoes = value }
  public get execucoes():Execucao[] { return this._execucoes }

  public set tipos_acao(value:TipoAcao[]) { this._tipos_acao = value }
  public get tipos_acao():TipoAcao[] { return this._tipos_acao }

  public set tipos_alvo(value:TipoAlvo[]) { this._tipos_alvo = value }
  public get tipos_alvo():TipoAlvo[] { return this._tipos_alvo }

  public set tipos_custo(value:TipoCusto[]) { this._tipos_custo = value }
  public get tipos_custo():TipoCusto[] { return this._tipos_custo }

  public set tipos_dano(value:TipoDano[]) { this._tipos_dano = value }
  public get tipos_dano():TipoDano[] { return this._tipos_dano }
}