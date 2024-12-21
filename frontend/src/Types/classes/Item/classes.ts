// #region Imports
import { Acao, adicionarAcoesUtil, adicionarBuffsUtil, AtributoPersonagem, Buff, ComportamentoEmpunhavel, ComportamentoGeral, ComportamentoUtilizavel, ComportamentoVestivel, CorTooltip, DetalhesItem, Elemento, Extremidade, FiltroProps, FiltroPropsItems, inicializarDetalhesItem, NivelComponente, OpcaoFiltro, OpcoesFiltro, PericiaPatentePersonagem } from 'Types/classes/index.ts';
import { LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export class Item {
    private static nextId = 1;
    public id: number;

    public acoes: Acao[] = [];
    protected _buffs: Buff[] = [];
    public detalhesItem: DetalhesItem;
    public comportamentoUtilizavel: ComportamentoUtilizavel;
    private comportamentoEmpunhavel: ComportamentoEmpunhavel;
    private comportamentoVestivel: ComportamentoVestivel;
    public comportamentoGeral: ComportamentoGeral;

    public svg = `PHN2ZyB3aWR0aD0iMjU2cHgiIGhlaWdodD0iMjU2cHgiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNDQ0LjE4IDQ0NC4xOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICA8cGF0aCBkPSJtNDA0LjIgMjA1Ljc0Yy0wLjkxNy0wLjY1Ni0yLjA5Ni0wLjgzLTMuMTY1LTAuNDY3IDAgMC0xMTkuMDEgNDAuNDc3LTEyMi4yNiA0MS41OTgtMi43MjUgMC45MzgtNC40ODctMS40Mi00LjQ4Ny0xLjQybC0zNy40NDgtNDYuMjU0Yy0wLjkzNS0xLjE1NC0yLjQ5Mi0xLjU5Mi0zLjg5LTEuMDk4LTEuMzk2IDAuNDk0LTIuMzMyIDEuODE2LTIuMzMyIDMuMjk5djE2Ny44OWMwIDEuMTY4IDAuNTgzIDIuMjYgMS41NTYgMi45MSAwLjU4NCAwLjM5MSAxLjI2MyAwLjU5IDEuOTQ1IDAuNTkgMC40NTEgMCAwLjkwNi0wLjA4OCAxLjMzNi0wLjI2N2wxNjguMDQtNjkuNDM4YzEuMzEtMC41NDEgMi4xNjMtMS44MTggMi4xNjMtMy4yMzR2LTkxLjI2NmMwLTEuMTI2LTAuNTQ0LTIuMTg1LTEuNDYyLTIuODQ0eiIvPiA8cGF0aCBkPSJtNDQzLjQ5IDE2OC4yMi0zMi4wNy00Mi44NTljLTAuNDYtMC42MTUtMS4xMTEtMS4wNjEtMS44NTItMS4yNzBsLTE4Ni40Mi01Mi42MzZjLTAuNjIyLTAuMTc2LTEuNDY1LTAuMTI1LTIuMDk2IDAuMDQ5bC0xODYuNDIgNTIuNjM2Yy0wLjczOSAwLjIwOS0xLjM5MSAwLjY1NC0xLjg1MSAxLjI3bC0zMi4wNzEgNDIuODYwYy0wLjY3MiAwLjg5OC0wLjg3MiAyLjA2My0wLjU0MSAzLjEzMyAwLjMzMiAxLjA3MSAxLjE1NyAxLjkxOCAyLjIxOSAyLjI3OWwxNTcuNjQgNTMuNTAyYzAuMzcgMC4xMjUgMC43NDkgMC4xODcgMS4xMjUgMC4xODcgMS4wMzUgMCAyLjA0MS0wLjQ2MiAyLjcxOC0xLjI5Nmw0NC4xMjgtNTQuMzkxIDEzLjA4MiAzLjZjMC42MDcgMC4xNjggMS4yNDkgMC4xNjggMS44NTcgMCAwIDAgMC4wNjQtMC4wMTYgMC4xOTItMC4wNDFsMTMuMDgyLTMuNiA0NC4xMjkgNTQuMzkxYzAuNjc3IDAuODM0IDEuNjgzIDEuMjk1IDIuNzE4IDEuMjk1IDAuMzc2IDAgMC43NTYtMC4wNjEgMS4xMjUtMC4xODZsMTU3LjY0LTUzLjUwMmMxLjA2Mi0wLjM2MSAxLjg4Ny0xLjIwOSAyLjIxOS0yLjI3OSAwLjMzLTEuMDcyIDAuMTMtMi4yMzYtMC41NDItMy4xMzQtMC41NDItMC42NTgtMS40NjItMS4yMTgtMi44NDQtMS40NDF6bS0yMjEuMy03Ljg0LTEzMy42OS0zNi41MjUgMTMzLjY5LTM3LjUyNyAxMzMuNDkgMzcuNDc5LTEzMy40OSAzNi41NzN6Ii8+IDxwYXRoIGQ9Im0yMTEuMjQgMTk4LjE1Yy0xLjM5Ni0wLjQ5NC0yLjk1NS0wLjA1Ny0zLjg4OSAxLjA5OGwtMzcuNDQ4IDQ2LjI1NXMtMS43NjQgMi4zNTYtNC40ODggMS40MmMtMy4yNTItMS4xMjEtMTIyLjI2LTQxLjU5OC0xMjIuMjYtNDEuNTk4LTEuMDctMC4zNjMtMi4yNDgtMC4xODktMy4xNjUgMC40NjctMC45MTggMC42NTgtMS40NjIgMS43MTctMS40NjIgMi44NDZ2OTEuMjY3YzAgMS40MTYgMC44NTQgMi42OTIgMi4xNjMgMy4yMzNsMTY4LjA0IDY5LjQzOGMwLjQzIDAuMTc4IDAuODg1IDAuMjY2IDEuMzM2IDAuMjY2IDAuNjg0IDAgMS4zNjItMC4xOTkgMS45NDYtMC41OSAwLjk3Mi0wLjY1IDEuNTU1LTEuNzQyIDEuNTU1LTIuOTF2LTE2Ny44OWMwLTEuNDgyLTAuOTM1LTIuODA0LTIuMzMyLTMuMjk4eiIvPiAgPC9zdmc+`;

    constructor(
        public idTipoItem: number,
        public nome: NomeItem,
        public peso: number,
        public categoria: number,

        partialDetalhesItem: Partial<DetalhesItem> = {},
        usosMaximo: number = 0,
    ) {
        this.id = Item.nextId++;

        this.detalhesItem = inicializarDetalhesItem(partialDetalhesItem);
        this.comportamentoUtilizavel = new ComportamentoUtilizavel(usosMaximo);
        this.comportamentoEmpunhavel = new ComportamentoEmpunhavel(true);
        this.comportamentoVestivel = new ComportamentoVestivel(this.detalhesItem.podeSerVestido);
        this.comportamentoGeral = new ComportamentoGeral({ detalhesOfensivo: this.detalhesItem.detalhesOfensivo, detalhesComponente: this.detalhesItem.detalhesComponente });
    }

    get nomeExibicao(): string { return this.nome.nomeExibicao }
    get agrupavel(): boolean { return this.idTipoItem === 3 || this.idTipoItem === 4 }

    get itemEmpunhavel(): boolean { return this.comportamentoEmpunhavel.podeSerEmpunhado; }
    get itemVestivel(): boolean { return this.comportamentoVestivel.podeSerVestido; }

    get itemEstaEmpunhado(): boolean { return this.comportamentoEmpunhavel.estaEmpunhado; }
    get itemEstaVestido(): boolean { return this.comportamentoVestivel.estaVestido; }
    get itemEstaGuardado(): boolean { return !this.itemEstaEmpunhado && !this.itemEstaVestido; }

    get itemPodeSerSacado(): boolean { return this.itemEstaGuardado && this.comportamentoEmpunhavel.podeSerEmpunhado; }
    get itemPodeSerGuardado(): boolean { return this.itemEstaEmpunhado; }
    get itemPodeSerVestido(): boolean { return this.itemEstaEmpunhado && this.comportamentoVestivel.podeSerVestido; }
    get itemPodeSerDesvestido(): boolean { return this.itemEstaVestido; }

    get quantidadeUnidadesDesseItem(): number {
        if (!this.agrupavel || this.itemEstaEmpunhado) return 1;

        return getPersonagemFromContext().inventario.items.filter(item => item.nomeExibicao === this.nomeExibicao).length;
    }

    adicionarBuffs(buffParams: [new (...args: any[]) => Buff, any[]][]): this { return (adicionarBuffsUtil(this, this._buffs, buffParams), this) };
    adicionarAcoes(acaoParams: [new (...args: any[]) => Acao, any[], (acao: Acao) => void][]): this { return (adicionarAcoesUtil(this, this.acoes, acaoParams), this) }

    ativaBuffsItem() {
        this._buffs.forEach(buff => buff.ativaBuff());
    }

    desativaBuffsItem() {
        this._buffs.forEach(buff => buff.desativaBuff());
    }

    sacar = (): void => {
        this.comportamentoEmpunhavel.empunha(this.id);

        if (this.detalhesItem.precisaEstarEmpunhado) this.ativaBuffsItem();

        LoggerHelper.getInstance().adicionaMensagem(`${this.nomeExibicao} Empunhado`);
    }

    guardar = (): void => {
        this.comportamentoEmpunhavel.desempunha();

        if (this.detalhesItem.precisaEstarEmpunhado) this.desativaBuffsItem();
        
        LoggerHelper.getInstance().adicionaMensagem(`${this.nomeExibicao} Guardado`);
    }

    vestir = (): void => {
        this.comportamentoVestivel.veste();
        this.comportamentoEmpunhavel.desempunha();

        if (this.detalhesItem.precisaEstarVetindo) this.ativaBuffsItem();

        LoggerHelper.getInstance().adicionaMensagem(`${this.nomeExibicao} Vestido`);
    }

    desvestir = (): void => {
        this.comportamentoVestivel.desveste();
        this.sacar();

        if (this.detalhesItem.precisaEstarVetindo) this.desativaBuffsItem();

        LoggerHelper.getInstance().adicionaMensagem(`${this.nomeExibicao} Desvestido`);
    }

    gastaUso = (): void => {
        const precisaRemover = this.comportamentoUtilizavel.gastaUsoERetornaSePrecisaRemover();

        if (precisaRemover) this.removeDoInventario();
    }

    removeDoInventario(): void {
        getPersonagemFromContext().inventario.removerItem(this.id);
        this.comportamentoEmpunhavel.refExtremidade?.guardar();
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

export class NomeItem {
    constructor(public padrao: string, public customizado?: string) { }

    get temNomeCustomizado(): boolean { return this.customizado !== undefined && this.padrao !== this.customizado; }
    get nomeExibicao(): string { return this.customizado || this.padrao; }
}

export class TipoItem {
    constructor(
        public id: number,
        public nome: string
    ) { }
}