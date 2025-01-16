// #region Imports
import { logicaMecanicas, Requisito, OpcoesExecucao, Ritual, Item, Habilidade, RequisitoConfig, FiltroProps, FiltroPropsItems, OpcoesFiltrosCategorizadas, OpcoesFiltro, EmbrulhoComportamentoAcao, DadosComportamentosAcao, DadosGenericosAcao, DadosGenericosAcaoParams, Modificador, adicionarModificadoresUtil, HabilidadeAtiva, GastaCustoProps, PrecoExecucao, DadosAcaoCustomizada } from 'Types/classes/index.ts';
import { LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
import { ExecutaTestePericiaGenerico } from 'Recursos/Ficha/Procedimentos';
// #endregion

export class Acao {
    private static nextId = 1;
    public id: number;
    protected _modificadores: Modificador[] = [];
    public requisitos: Requisito[] = [];
    public opcoesExecucoes: OpcoesExecucao[] = [];
    protected _refPai?: Ritual | Item | Habilidade;

    public dados: DadosGenericosAcao;
    public comportamentos: EmbrulhoComportamentoAcao = new EmbrulhoComportamentoAcao();

    public logicaExecucao: () => void = () => { };
    private logicaCustomizada: boolean = false;

    public svg: string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+';


    public dadosAcaoCustomizada?: DadosAcaoCustomizada; // temporario

    constructor(
        dadosGenericosAcao: DadosGenericosAcaoParams,
        dadosComportamentos: DadosComportamentosAcao,
        dadosAcaoCustomizada?: DadosAcaoCustomizada, // temporario
    ) {
        this.id = Acao.nextId++;

        this.dados = new DadosGenericosAcao(dadosGenericosAcao);

        if (dadosComportamentos.dadosComportamentoCustoAcao !== undefined ) this.comportamentos.setComportamentoCustoAcao(dadosComportamentos.dadosComportamentoCustoAcao);
        if (dadosComportamentos.dadosComportamentoDificuldadeAcao !== undefined) this.comportamentos.setComportamentoDificuldadeAcao(dadosComportamentos.dadosComportamentoDificuldadeAcao);
        if (dadosComportamentos.dadosComportamentoAcao !== undefined) this.comportamentos.setComportamentoAcao(dadosComportamentos.dadosComportamentoAcao);
        if (dadosComportamentos.dadosComportamentoRequisito !== undefined) this.comportamentos.setComportamentoRequisito(dadosComportamentos.dadosComportamentoRequisito);
        if (dadosComportamentos.dadosComportamentoConsomeUso !== undefined) this.comportamentos.setComportamentoConsomeUso(...dadosComportamentos.dadosComportamentoConsomeUso);
        if (dadosComportamentos.dadosComportamentoConsomeMunicao !== undefined) this.comportamentos.setComportamentoConsomeMunicao(...dadosComportamentos.dadosComportamentoConsomeMunicao);


        if (dadosAcaoCustomizada !== undefined) this.dadosAcaoCustomizada = dadosAcaoCustomizada;
    }

    get modificadores(): Modificador[] { return this._modificadores; }

    get refPai(): Ritual | Item | Habilidade { return this._refPai!; }
    get refTipoAcao(): TipoAcao { return SingletonHelper.getInstance().tipos_acao.find(tipo_acao => tipo_acao.id === this.dados.idTipoAcao)!; }
    get nomeExibicao(): string { return `${this.dados.nome}`; }

    adicionaRefPai(pai: Ritual | Item | Habilidade): this { return (this._refPai = pai), this; }

    adicionarModificadores(propsModificadores: ConstructorParameters<typeof Modificador>[0][]): this { return (adicionarModificadoresUtil(this, this._modificadores, propsModificadores), this); }

    adicionarRequisitosEOpcoesPorId(ids: number[]): this { return (ids.forEach(id => { const requisitoData = RequisitoConfig.construirRequisitoEOpcoesPorId(id, this); if (requisitoData) { const { requisito, opcoesExecucao } = requisitoData; this.requisitos.push(requisito); this.opcoesExecucoes.push(...opcoesExecucao); } }), this); }
    adicionarLogicaExecucao(logicaExecucao: () => void): this { return (this.logicaExecucao = logicaExecucao), this.logicaCustomizada = true, this; }

    get refTipoPai(): 'Ritual' | 'Item' | 'Habilidade' | undefined {
        if (this.refPai instanceof Ritual) return "Ritual";
        if (this.refPai instanceof Item) return "Item";
        if (this.refPai instanceof Habilidade) return "Habilidade";

        return undefined;
    }

    get verificaRequisitosCumpridos(): boolean { return (this.requisitos ? this.requisitos?.every(requisito => requisito.requisitoCumprido) ?? false : true); }

    get verificaCustosPodemSerPagos(): boolean { return true }
    // get verificaCustosPodemSerPagos(): boolean { return (this.custos ? this.custos?.every(custo => custo.podeSerPago) ?? false : true); }

    processaDificuldades = (): boolean => {
        const atributoPersonagem = getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === this.comportamentos.comportamentoDificuldadeAcao.idAtributo)!;
        const periciaPersonagem = getPersonagemFromContext().pericias.find(pericia => pericia.refPericia.id === this.comportamentos.comportamentoDificuldadeAcao.idPericia)!;

        const resultadoDificuldade = ExecutaTestePericiaGenerico(atributoPersonagem, periciaPersonagem);

        // dificuldade fixa ou contra, apenas realizada o teste
        if (!this.comportamentos.comportamentoDificuldadeAcao.temDificuldadeDinamica) return true;

        // dificuldade dinamica, calcula se passou, bloqueando ou subindo a dificuldade
        const passou = resultadoDificuldade >= this.comportamentos.dificuldadeDeExecucao;

        if (passou) {
            this.comportamentos.atualizaDificuldadeDeExecucao();
        } else {
            this.comportamentos.travaAcao();
        }

        return passou;
    };

    aplicaGastos = (valoresSelecionados: GastaCustoProps): boolean => {
        LoggerHelper.getInstance().adicionaMensagem(`Custos aplicados`, true);

        // this.custos.forEach(custo => { custo.processaGastaCusto(valoresSelecionados); });

        LoggerHelper.getInstance().fechaNivelLogMensagem();

        return true;
    }

    ativaBuffs = (): void => {
        this.modificadores.map(modificador => {
            modificador.ativaBuff()
        });
    }

    get bloqueada(): boolean { return !this.verificaCustosPodemSerPagos || !this.verificaRequisitosCumpridos || this.comportamentos.acaoTravada; }

    executaComOpcoes = (valoresSelecionados: GastaCustoProps) => {
        LoggerHelper.getInstance().adicionaMensagem(`Executado ${this.nomeExibicao}`);

        if (this.comportamentos.temDificuldadeDeExecucao && !this.processaDificuldades()) return;

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
                    (acao) => acao.nomeExibicao.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase(),
                    'Nome da Ação',
                    'Procure pela Ação',
                    'text',
                    true
                ),
                new FiltroPropsItems<Acao>(
                    (acao) => acao.refPai.nomeExibicao,
                    'Fonte da Ação',
                    'Selecione a Fonte da Ação',
                    'select',
                    true,
                    new OpcoesFiltrosCategorizadas(
                        [
                            { categoria: "Rituais", opcoes: new OpcoesFiltro(getPersonagemFromContext().rituais.filter(ritual => ritual.acoes.length > 0).map(ritual => ({ id: ritual.nomeExibicao, nome: ritual.nomeExibicao }))) },
                            { categoria: "Items", opcoes: new OpcoesFiltro(getPersonagemFromContext().inventario.items.filter(item => item.acoes.length > 0).map(item => ({ id: item.nomeExibicao, nome: item.nomeExibicao }))) },
                            { categoria: 'Habilidades', opcoes: new OpcoesFiltro(getPersonagemFromContext().habilidades.filter(habilidade => habilidade instanceof HabilidadeAtiva && habilidade.acoes.length > 0).map(habilidade => ({ id: habilidade.nomeExibicao, nome: habilidade.nomeExibicao }))) },
                        ]
                    )
                ),
                // new FiltroPropsItems<Acao>(
                //     (acao) => acao.refTipoAcao.id,
                //     'Tipo de Ação',
                //     'Selecione o Tipo de Ação',
                //     'select',
                //     true,
                //     new OpcoesFiltro(SingletonHelper.getInstance().tipos_acao.map(tipo_acao => ({ id: tipo_acao.id, nome: tipo_acao.nome })))
                // ),
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