// #region Imports
import { MDL_TipoDano } from "udm-types";
import { Personagem, Elemento, NivelRitual, CirculoRitual, BuffRef, Alcance, FormatoAlcance, Duracao, TipoExecucao, TipoAcao, TipoAlvo, TipoCusto, TipoDano, CirculoNivelRitual, CategoriaAcao, TipoEstatisticaDanificavel, TipoEstatisticaBuffavel, TipoBuff, Atributo, Pericia, PatentePericia, TipoItem, NivelComponente, TipoRequisito, Habilidade, MensagemLog, Classe, Nivel, TipoGanhoNex } from 'Types/classes/index.ts';
// #endregion

export class FichaHelper {
  static instance: FichaHelper;
  private _personagem?: Personagem;
  private _tiposDano: MDL_TipoDano[] = [];

  private constructor() {
    this._tiposDano = [];
  }

  static getInstance() {
    if (!FichaHelper.instance) {
      FichaHelper.instance = new FichaHelper();
    }

    return FichaHelper.instance;
  }

  resetaPersonagem() {
    this._personagem = undefined;
  }

  public set tiposDano(tiposDano: MDL_TipoDano[]) { this._tiposDano = tiposDano }
  public get tiposDano(): MDL_TipoDano[] { return this._tiposDano }

  public set personagem(personagem: Personagem) { this._personagem = personagem }
  public get personagem(): Personagem { return this._personagem! }
}

export class SingletonHelper {
  static instance: SingletonHelper;
  private _tipo_estatistica_danificavel: TipoEstatisticaDanificavel[] = [];
  private _tipo_estatistica_buffavel: TipoEstatisticaBuffavel[] = [];
  private _elementos: Elemento[] = [];
  private _niveis_ritual: NivelRitual[] = [];
  private _circulos_ritual: CirculoRitual[] = [];
  private _circulos_niveis_ritual: CirculoNivelRitual[] = [];
  private _buffs: BuffRef[] = [];
  private _alcances: Alcance[] = [];
  private _formatos_alcance: FormatoAlcance[] = [];
  private _duracoes: Duracao[] = [];
  private _tipos_execucao: TipoExecucao[] = [];
  private _categorias_acao: CategoriaAcao[] = [];
  private _tipos_acao: TipoAcao[] = [];
  private _tipos_alvo: TipoAlvo[] = [];
  private _tipos_custo: TipoCusto[] = [];
  private _tipos_dano: TipoDano[] = [];
  private _tipos_buff: TipoBuff[] = [];
  private _atributos: Atributo[] = [];
  private _pericias: Pericia[] = [];
  private _patentes_pericia: PatentePericia[] = [];
  private _tipos_items: TipoItem[] = [];
  private _niveis_componente: NivelComponente[] = [];
  private _tipos_requisitos: TipoRequisito[] = [];
  private _lista_geral_habilidades: Habilidade[] = [];
  private _classes: Classe[] = [];
  private _niveis: Nivel[] = [];
  private _tipos_ganho_nex: TipoGanhoNex[] = [];

  static getInstance() {
    if (!SingletonHelper.instance) {
      SingletonHelper.instance = new SingletonHelper();
    }

    return SingletonHelper.instance;
  }

  public set tipo_estatistica_danificavel(value: TipoEstatisticaDanificavel[]) { this._tipo_estatistica_danificavel = value }
  public get tipo_estatistica_danificavel(): TipoEstatisticaDanificavel[] { return this._tipo_estatistica_danificavel }

  public set tipo_estatistica_buffavel(value: TipoEstatisticaBuffavel[]) { this._tipo_estatistica_buffavel = value }
  public get tipo_estatistica_buffavel(): TipoEstatisticaBuffavel[] { return this._tipo_estatistica_buffavel }

  public set elementos(value: Elemento[]) { this._elementos = value }
  public get elementos(): Elemento[] { return this._elementos }

  public set niveis_ritual(value: NivelRitual[]) { this._niveis_ritual = value }
  public get niveis_ritual(): NivelRitual[] { return this._niveis_ritual }

  public set circulos_ritual(value: CirculoRitual[]) { this._circulos_ritual = value }
  public get circulos_ritual(): CirculoRitual[] { return this._circulos_ritual }

  public set circulos_niveis_ritual(value: CirculoNivelRitual[]) { this._circulos_niveis_ritual = value }
  public get circulos_niveis_ritual(): CirculoNivelRitual[] { return this._circulos_niveis_ritual }

  public set buffs(value: BuffRef[]) { this._buffs = value }
  public get buffs(): BuffRef[] { return this._buffs }

  public set alcances(value: Alcance[]) { this._alcances = value }
  public get alcances(): Alcance[] { return this._alcances }

  public set formatos_alcance(value: FormatoAlcance[]) { this._formatos_alcance = value }
  public get formatos_alcance(): FormatoAlcance[] { return this._formatos_alcance }

  public set duracoes(value: Duracao[]) { this._duracoes = value }
  public get duracoes(): Duracao[] { return this._duracoes }

  public set tipos_execucao(value: TipoExecucao[]) { this._tipos_execucao = value }
  public get tipos_execucao(): TipoExecucao[] { return this._tipos_execucao }

  public set categorias_acao(value: CategoriaAcao[]) { this._categorias_acao = value }
  public get categorias_acao(): CategoriaAcao[] { return this._categorias_acao }

  public set tipos_acao(value: TipoAcao[]) { this._tipos_acao = value }
  public get tipos_acao(): TipoAcao[] { return this._tipos_acao }

  public set tipos_alvo(value: TipoAlvo[]) { this._tipos_alvo = value }
  public get tipos_alvo(): TipoAlvo[] { return this._tipos_alvo }

  public set tipos_custo(value: TipoCusto[]) { this._tipos_custo = value }
  public get tipos_custo(): TipoCusto[] { return this._tipos_custo }

  public set tipos_dano(value: TipoDano[]) { this._tipos_dano = value }
  public get tipos_dano(): TipoDano[] { return this._tipos_dano }

  public set tipos_buff(value: TipoBuff[]) { this._tipos_buff = value }
  public get tipos_buff(): TipoBuff[] { return this._tipos_buff }

  public set atributos(value: Atributo[]) { this._atributos = value }
  public get atributos(): Atributo[] { return this._atributos }

  public set pericias(value: Pericia[]) { this._pericias = value }
  public get pericias(): Pericia[] { return this._pericias }

  public set patentes_pericia(value: PatentePericia[]) { this._patentes_pericia = value }
  public get patentes_pericia(): PatentePericia[] { return this._patentes_pericia }

  public set tipos_items(value: TipoItem[]) { this._tipos_items = value }
  public get tipos_items(): TipoItem[] { return this._tipos_items }

  public set niveis_componente(value: NivelComponente[]) { this._niveis_componente = value }
  public get niveis_componente(): NivelComponente[] { return this._niveis_componente }

  public set tipos_requisitos(value: TipoRequisito[]) { this._tipos_requisitos = value }
  public get tipos_requisitos(): TipoRequisito[] { return this._tipos_requisitos }

  public set lista_geral_habilidades(value: Habilidade[]) { this._lista_geral_habilidades = value }
  public get lista_geral_habilidades(): Habilidade[] { return this._lista_geral_habilidades }

  public set classes(value: Classe[]) { this._classes = value }
  public get classes(): Classe[] { return this._classes }

  public set niveis(value: Nivel[]) { this._niveis = value }
  public get niveis(): Nivel[] { return this._niveis }

  public set tipos_ganho_nex(value: TipoGanhoNex[]) { this._tipos_ganho_nex = value }
  public get tipos_ganho_nex(): TipoGanhoNex[] { return this._tipos_ganho_nex }
}

export class LoggerHelper {
  static instance: LoggerHelper;
  private _log: MensagemLog[] = [];
  private _currentLog: MensagemLog = { titulo: '', mensagens: [] };
  private listeners: ((mensagem: MensagemLog[]) => void)[] = [];
  private stack: MensagemLog[] = [this._currentLog];

  static getInstance() {
    if (!LoggerHelper.instance) {
      LoggerHelper.instance = new LoggerHelper();
    }
    return LoggerHelper.instance;
  }

  public addListener(listener: (mensagem: MensagemLog[]) => void) { this.listeners.push(listener); }
  private notifyListeners() { this.listeners.forEach(listener => listener(this.log)); }
  public removeListener(listener: (mensagem: MensagemLog[]) => void) { this.listeners = this.listeners.filter(l => l !== listener); }

  public adicionaMensagem(mensagem: string, novoSubnivel = false): void {
    const currentLevel = this.stack[this.stack.length - 1];

    if (novoSubnivel) {
      const novoItem: MensagemLog = { titulo: mensagem, mensagens: [] };

      currentLevel.mensagens?.push(novoItem);

      this.stack.push(novoItem);
    } else {
      if (currentLevel.titulo === '') {
        currentLevel.titulo = mensagem;
      } else {
        currentLevel.mensagens?.push(mensagem);
      }
    }
  }

  public fechaNivelLogMensagem() {
    if (this.stack.length > 1) {
      this.stack.pop();
    }
  }

  public limpaMensagens() {
    this._currentLog = { titulo: '', mensagens: [] };
    this.stack = [this._currentLog];
    this.notifyListeners();
  }

  public saveLog() {
    this._log.push(this._currentLog);
    this.limpaMensagens();
    this.notifyListeners();
  }

  get log(): MensagemLog[] {
    return this._log;
  }
}