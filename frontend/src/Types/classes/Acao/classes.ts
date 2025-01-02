// #region Imports
import { adicionarBuffsUtil, logicaMecanicas, Buff, Custo, Requisito, OpcoesExecucao, Ritual, Item, Habilidade, RequisitoConfig, CustoComponente, CorTooltip, FiltroProps, FiltroPropsItems, OpcoesFiltrosCategorizadas, OpcoesFiltro, GastaCustoProps, HabilidadeAtiva, Dificuldade, EmbrulhoComportamentoAcao, DadosComportamentosAcao, DadosGenericosAcao, DadosGenericosAcaoParams } from 'Types/classes/index.ts';
import { LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export class Acao {
    private static nextId = 1;
    public id: number;
    public buffs: Buff[] = [];
    public custos: Custo[] = [];
    public requisitos: Requisito[] = [];
    public dificuldades: Dificuldade[] = [];
    public opcoesExecucoes: OpcoesExecucao[] = [];
    protected _refPai?: Ritual | Item | Habilidade;

    public dados: DadosGenericosAcao;
    public comportamentos: EmbrulhoComportamentoAcao = new EmbrulhoComportamentoAcao();

    public logicaExecucao: () => void = () => { };
    private logicaCustomizada: boolean = false;

    public svg: string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+';

    constructor(
        dadosGenericosAcao: DadosGenericosAcaoParams,
        dadosComportamentos: DadosComportamentosAcao,
    ) {
        this.id = Acao.nextId++;

        this.dados = new DadosGenericosAcao(dadosGenericosAcao);

        if (dadosComportamentos.dadosComportamentoAcao !== undefined) this.comportamentos.setComportamentoAcao(...dadosComportamentos.dadosComportamentoAcao);
        if (dadosComportamentos.dadosComportamentoRequisito !== undefined) this.comportamentos.setComportamentoRequisito(...dadosComportamentos.dadosComportamentoRequisito);
        if (dadosComportamentos.dadosComportamentoConsomeUso !== undefined) this.comportamentos.setComportamentoConsomeUso(...dadosComportamentos.dadosComportamentoConsomeUso);
    }

    get refPai(): Ritual | Item | Habilidade { return this._refPai!; }
    get refTipoAcao(): TipoAcao { return SingletonHelper.getInstance().tipos_acao.find(tipo_acao => tipo_acao.id === this.dados.idTipoAcao)!; }
    get refCategoriaAcao(): CategoriaAcao { return SingletonHelper.getInstance().categorias_acao.find(categoria_acao => categoria_acao.id === this.dados.idCategoriaAcao)!; }
    get nomeAcao(): string { return `${this.dados.nome}`; }

    adicionaRefPai(pai: Ritual | Item | Habilidade): this { return (this._refPai = pai), this; }
    adicionarCustos(custoParams: [new (...args: any[]) => Custo, any[]][]): this { return (custoParams.forEach(([CustoClass, params]) => { this.custos.push(new CustoClass(...params).setRefAcao(this)); })), this; }
    adicionarBuffs(buffParams: [new (...args: any[]) => Buff, any[]][]): this { return (adicionarBuffsUtil(this, this.buffs, buffParams), this) };
    adicionarRequisitosEOpcoesPorId(ids: number[]): this { return (ids.forEach(id => { const requisitoData = RequisitoConfig.construirRequisitoEOpcoesPorId(id, this); if (requisitoData) { const { requisito, opcoesExecucao } = requisitoData; this.requisitos.push(requisito); this.opcoesExecucoes.push(...opcoesExecucao); } }), this); }
    adicionarDificuldades(dificuldadeParams: [new (...args: any[]) => Dificuldade, any[]][]): this { return (dificuldadeParams.forEach(([DificuldadeClass, params]) => { this.dificuldades.push(new DificuldadeClass(...params).setRefAcao(this)) })), this }
    adicionarLogicaExecucao(logicaExecucao: () => void): this { return (this.logicaExecucao = logicaExecucao), this.logicaCustomizada = true, this; }

    get refTipoPai(): 'Ritual' | 'Item' | 'Habilidade' | undefined {
        if (this.refPai instanceof Ritual) return "Ritual";
        if (this.refPai instanceof Item) return "Item";
        if (this.refPai instanceof Habilidade) return "Habilidade";

        return undefined;
    }

    get verificaRequisitosCumpridos(): boolean { return (this.requisitos ? this.requisitos?.every(requisito => requisito.requisitoCumprido) ?? false : true); }

    get verificaCustosPodemSerPagos(): boolean { return (this.custos ? this.custos?.every(custo => custo.podeSerPago) ?? false : true); }

    processaDificuldades = (): boolean => {
        if (!(this.dificuldades.length > 0)) return true;
        LoggerHelper.getInstance().adicionaMensagem(`Processando dificuldades`, true);

        try {
            for (const dificuldade of this.dificuldades) {
                if (!dificuldade.processa()) return false;
            }
        } finally { LoggerHelper.getInstance().fechaNivelLogMensagem(); }

        return true;
    };

    aplicaGastos = (valoresSelecionados: GastaCustoProps): boolean => {
        LoggerHelper.getInstance().adicionaMensagem(`Custos aplicados`, true);

        this.custos.forEach(custo => { custo.processaGastaCusto(valoresSelecionados); });

        LoggerHelper.getInstance().fechaNivelLogMensagem();

        return true;
    }

    ativaBuffs = (): void => {
        this.buffs.map(buff => {
            buff.ativaBuff()
        });
    }

    get bloqueada(): boolean { return !this.verificaCustosPodemSerPagos || !this.verificaRequisitosCumpridos; }

    executaComOpcoes = (valoresSelecionados: GastaCustoProps) => {
        LoggerHelper.getInstance().adicionaMensagem(`Executado ${this.nomeAcao}`);

        if (!this.processaDificuldades()) return;

        // logica temporaria
        if (this.comportamentos.temComportamentoConsomeUso && this.refPai instanceof Item && this.refPai.comportamentos.podeGastarUsos) this.refPai.gastaUso();

        this.aplicaGastos(valoresSelecionados);
        this.executa(valoresSelecionados);

        LoggerHelper.getInstance().fechaNivelLogMensagem();
        LoggerHelper.getInstance().saveLog();
        
        // getPersonagemFromContext().onUpdate();
    }

    executa = (valoresSelecionados: GastaCustoProps) => {
        if (this.logicaCustomizada) this.logicaExecucao();

        if (this.dados.idMecanica) logicaMecanicas[this.dados.idMecanica](valoresSelecionados, this);
        
        getPersonagemFromContext().onUpdate();
    }

    static get filtroProps(): FiltroProps<Acao> {
        return new FiltroProps<Acao>(
            'Ações',
            [
                new FiltroPropsItems<Acao>(
                    (acao) => acao.dados.nome,
                    'Nome da Ação',
                    'Procure pela Ação',
                    'text',
                    true
                ),
                new FiltroPropsItems<Acao>(
                    (acao) => acao.refTipoPai == 'Ritual' ? acao.refPai.nomeExibicao : (acao.refPai as Item).dados.nome.customizado,
                    'Fonte da Ação',
                    'Selecione a Fonte da Ação',
                    'select',
                    true,
                    new OpcoesFiltrosCategorizadas(
                        [
                            { categoria: "Rituais", opcoes: new OpcoesFiltro(getPersonagemFromContext().rituais.filter(ritual => ritual.acoes.length > 0).map(ritual => ({ id: ritual.dados.nome, nome: ritual.dados.nome }))) },
                            { categoria: "Items", opcoes: new OpcoesFiltro(getPersonagemFromContext().inventario.items.filter(item => item.acoes.length > 0).map(item => ({ id: item.nomeExibicao, nome: item.nomeExibicao }))) }
                        ]
                    )
                ),
                new FiltroPropsItems<Acao>(
                    (acao) => acao.refTipoAcao.id,
                    'Tipo de Ação',
                    'Selecione o Tipo de Ação',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().tipos_acao.map(tipo_acao => ({ id: tipo_acao.id, nome: tipo_acao.nome })))
                ),
            ],
        );
    }
}

export class TipoAcao {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}

export class CategoriaAcao {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}