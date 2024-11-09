// #region Imports
import { adicionarBuffsUtil, adicionarAcoesUtil, pluralize, Acao, Buff, Extremidade, TooltipProps, CorTooltip, FiltroProps, FiltroPropsItems, OpcaoFiltro, OpcoesFiltro, CaixaInformacaoProps, PericiaPatentePersonagem, Elemento, NivelComponente, AtributoPersonagem } from 'Types/classes/index.ts';
import { FichaHelper, LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class TipoItem {
    constructor(
        public id: number,
        public nome: string
    ) { }
}

export class NomeItem {
    public customizado: string;
    public temNomeCustomizado: boolean = false;

    constructor(
        public padrao: string,
        customizado?: string,
    ) {
        if (customizado) {
            this.customizado = customizado;
            this.temNomeCustomizado = true;
        } else {
            this.customizado = padrao;
        }
    }
}

export class Item {
    private static nextId = 1;
    public id: number;

    public acoes: Acao[] = [];
    protected _buffs: Buff[] = [];
    public precisaEstarEmpunhado: boolean = false;

    protected idExtremidade?: number;
    public refExtremidade?: Extremidade;

    protected _agrupavel: boolean = false;

    public svg = `PHN2ZyB3aWR0aD0iMjU2cHgiIGhlaWdodD0iMjU2cHgiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNDQ0LjE4IDQ0NC4xOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICA8cGF0aCBkPSJtNDA0LjIgMjA1Ljc0Yy0wLjkxNy0wLjY1Ni0yLjA5Ni0wLjgzLTMuMTY1LTAuNDY3IDAgMC0xMTkuMDEgNDAuNDc3LTEyMi4yNiA0MS41OTgtMi43MjUgMC45MzgtNC40ODctMS40Mi00LjQ4Ny0xLjQybC0zNy40NDgtNDYuMjU0Yy0wLjkzNS0xLjE1NC0yLjQ5Mi0xLjU5Mi0zLjg5LTEuMDk4LTEuMzk2IDAuNDk0LTIuMzMyIDEuODE2LTIuMzMyIDMuMjk5djE2Ny44OWMwIDEuMTY4IDAuNTgzIDIuMjYgMS41NTYgMi45MSAwLjU4NCAwLjM5MSAxLjI2MyAwLjU5IDEuOTQ1IDAuNTkgMC40NTEgMCAwLjkwNi0wLjA4OCAxLjMzNi0wLjI2N2wxNjguMDQtNjkuNDM4YzEuMzEtMC41NDEgMi4xNjMtMS44MTggMi4xNjMtMy4yMzR2LTkxLjI2NmMwLTEuMTI2LTAuNTQ0LTIuMTg1LTEuNDYyLTIuODQ0eiIvPiA8cGF0aCBkPSJtNDQzLjQ5IDE2OC4yMi0zMi4wNy00Mi44NTljLTAuNDYtMC42MTUtMS4xMTEtMS4wNjEtMS44NTItMS4yNzBsLTE4Ni40Mi01Mi42MzZjLTAuNjIyLTAuMTc2LTEuNDY1LTAuMTI1LTIuMDk2IDAuMDQ5bC0xODYuNDIgNTIuNjM2Yy0wLjczOSAwLjIwOS0xLjM5MSAwLjY1NC0xLjg1MSAxLjI3bC0zMi4wNzEgNDIuODYwYy0wLjY3MiAwLjg5OC0wLjg3MiAyLjA2My0wLjU0MSAzLjEzMyAwLjMzMiAxLjA3MSAxLjE1NyAxLjkxOCAyLjIxOSAyLjI3OWwxNTcuNjQgNTMuNTAyYzAuMzcgMC4xMjUgMC43NDkgMC4xODcgMS4xMjUgMC4xODcgMS4wMzUgMCAyLjA0MS0wLjQ2MiAyLjcxOC0xLjI5Nmw0NC4xMjgtNTQuMzkxIDEzLjA4MiAzLjZjMC42MDcgMC4xNjggMS4yNDkgMC4xNjggMS44NTcgMCAwIDAgMC4wNjQtMC4wMTYgMC4xOTItMC4wNDFsMTMuMDgyLTMuNiA0NC4xMjkgNTQuMzkxYzAuNjc3IDAuODM0IDEuNjgzIDEuMjk1IDIuNzE4IDEuMjk1IDAuMzc2IDAgMC43NTYtMC4wNjEgMS4xMjUtMC4xODZsMTU3LjY0LTUzLjUwMmMxLjA2Mi0wLjM2MSAxLjg4Ny0xLjIwOSAyLjIxOS0yLjI3OSAwLjMzLTEuMDcyIDAuMTMtMi4yMzYtMC41NDItMy4xMzQtMC41NDItMC42NTgtMS40NjItMS4yMTgtMi44NDQtMS40NDF6bS0yMjEuMy03Ljg0LTEzMy42OS0zNi41MjUgMTMzLjY5LTM3LjUyNyAxMzMuNDkgMzcuNDc5LTEzMy40OSAzNi41NzN6Ii8+IDxwYXRoIGQ9Im0yMTEuMjQgMTk4LjE1Yy0xLjM5Ni0wLjQ5NC0yLjk1NS0wLjA1Ny0zLjg4OSAxLjA5OGwtMzcuNDQ4IDQ2LjI1NXMtMS43NjQgMi4zNTYtNC40ODggMS40MmMtMy4yNTItMS4xMjEtMTIyLjI2LTQxLjU5OC0xMjIuMjYtNDEuNTk4LTEuMDctMC4zNjMtMi4yNDgtMC4xODktMy4xNjUgMC40NjctMC45MTggMC42NTgtMS40NjIgMS43MTctMS40NjIgMi44NDZ2OTEuMjY3YzAgMS40MTYgMC44NTQgMi42OTIgMi4xNjMgMy4yMzNsMTY4LjA0IDY5LjQzOGMwLjQzIDAuMTc4IDAuODg1IDAuMjY2IDEuMzM2IDAuMjY2IDAuNjg0IDAgMS4zNjItMC4xOTkgMS45NDYtMC41OSAwLjk3Mi0wLjY1IDEuNTU1LTEuNzQyIDEuNTU1LTIuOTF2LTE2Ny44OWMwLTEuNDgyLTAuOTM1LTIuODA0LTIuMzMyLTMuMjk4eiIvPiAgPC9zdmc+`;

    constructor(
        public idTipoItem: number,
        public nome: NomeItem,
        public peso: number,
        public categoria: number,
        agrupavel: boolean = false,
    ) {
        this.id = Item.nextId++;
        this._agrupavel = agrupavel;

        if (!this.precisaEstarEmpunhado) {
            this.buffs.forEach(buff => {
                buff.ativaBuff();
            });
        }
    }

    get agrupavel(): boolean {
        return this._agrupavel;
    }

    get buffs(): Buff[] {
        return this._buffs.filter(buff => buff.ativo);
    }

    get nomeExibicao(): string { return this.nome.customizado };
    get nomeExibicaoOption(): string { return this.nome.customizado };
    get estaEmpunhado(): boolean { return !!this.idExtremidade; }

    adicionarBuffs(buffParams: [new (...args: any[]) => Buff, any[]][]): this { return (adicionarBuffsUtil(this, this._buffs, buffParams), this) };
    adicionarAcoes(acaoParams: [new (...args: any[]) => Acao, any[], (acao: Acao) => void][]): this { return (adicionarAcoesUtil(this, this.acoes, acaoParams), this) }


    ativarBuffs = (): void => {
        if (!this.precisaEstarEmpunhado) {
            this.buffs.map(buff => {
                buff.ativaBuff();
            });
        }
    }

    sacar = (idExtremidade: number): void => {
        LoggerHelper.getInstance().adicionaMensagem(`${this.nome.customizado} Empunhado`);

        this.idExtremidade = idExtremidade;
        this.refExtremidade = FichaHelper.getInstance().personagem.estatisticasBuffaveis.extremidades.find(extremidade => extremidade.id === idExtremidade);

        if (this.precisaEstarEmpunhado) {
            this.buffs.map(buff => {
                buff.ativaBuff();
            });
        }
    }

    guardar = (): void => {
        LoggerHelper.getInstance().adicionaMensagem(`${this.nome.customizado} Guardado`);

        this.idExtremidade = undefined;
        this.refExtremidade = undefined;

        if (this.precisaEstarEmpunhado) {
            this.buffs.map(buff => {
                buff.desativaBuff();
            })
        }
    }

    removeDoInventario(): void {
        FichaHelper.getInstance().personagem.inventario.removerItem(this.id);
        this.refExtremidade?.limpa();
    }

    get tooltipPropsGenerico(): TooltipProps {
        return {
            caixaInformacao: {
                cabecalho: [
                    { tipo: 'titulo', conteudo: this.nome.customizado },
                    { tipo: 'subtitulo', conteudo: this.nome.temNomeCustomizado ? this.nome.padrao : '' },
                ],
                corpo: [
                    { tipo: 'texto', conteudo: `Categoria ${this.categoria} | ${this.peso} ${pluralize(this.peso, 'Espaço')}` },
                ],
            },
            iconeCustomizado: {
                corDeFundo: (this.idExtremidade ? '#00000000' : '#DDDDDD'),
                svg: this.svg,
            },
            corTooltip: new CorTooltip('#FFFFFF').cores,
            numeroUnidades: 1,
        }
    }

    get tooltipPropsSingular(): TooltipProps {
        return this.tooltipPropsGenerico;
    }

    get tooltipPropsAgrupado(): TooltipProps {
        return this.tooltipPropsGenerico;
    }

    static get filtroProps(): FiltroProps<Item> {
        return new FiltroProps<Item>(
            "Items",
            [
                new FiltroPropsItems<Item>(
                    (item) => item.nome.padrao || item.nome.customizado,
                    'Nome do Item',
                    'Procure pelo Item',
                    'text',
                    true
                ),
                new FiltroPropsItems<Item>(
                    (item) => item.categoria,
                    'Categoria do Item',
                    'Selecione a Categoria',
                    'select',
                    true,
                    new OpcoesFiltro(
                        [0, 1, 2, 3, 4].map(categoria => {
                            return {
                                id: categoria,
                                nome: `Categoria ${categoria}`,
                            } as OpcaoFiltro;
                        })
                    ),
                ),
                new FiltroPropsItems<Item>(
                    (item) => item.idTipoItem,
                    'Tipo do Item',
                    'Selecione o Tipo',
                    'select',
                    true,
                    new OpcoesFiltro(
                        SingletonHelper.getInstance().tipos_items.map(tipo_item => {
                            return {
                                id: tipo_item.id,
                                nome: tipo_item.nome,
                            } as OpcaoFiltro;
                        })
                    ),
                )
            ]
        )
    }
}

export class ItemArma extends Item {
    static idTipoStatic = 1;
    private _idTipoItem: number;

    constructor(
        public nome: NomeItem,
        public peso: number,
        public categoria: number,
        precisaEstarEmpunhado: boolean,
        public detalhesArma: DetalhesItemArma,
    ) {
        super(ItemArma.idTipoStatic, nome, peso, categoria);
        this._idTipoItem = ItemArma.idTipoStatic;
        this.precisaEstarEmpunhado = precisaEstarEmpunhado;
    }

    get tooltipPropsSingular(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        return {
            caixaInformacao: {
                cabecalho: tooltipPropsSuper.caixaInformacao.cabecalho,
                corpo: [
                    { tipo: 'texto', conteudo: `Dano: ${this.detalhesArma.danoMinimo} - ${this.detalhesArma.dano}` },
                    { tipo: 'texto', conteudo: `Empunhado com ${this.detalhesArma.numeroExtremidadesUtilizadas} ${pluralize(this.detalhesArma.numeroExtremidadesUtilizadas, 'Extremidade')}` },
                    ...tooltipPropsSuper.caixaInformacao.corpo,
                    { tipo: 'separacao' },
                    ...this.acoes?.map(acao => ({
                        tipo: 'texto' as const,
                        conteudo: acao.nomeAcao,
                    })) || []
                ],
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: 1,
        }
    }

    get tooltipPropsAgrupado(): TooltipProps {
        return this.tooltipPropsSingular;
    }
}

export class DetalhesItemArma {
    constructor(
        public dano: number,
        public variancia: number,
        public numeroExtremidadesUtilizadas: number,
        private _idAtributoUtilizado: number,
        private _idPericiaUtilizada: number,
    ) { }

    get danoMinimo(): number { return this.dano - this.variancia; }
    get refAtributoUtilizadoArma(): AtributoPersonagem { return FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === this._idAtributoUtilizado)!; }
    get refPericiaUtilizadaArma(): PericiaPatentePersonagem { return FichaHelper.getInstance().personagem.pericias.find(pericia => pericia.refPericia.id === this._idPericiaUtilizada)!; }
}

export class ItemEquipamento extends Item {
    static idTipoStatic = 2;
    private _idTipoItem: number;

    constructor(
        public nome: NomeItem,
        public peso: number,
        public categoria: number,
        precisaEstarEmpunhado: boolean,
        public detalhesEquipamento: DetalhesItemEquipamento,
    ) {
        super(ItemEquipamento.idTipoStatic, nome, peso, categoria);
        this._idTipoItem = ItemEquipamento.idTipoStatic;
        this.precisaEstarEmpunhado = precisaEstarEmpunhado;
    }

    get buffs(): Buff[] {
        return this._buffs;
    }

    get tooltipPropsSingular(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        return {
            caixaInformacao: {
                cabecalho: tooltipPropsSuper.caixaInformacao.cabecalho,
                corpo: [
                    ...this.buffs?.map(buff => ({
                        tipo: 'texto' as const,
                        conteudo: `+${buff.valor} ${buff.refBuff.nome}${this.precisaEstarEmpunhado ? ` enquanto Empunhado` : ''}`,
                    })) || [],
                    ...tooltipPropsSuper.caixaInformacao.corpo,
                ],
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: 1,
        }
    }

    get tooltipPropsAgrupado(): TooltipProps {
        return this.tooltipPropsSingular;
    }
}

export class DetalhesItemEquipamento {
    constructor(

    ) { }
}

export class ItemConsumivel extends Item {
    static idTipoStatic = 3;
    private _idTipoItem: number;

    constructor(
        public nome: NomeItem,
        public peso: number,
        public categoria: number,
        precisaEstarEmpunhado: boolean,
        public detalhesConsumivel: DetalhesItemConsumivel,
    ) {
        super(ItemConsumivel.idTipoStatic, nome, peso, categoria, true);
        this._idTipoItem = ItemConsumivel.idTipoStatic;
        this.precisaEstarEmpunhado = precisaEstarEmpunhado;
    }

    get tooltipPropsSingular(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        return {
            caixaInformacao: {
                cabecalho: tooltipPropsSuper.caixaInformacao.cabecalho,
                corpo: [],
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: 1,
        }
    }

    get tooltipPropsAgrupado(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        return {
            caixaInformacao: {
                cabecalho: tooltipPropsSuper.caixaInformacao.cabecalho,
                corpo: [],
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: 1,
        }
    }
}

export class DetalhesItemConsumivel {
    constructor(

    ) { }
}

export class ItemComponente extends Item {
    static idTipoStatic = 4;
    private _idTipoItem: number;

    constructor(
        public nome: NomeItem,
        public peso: number,
        public categoria: number,
        public detalhesComponente: DetalhesItemComponente,
    ) {
        super(ItemComponente.idTipoStatic, nome, peso, categoria, true);
        this._idTipoItem = ItemComponente.idTipoStatic;
    }

    get nomeExibicaoOption(): string { return `${this.nome.customizado} (${this.detalhesComponente.usosAtuais})` };
    get agrupavel(): boolean {
        return (!this.estaEmpunhado && this._agrupavel);
    }

    get tooltipPropsSingular(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        const items: ItemComponente[] = [this];

        const caixaInformacaoProps = ItemComponente.obtemCaixaInformacaoProps(items);

        return {
            caixaInformacao: {
                cabecalho: [
                    ...tooltipPropsSuper.caixaInformacao.cabecalho,
                    ...caixaInformacaoProps.cabecalho,
                ],
                corpo: [
                    ...caixaInformacaoProps.corpo,
                ]
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: items.length
        }
    }

    get tooltipPropsAgrupado(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        let items: ItemComponente[] = [this];
        if (this.agrupavel) {
            items = FichaHelper.getInstance().personagem.inventario.items.filter(item => item instanceof ItemComponente && item.agrupavel && item.nome.padrao === this.nome.padrao && item.categoria === this.categoria && item.detalhesComponente.refElemento === this.detalhesComponente.refElemento && item.detalhesComponente.refNivelComponente) as ItemComponente[]
        }

        const caixaInformacaoProps = ItemComponente.obtemCaixaInformacaoProps(items);

        return {
            caixaInformacao: {
                cabecalho: [
                    ...tooltipPropsSuper.caixaInformacao.cabecalho,
                    ...caixaInformacaoProps.cabecalho,
                ],
                corpo: [
                    ...caixaInformacaoProps.corpo,
                ]
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: items.length
        }
    }

    static obtemCaixaInformacaoProps(items: ItemComponente[]): CaixaInformacaoProps {
        const { pesoTotal, usosTotais } = items.reduce((acc, cur) => {
            return {
                pesoTotal: acc.pesoTotal + cur.peso,
                usosTotais: acc.usosTotais + cur.detalhesComponente.usosAtuais
            };
        }, { pesoTotal: 0, usosTotais: 0 });

        return {
            cabecalho: [
                { tipo: 'subtitulo', conteudo: `${items.length} ${pluralize(items.length, 'Unidade')}` },
            ],
            corpo: [
                { tipo: 'texto', conteudo: `${usosTotais} ${pluralize(usosTotais, 'Uso')}` },
                { tipo: 'texto', conteudo: `Categoria ${items[0].categoria} | ${pesoTotal} ${pluralize(pesoTotal, 'Espaço')}` },
            ],
        }
    }

    gastaUso(): void {
        this.detalhesComponente.usosAtuais--;

        if (this.detalhesComponente.usosAtuais <= 0) {
            LoggerHelper.getInstance().adicionaMensagem(`Componente Finalizado`);
            this.removeDoInventario();
        }
    }

    verificaIgual(item: ItemComponente): boolean {
        return (
            this.detalhesComponente.refElemento.id === item.detalhesComponente.refElemento.id && this.detalhesComponente.refNivelComponente.id == item.detalhesComponente.refNivelComponente.id
        );
    }
}

export class DetalhesItemComponente {
    public usosAtuais: number;

    constructor(
        private _idElemento: number,
        private _idNivelComponente: number,
        public usosMaximos: number,
        public usos?: number,
    ) {
        this.usosAtuais = (usos ? usos : usosMaximos);
    }

    get refElemento(): Elemento {
        return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!;
    }

    get refNivelComponente(): NivelComponente {
        return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this._idNivelComponente)!;
    }
}