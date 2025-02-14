import { SingletonHelper } from "Classes/classes_estaticas";
import { criarPrecoExecucao, DadosAcao, DadosModificador, DadosNomeCustomizado, DadosPrecoExecucao, Elemento, Extremidade, Modificador, NivelComponente, NomeCustomizado, PrecoExecucao } from "Classes/ClassesTipos/index.ts";

export type Item = {
    readonly codigoUnico: string;
    readonly nome: NomeCustomizado;
    peso: number;
    categoria: number;

    readonly svg: string;
    readonly agrupavel: boolean;

    dadosAcoes?: DadosAcao[];

    modificadores?: Modificador[];

    comportamentoEmpunhavel?: ComportamentoEmpunhavel;
    comportamentoVestivel?: ComportamentoVestivel;
    comportamentoComponenteRitualistico?: ComportamentoComponenteRitualistico;

    quantidadeUnidadesDesseItem: number;

    readonly refTipoItem: TipoItem;

    readonly itemEmpunhavel: boolean;
    readonly itemVestivel: boolean;
    readonly itemEhComponente: boolean;

    readonly itemEstaGuardado: boolean;
    readonly itemEstaEmpunhado: boolean;
    readonly itemEstaVestido: boolean;
};

export type DadosItem = Pick<Item, 'peso' | 'categoria'> & {
    idTipoItem: number;
    dadosNomeCustomizado: DadosNomeCustomizado;

    dadosAcoes?: DadosAcao[];
    dadosModificadores?: DadosModificador[];
    
    dadosComportamentoEmpunhavel?: DadosComportamentoEmpunhavel;
    dadosComportamentoVestivel?: DadosComportamentoVestivel;
    dadosComportamentoComponenteRitualistico?: DadosComportamentoComponenteRitualistico;
};

export type TipoItemModelo = {
    id: number;
    nome: string;
};

export type TipoItem = TipoItemModelo;

export type ComportamentoEmpunhavel = {
    refExtremidades: Extremidade[];

    readonly extremidadesNecessarias: number;
    readonly precoEmpunhar: PrecoExecucao[];

    readonly estaEmpunhado: boolean;
    readonly extremidadeLivresSuficiente: boolean;
    readonly execucoesSuficientes: boolean;
    readonly mensagemExecucoesUsadasParaSacar: string;
};

export type DadosComportamentoEmpunhavel = Pick<ComportamentoEmpunhavel, 'extremidadesNecessarias'> & {
    readonly dadosPrecoEmpunhar: DadosPrecoExecucao[];
};

export type ComportamentoVestivel = {
    estaVestido: boolean;

    readonly precoVestir: PrecoExecucao[];

    veste: () => void;
    desveste: () => void;

    __key: "criarComportamentoVestivel";
};

export type DadosComportamentoVestivel = {
    readonly dadosPrecoVestir: DadosPrecoExecucao[];
}

export const criarComportamentoVestivel = (dadosComportamentoVestivel: DadosComportamentoVestivel): ComportamentoVestivel => {
    return {
        estaVestido: false,

        get precoVestir(): PrecoExecucao[] { return criarPrecoExecucao(dadosComportamentoVestivel.dadosPrecoVestir) },

        veste: function() { console.log('precisa implementar veste'); },
        desveste: function() { console.log('precisa implementar desveste'); },

        __key: "criarComportamentoVestivel", // ComportamentoVestivel não deve ser criado se não usando esse metodo
    }
};

export type ComportamentoComponenteRitualistico = {
    readonly refElemento: Elemento;
    readonly refNivelComponente: NivelComponente;

    __key: "criarComportamentoComponenteRitualistico";
};

export type DadosComportamentoComponenteRitualistico = {
    idElemento: number;
    idNivelComponente: number;
    numeroDeCargasMaximo: number;
};

export const criarComportamentoComponenteRitualistico = (dadosComportamentoComponenteRitualistico: DadosComportamentoComponenteRitualistico): ComportamentoComponenteRitualistico => {
    return {
        get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === dadosComportamentoComponenteRitualistico.idElemento)!; },
        get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === dadosComportamentoComponenteRitualistico.idNivelComponente)!; },

        __key: "criarComportamentoComponenteRitualistico", // ComportamentoComponenteRitualistico não deve ser criado se não usando esse metodo
    }
};


// export class Item {
//     private static nextId = 1;
//     public id: number;


//         if (dadosComportamentos.dadosComportamentoUtilizavel !== undefined) this.comportamentos.setComportamentoUtilizavel(...dadosComportamentos.dadosComportamentoUtilizavel);
//         if (dadosComportamentos.dadosComportamentoMunicao !== undefined) this.comportamentos.setComportamentoMunicao(...dadosComportamentos.dadosComportamentoMunicao);
//     }

//     get modificadores(): Modificador[] { return this._modificadores; }

//     get nomeExibicao(): string { return this.dados.nome.nomeExibicao }
//     get agrupavel(): boolean { return this.dados.idTipoItem === 3 || this.dados.idTipoItem === 4 }

//     get itemEmpunhavel(): boolean { return this.comportamentos.podeSerEmpunhado; }
//     get itemVestivel(): boolean { return this.comportamentos.podeSerVestido; }

//     get itemEstaEmpunhado(): boolean { return this.comportamentos.estaEmpunhado; }
//     get itemEstaVestido(): boolean { return this.comportamentos.estaVestido; }
//     get itemEstaGuardado(): boolean { return !this.itemEstaEmpunhado && !this.itemEstaVestido; }

//     get itemPodeSerSacado(): boolean { return this.itemEstaGuardado && this.itemEmpunhavel; }
//     get itemPodeSerGuardado(): boolean { return this.itemEstaEmpunhado; }
//     get itemPodeSerVestido(): boolean { return this.itemEstaEmpunhado && this.itemVestivel; }
//     get itemPodeSerDesvestido(): boolean { return this.itemEstaVestido; }

//     get quantidadeUnidadesDesseItem(): number {
//         if (!this.agrupavel || this.itemEstaEmpunhado) return 1;

//         return getPersonagemFromContext().inventario.items.filter(item => item.nomeExibicao === this.nomeExibicao).length;
//     }

//     // adicionarBuffs(buffParams: [new (...args: any[]) => Buff, any[]][]): this { return (adicionarBuffsUtil(this, this._buffs, buffParams), this) };
//     adicionarModificadores(propsModificadores: ConstructorParameters<typeof Modificador>[0][]): this { return (adicionarModificadoresUtil(this, this._modificadores, propsModificadores), this); }
//     adicionarAcoes(acoes: { props: ConstructorParameters<typeof Acao>[0], config: (acao: Acao) => void }[]): this { return (adicionarAcoesUtil(this, this.acoes, acoes), this); }

//     // tem q dar uma olhada nisso aqui, pq teoricamente o sacar da rodando o mesmo foreach antes de chamar esse metodo, acho q da merda
//     ativaBuffsItem() { this._modificadores.forEach(modificador => modificador.ativaBuff()); }
//     desativaBuffsItem() { this._modificadores.forEach(modificador => modificador.desativaBuff()); }

//     sacar = (params?: ExecucaoModificada): void => {
//         // if (params && params.tipo === 'Sobreescreve') {
//         //     new CustoExecucao(params.novoGasto).gastaCusto();
//         // } else {
//         //     this.comportamentos.comportamentoEmpunhavel.precoParaSacarOuGuardar.gastaCusto();
//         // }

//         this.comportamentos.comportamentoEmpunhavel.empunha(this.id);

//         this.modificadores.filter(modificador => modificador.comportamentos.ehPassivoAtivaQuandoEmpunhado).forEach(() => this.ativaBuffsItem());

//         LoggerHelper.getInstance().adicionaMensagem(`${this.nomeExibicao} Empunhado`);
//     }

//     guardar = (): void => {
//         this.comportamentos.comportamentoEmpunhavel.desempunha();

//         this.modificadores.filter(modificador => modificador.comportamentos.ehPassivoAtivaQuandoEmpunhado).forEach(() => this.desativaBuffsItem());

//         LoggerHelper.getInstance().adicionaMensagem(`${this.nomeExibicao} Guardado`);
//     }

//     vestir = (): void => {
//         this.comportamentos.comportamentoVestivel.veste();
//         this.comportamentos.comportamentoEmpunhavel.desempunha();

//         this.modificadores.filter(modificador => modificador.comportamentos.ehPassivoAtivaQuandoVestido).forEach(() => this.ativaBuffsItem());

//         LoggerHelper.getInstance().adicionaMensagem(`${this.nomeExibicao} Vestido`);
//     }

//     desvestir = (): void => {
//         this.comportamentos.comportamentoVestivel.desveste();
//         this.sacar();

//         this.modificadores.filter(modificador => modificador.comportamentos.ehPassivoAtivaQuandoVestido).forEach(() => this.desativaBuffsItem());

//         LoggerHelper.getInstance().adicionaMensagem(`${this.nomeExibicao} Desvestido`);
//     }

//     gastaUso = (): void => {
//         const precisaRemover = this.comportamentos.comportamentoUtilizavel.gastaUsoERetornaSePrecisaRemover();

//         if (precisaRemover) this.removeDoInventario();
//     }

//     removeDoInventario(): void {
//         getPersonagemFromContext().inventario.removerItem(this.id);

//         if (this.itemEstaEmpunhado) this.comportamentos.comportamentoEmpunhavel.esvaziaExtremidades();
//     }

//     static get filtroProps(): FiltroProps<Item> {
//         return new FiltroProps<Item>(
//             [
//                 new FiltroPropsItems<Item>(
//                     (item) => item.dados.nome.padrao || item.dados.nome.customizado,
//                     'Nome do Item',
//                     'Procure pelo Item',
//                     'text',
//                     true
//                 ),
//                 new FiltroPropsItems<Item>(
//                     (item) => item.dados.categoria,
//                     'Categoria do Item',
//                     'Selecione a Categoria',
//                     'select',
//                     true,
//                     new OpcoesFiltro(
//                         [0, 1, 2, 3, 4].map(categoria => {
//                             return {
//                                 id: categoria,
//                                 nome: `Categoria ${categoria}`,
//                             } as OpcaoFiltro;
//                         })
//                     ),
//                 ),
//                 new FiltroPropsItems<Item>(
//                     (item) => item.dados.idTipoItem,
//                     'Tipo do Item',
//                     'Selecione o Tipo',
//                     'select',
//                     true,
//                     new OpcoesFiltro(
//                         SingletonHelper.getInstance().tipos_items.map(tipo_item => {
//                             return {
//                                 id: tipo_item.id,
//                                 nome: tipo_item.nome,
//                             } as OpcaoFiltro;
//                         })
//                     ),
//                 )
//             ]
//         )
//     }
// }

// export class NomeItem {
//     constructor(public padrao: string, public customizado?: string) { }

//     get temNomeCustomizado(): boolean { return this.customizado !== undefined && this.padrao !== this.customizado; }
//     get nomeExibicao(): string { return this.customizado || this.padrao; }
// }

// export class TipoItem {
//     constructor(
//         public id: number,
//         public nome: string
//     ) { }
// }