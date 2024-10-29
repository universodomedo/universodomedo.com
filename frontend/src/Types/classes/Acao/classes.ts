// #region Imports
import { adicionarBuffsUtil, logicaMecanicas, Buff, Custo, Requisito, OpcoesExecucao, Ritual, Item, Habilidade, Opcao, RequisitoConfig, CustoComponente, TooltipProps, CorTooltip, FiltroProps, FiltroPropsItems, OpcoesFiltrosCategorizadas, OpcoesFiltro, ItemArma } from 'Types/classes/index.ts';
import { FichaHelper, LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
import { ExecutaVariacaoGenerica, ExecutaTestePericia } from 'Recursos/Ficha/Variacao.ts';
import { toast } from 'react-toastify';
// #endregion

export class Acao {
    private static nextId = 1;
    public id: number;
    public buffs: Buff[] = [];
    public custos: Custo[] = [];
    public requisitos: Requisito[] = [];
    public opcoesExecucoes: OpcoesExecucao[] = [];
    protected _refPai?: Ritual | Item | Habilidade;

    constructor(
        public nome: string,
        private _idTipoAcao: number,
        private _idCategoriaAcao: number,
        private _idMecanica: number,

        public svg: string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
    ) {
        this.id = Acao.nextId++;

        // if (this.refCategoriaAcao.id === 2) {
        //     this.buffs.map(buff => {
        //         FichaHelper.getInstance().personagem.buffs.push(buff);
        //     });
        // }
    }

    get refPai(): Ritual | Item | Habilidade { return this._refPai!; }
    get refTipoAcao(): TipoAcao { return SingletonHelper.getInstance().tipos_acao.find(tipo_acao => tipo_acao.id === this._idTipoAcao)!; }
    get refCategoriaAcao(): CategoriaAcao { return SingletonHelper.getInstance().categorias_acao.find(categoria_acao => categoria_acao.id === this._idCategoriaAcao)!; }
    get nomeAcao(): string { return `${this.nome}`; }

    adicionaRefPai(pai: Ritual | Item | Habilidade): this { return (this._refPai = pai), this; }

    adicionarCustos(custoParams: [new (...args: any[]) => Custo, any[]][]): this { return (custoParams.forEach(([CustoClass, params]) => { this.custos.push((CustoClass === CustoComponente && this.refPai instanceof Ritual) ? new CustoComponente().setRefAcao(this as AcaoRitual) : new CustoClass(...params)); })), this; }
    adicionarBuffs(buffParams: [new (...args: any[]) => Buff, any[]][]): this { return (adicionarBuffsUtil(this, this.buffs, buffParams), this) };
    adicionarRequisitos(requisitoParams: [new (...args: any[]) => Requisito, any[]][]): this { return (requisitoParams.forEach(([RequisitoClass, params]) => { this.requisitos.push(new RequisitoClass(...params).setRefAcao(this as AcaoRitual)); })), this; }
    adicionarOpcoesExecucao(opcoesParams: { key: string, displayName: string, obterOpcoes: () => Opcao[] }[]): this { return (opcoesParams.forEach(param => { this.opcoesExecucoes.push(new OpcoesExecucao(param.key, param.displayName, param.obterOpcoes)); })), this };

    adicionarRequisitosEOpcoesPorId(ids: number[]): this {
        ids.forEach(id => {
            const requisitoData = RequisitoConfig.construirRequisitoEOpcoesPorId(id, this);
            if (requisitoData) {
                const { requisito, opcoesExecucao } = requisitoData;
                this.requisitos.push(requisito);
                this.opcoesExecucoes.push(...opcoesExecucao);
            }
        });
        return this;
    }

    get refTipoPai(): 'Ritual' | 'Item' | 'Habilidade' | undefined {
        if (this.refPai instanceof Ritual) return "Ritual";
        if (this.refPai instanceof Item) return "Item";
        if (this.refPai instanceof Habilidade) return "Habilidade";

        return undefined;
    }

    get verificaRequisitosCumpridos(): boolean {
        return (
            this.requisitos
                ? this.requisitos?.every(requisito => requisito.requisitoCumprido) ?? false
                : true
        );
    }

    get verificaCustosPodemSerPagos(): boolean {
        return (
            this.custos
                ? this.custos?.every(custo => custo.podeSerPago) ?? false
                : true
        );
    }

    aplicaGastos = (valoresSelecionados: { [key: string]: number | undefined }): boolean => {
        LoggerHelper.getInstance().adicionaMensagem(`Custos aplicados`, true);

        this.custos.forEach(custo => {
            if (custo instanceof CustoComponente) {
                custo.processaGastaCusto(valoresSelecionados['custoComponente']!);
            } else {
                custo.processaGastaCusto();
            }
        });

        LoggerHelper.getInstance().fechaNivelLogMensagem();

        return true;
    }

    ativaBuffs = (): void => {
        this.buffs.map(buff => {
            buff.ativaBuff()
        });
    }

    executaComOpcoes = (valoresSelecionados: { [key: string]: number | undefined }) => {
        LoggerHelper.getInstance().adicionaMensagem(`${this.nomeAcao} [${this.refPai.nomeExibicao}]`);

        logicaMecanicas[this._idMecanica](valoresSelecionados, this);
        this.aplicaGastos(valoresSelecionados);

        FichaHelper.getInstance().personagem.onUpdate();
        LoggerHelper.getInstance().saveLog();
    }

    get tooltipProps(): TooltipProps {
        return {
            caixaInformacao: {
                cabecalho: [
                    { tipo: 'titulo', conteudo: this.nomeAcao }
                ],
                corpo: [
                    { tipo: 'texto', conteudo: `${this.refTipoPai!} - ${this.refPai.nomeExibicao}` },
                    { tipo: 'texto', conteudo: `${this.refTipoAcao.nome}` },

                    ...(this.custos ? [
                        { tipo: 'separacao' as const, conteudo: 'Custos' },
                        ...(this.custos.map(custo => ({
                            tipo: 'texto' as const,
                            conteudo: custo.descricaoCusto,
                            cor: !custo.podeSerPago ? '#FF0000' : '',
                        })))
                    ] : []),

                    ...(this.requisitos ? [
                        { tipo: 'separacao' as const, conteudo: 'Requisitos' },
                        ...(this.requisitos.map(requisito => ({
                            tipo: 'texto' as const,
                            conteudo: requisito.descricaoRequisito,
                            cor: !requisito.requisitoCumprido ? '#FF0000' : '',
                        })))
                    ] : []),
                ],
            },
            iconeCustomizado: {
                corDeFundo: (this.verificaCustosPodemSerPagos && this.verificaRequisitosCumpridos ? '#FFFFFF' : '#BB0000'),
                svg: this.svg,
            },
            corTooltip: new CorTooltip('#FFFFFF').cores,
            numeroUnidades: 1,
        };
    }

    static get filtroProps(): FiltroProps<Acao> {
        return new FiltroProps<Acao>(
            'Ações',
            [
                new FiltroPropsItems<Acao>(
                    (acao) => acao.nome,
                    'Nome da Ação',
                    'Procure pela Ação',
                    'text',
                    true
                ),
                new FiltroPropsItems<Acao>(
                    (acao) => acao.refTipoPai == 'Ritual' ? acao.refPai.nome : (acao.refPai as Item).nome.customizado,
                    'Fonte da Ação',
                    'Selecione a Fonte da Ação',
                    'select',
                    true,
                    new OpcoesFiltrosCategorizadas(
                        [
                            { categoria: "Rituais", opcoes: new OpcoesFiltro(FichaHelper.getInstance().personagem.rituais.filter(ritual => ritual.acoes.length > 0).map(ritual => ({ id: ritual.nome, nome: ritual.nome }))) },
                            { categoria: "Items", opcoes: new OpcoesFiltro(FichaHelper.getInstance().personagem.inventario.items.filter(item => item.acoes.length > 0).map(item => ({ id: item.nome.customizado, nome: item.nome.customizado }))) }
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

export class AcaoRitual extends Acao {
    constructor(nome: string, idTipoAcao: number, idCategoriaAcao: number, idMecanica: number) { super(nome, idTipoAcao, idCategoriaAcao, idMecanica); }

    override get refPai(): Ritual { return this._refPai as Ritual };
}

export class AcaoItem extends Acao {
    constructor(nome: string, idTipoAcao: number, idCategoriaAcao: number, idMecanica: number) { super(nome, idTipoAcao, idCategoriaAcao, idMecanica); }

    override get refPai(): Item { return this._refPai as Item };
}

export class AcaoHabilidade extends Acao {
    constructor(nome: string, idTipoAcao: number, idCategoriaAcao: number, idMecanica: number) { super(nome, idTipoAcao, idCategoriaAcao, idMecanica); }

    override get refPai(): Habilidade { return this._refPai as Habilidade };
}

export class AcaoAtaque extends Acao {
    constructor(nome: string, idTipoAcao: number, idCategoriaAcao: number, idMecanica: number) { super(nome, idTipoAcao, idCategoriaAcao, idMecanica); }

    executaComOpcoes = (valoresSelecionados: { [key: string]: number | undefined }) => {
        LoggerHelper.getInstance().adicionaMensagem(`${this.nomeAcao} [${this.refPai.nomeExibicao}]`);

        this.executa();
        this.aplicaGastos(valoresSelecionados);

        FichaHelper.getInstance().personagem.onUpdate();
        LoggerHelper.getInstance().saveLog();
    }

    executa = () => {
        this.executaAtaque();
    }

    executaAtaque = () => {
        const resultadoVariacao = ExecutaVariacaoGenerica({ listaVarianciasDaAcao: [ { valorMaximo: this.refPai.detalhesArma.dano, variancia: this.refPai.detalhesArma.variancia } ] })

        const resumoDano = `${resultadoVariacao.reduce((cur, acc) => { return cur + acc.valorFinal }, 0)} de dano`;

        this.refPai.detalhesArma.refPericiaUtilizadaArma.rodarTeste();
        
        LoggerHelper.getInstance().adicionaMensagem(resumoDano);
        toast(resumoDano);

        resultadoVariacao.map(variacao => {
            LoggerHelper.getInstance().adicionaMensagem(`Dano de ${variacao.varianciaDaAcao.valorMaximo - variacao.varianciaDaAcao.variancia} a ${variacao.varianciaDaAcao.valorMaximo}: ${variacao.valorFinal}`, true);
            LoggerHelper.getInstance().adicionaMensagem(`Aproveitamento de ${variacao.variacaoAleatoria.sucessoDessaVariancia}%`);
            LoggerHelper.getInstance().fechaNivelLogMensagem();
        });
    }

    override get refPai(): ItemArma { return this._refPai as ItemArma };
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