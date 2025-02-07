import { Alcance, Atributo, CirculoNivelRitual, CirculoRitual, Classe, Duracao, Elemento, EstatisticaDanificavel, Execucao, FormatoAlcance, LinhaEfeito, NivelComponente, Nivel, NivelProficiencia, NivelRitual,
    PatentePericia, Pericia, TipoAlvo, TipoDano, TipoEfeito, TipoItem, TipoProficiencia, 
    TipoCategoria} from 'Classes/ClassesTipos/index.ts';

export class SingletonHelper {
    static instance: SingletonHelper;

    private _alcances: Alcance[] = [];
    public set alcances(value: Alcance[]) { this._alcances = value; }
    public get alcances(): Alcance[] { return this._alcances; }

    private _atributos: Atributo[] = [];
    public set atributos(value: Atributo[]) { this._atributos = value; }
    public get atributos(): Atributo[] { return this._atributos; }

    private _circulos_niveis_ritual: CirculoNivelRitual[] = [];
    public set circulos_niveis_ritual(value: CirculoNivelRitual[]) { this._circulos_niveis_ritual = value; }
    public get circulos_niveis_ritual(): CirculoNivelRitual[] { return this._circulos_niveis_ritual; }

    private _circulos_ritual: CirculoRitual[] = [];
    public set circulos_ritual(value: CirculoRitual[]) { this._circulos_ritual = value; }
    public get circulos_ritual(): CirculoRitual[] { return this._circulos_ritual; }

    private _classes: Classe[] = [];
    public set classes(value: Classe[]) { this._classes = value; }
    public get classes(): Classe[] { return this._classes; }

    private _duracoes: Duracao[] = [];
    public set duracoes(value: Duracao[]) { this._duracoes = value; }
    public get duracoes(): Duracao[] { return this._duracoes; }

    private _elementos: Elemento[] = [];
    public set elementos(value: Elemento[]) { this._elementos = value; }
    public get elementos(): Elemento[] { return this._elementos; }
    
    private _estatisticas_danificavel: EstatisticaDanificavel[] = [];
    public set estatisticas_danificavel(value: EstatisticaDanificavel[]) { this._estatisticas_danificavel = value; }
    public get estatisticas_danificavel(): EstatisticaDanificavel[] { return this._estatisticas_danificavel; }
    
    private _execucoes: Execucao[] = [];
    public set execucoes(value: Execucao[]) { this._execucoes = value; }
    public get execucoes(): Execucao[] { return this._execucoes; }

    private _formatos_alcance: FormatoAlcance[] = [];
    public set formatos_alcance(value: FormatoAlcance[]) { this._formatos_alcance = value; }
    public get formatos_alcance(): FormatoAlcance[] { return this._formatos_alcance; }

    private _linhas_efeito: LinhaEfeito[] = [];
    public set linhas_efeito(value: LinhaEfeito[]) { this._linhas_efeito = value; }
    public get linhas_efeito(): LinhaEfeito[] { return this._linhas_efeito; }

    private _niveis_componente: NivelComponente[] = [];
    public set niveis_componente(value: NivelComponente[]) { this._niveis_componente = value; }
    public get niveis_componente(): NivelComponente[] { return this._niveis_componente; }

    private _niveis: Nivel[] = [];
    public set niveis(value: Nivel[]) { this._niveis = value; }
    public get niveis(): Nivel[] { return this._niveis; }

    private _niveis_proficiencia: NivelProficiencia[] = [];
    public set niveis_proficiencia(value: NivelProficiencia[]) { this._niveis_proficiencia = value; }
    public get niveis_proficiencia(): NivelProficiencia[] { return this._niveis_proficiencia; }

    private _niveis_ritual: NivelRitual[] = [];
    public set niveis_ritual(value: NivelRitual[]) { this._niveis_ritual = value; }
    public get niveis_ritual(): NivelRitual[] { return this._niveis_ritual; }

    private _patentes_pericia: PatentePericia[] = [];
    public set patentes_pericia(value: PatentePericia[]) { this._patentes_pericia = value; }
    public get patentes_pericia(): PatentePericia[] { return this._patentes_pericia; }

    private _pericias: Pericia[] = [];
    public set pericias(value: Pericia[]) { this._pericias = value; }
    public get pericias(): Pericia[] { return this._pericias; }

    private _tipos_alvo: TipoAlvo[] = [];
    public set tipos_alvo(value: TipoAlvo[]) { this._tipos_alvo = value; }
    public get tipos_alvo(): TipoAlvo[] { return this._tipos_alvo; }

    private _tipos_categoria: TipoCategoria[] = [];
    public set tipos_categoria(value: TipoCategoria[]) { this._tipos_categoria = value; }
    public get tipos_categoria(): TipoCategoria[] { return this._tipos_categoria; }

    private _tipos_dano: TipoDano[] = [];
    public set tipos_dano(value: TipoDano[]) { this._tipos_dano = value; }
    public get tipos_dano(): TipoDano[] { return this._tipos_dano; }

    private _tipos_efeito: TipoEfeito[] = [];
    public set tipos_efeito(value: TipoEfeito[]) { this._tipos_efeito = value; }
    public get tipos_efeito(): TipoEfeito[] { return this._tipos_efeito; }

    private _tipos_items: TipoItem[] = [];
    public set tipos_items(value: TipoItem[]) { this._tipos_items = value; }
    public get tipos_items(): TipoItem[] { return this._tipos_items; }

    private _tipos_proficiencia: TipoProficiencia[] = [];
    public set tipos_proficiencia(value: TipoProficiencia[]) { this._tipos_proficiencia = value; }
    public get tipos_proficiencia(): TipoProficiencia[] { return this._tipos_proficiencia; }

    // ta em verificação se realmente era necessário

    // private _tipo_estatistica_buffavel: TipoEstatisticaBuffavel[] = [];
    // private _tipos_acao: TipoAcao[] = [];
    // private _tipos_requisitos: TipoRequisito[] = [];
    // public set tipo_estatistica_buffavel(value: TipoEstatisticaBuffavel[]) { this._tipo_estatistica_buffavel = value }
    // public get tipo_estatistica_buffavel(): TipoEstatisticaBuffavel[] { return this._tipo_estatistica_buffavel }
    // public set tipos_acao(value: TipoAcao[]) { this._tipos_acao = value }
    // public get tipos_acao(): TipoAcao[] { return this._tipos_acao }
    // public set tipos_requisitos(value: TipoRequisito[]) { this._tipos_requisitos = value }
    // public get tipos_requisitos(): TipoRequisito[] { return this._tipos_requisitos }

    static getInstance() {
        if (!SingletonHelper.instance) {
            SingletonHelper.instance = new SingletonHelper();
        }

        return SingletonHelper.instance;
    }
}

// export class LoggerHelper {
//     static instance: LoggerHelper;
//     private _log: MensagemLog[] = [];
//     private _currentLog: MensagemLog = { titulo: '', mensagens: [] };
//     private listeners: ((mensagem: MensagemLog[]) => void)[] = [];
//     private stack: MensagemLog[] = [this._currentLog];

//     static getInstance() {
//         if (!LoggerHelper.instance) {
//             LoggerHelper.instance = new LoggerHelper();
//         }
//         return LoggerHelper.instance;
//     }

//     public addListener(listener: (mensagem: MensagemLog[]) => void) { this.listeners.push(listener); }
//     private notifyListeners() { this.listeners.forEach(listener => listener(this.log)); }
//     public removeListener(listener: (mensagem: MensagemLog[]) => void) { this.listeners = this.listeners.filter(l => l !== listener); }

//     public adicionaMensagem(mensagem: string, novoSubnivel = false): void {
//         const currentLevel = this.stack[this.stack.length - 1];

//         if (novoSubnivel) {
//             const novoItem: MensagemLog = { titulo: mensagem, mensagens: [] };

//             currentLevel.mensagens?.push(novoItem);

//             this.stack.push(novoItem);
//         } else {
//             if (currentLevel.titulo === '') {
//                 currentLevel.titulo = mensagem;
//             } else {
//                 currentLevel.mensagens?.push(mensagem);
//             }
//         }
//     }

//     public fechaNivelLogMensagem() {
//         if (this.stack.length > 1) {
//             this.stack.pop();
//         }
//     }

//     public limpaMensagens() {
//         this._currentLog = { titulo: '', mensagens: [] };
//         this.stack = [this._currentLog];
//         this.notifyListeners();
//     }

//     public saveLog() {
//         this._log.push(this._currentLog);
//         this.limpaMensagens();
//         this.notifyListeners();
//     }

//     get log(): MensagemLog[] {
//         return this._log;
//     }
// }