import { PrecoExecucao } from 'Classes/ClassesTipos/index.ts';


export type Custos = {
    readonly listaCustos: Custo[];

    custoAcaoExecucao: CustoAcaoExecucao;
    custoAcaoPE?: CustoAcaoPE;

    readonly custosPodemSerPagos: boolean;
    aplicaCustos: () => void;
};

export type Custo = {
    readonly podeSerPago: boolean;
    aplicaCusto: () => void;
};

export type CustoPE = {
    valor: number;
};

export type CustoAcaoPE = Custo & CustoPE;

export type CustoExecucao = {
    listaPrecosOriginal: PrecoExecucao[];

    readonly listaPrecosAplicados: PrecoExecucao[];
    readonly descricaoListaPreco: string;
    readonly temApenasAcaoLivre: boolean;
    readonly resumoPagamento: string;
};

export type CustoAcaoExecucao = Custo & CustoExecucao;


// export abstract class Custo {
//     abstract get podeSerPago(): boolean;
//     abstract get descricaoCusto(): string;
//     public abstract gastaCusto(props: GastaCustoProps): void;
// }

// export class CustoExecucao extends Custo {
//     public precoExecucao: PrecoExecucao;

//     constructor({ precoExecucao }: { precoExecucao: ConstructorParameters<typeof PrecoExecucao>[0] }) {
//         super();
//         this.precoExecucao = new PrecoExecucao(precoExecucao);
//     }

//     get podeSerPago(): boolean { return this.precoExecucao.podePagar; }
//     get descricaoCusto(): string { return this.precoExecucao.descricaoListaPreco; }

//     gastaCusto(): void {
//         if (this.precoExecucao.temApenasAcaoLivre) return;

//         this.precoExecucao.pagaExecucao();
//     }
// }

// export class CustoPE extends Custo {
//     public valor: number;

//     constructor({ valor }: { valor: number }) {
//         super();
//         this.valor = valor;
//     }

//     get desconto(): number { return 0; }
//     // get desconto(): number { return this.refAcao!.refPai instanceof Ritual ? this.refAcao!.refPai.comportamentos.comportamentoDescontosRitual.valorDesconto : 0; }
//     get valorTotal(): number { return Math.max(this.valor - this.desconto, 1); }

//     get podeSerPago(): boolean {
//         const { estatisticasDanificaveis } = useClasseContextualPersonagemEstatisticasDanificaveis();
//         return this.valorTotal <= estatisticasDanificaveis.find(estatisticaDanificavel => estatisticaDanificavel.refEstatisticaDanificavel.id === 3)!.valor;
//     }
//     // get podeSerPago(): boolean { return this.valorTotal <= getPersonagemFromContext().estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)!.valor; }
//     get descricaoCusto(): string { return `${this.valorTotal} P.E.`; }

//     gastaCusto(): void {
//         LoggerHelper.getInstance().adicionaMensagem(`-${this.valorTotal} P.E.`);
//         // getPersonagemFromContext().estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)!.aplicarDanoFinal(this.valorTotal);
//     }
// }

// export class CustoComponente extends Custo {
//     public numeroDeCargas: number;
//     public componentePrecisaEstarEmpunhado: boolean;
//     public idElemento: number;
//     public idNivel: number;

//     constructor({ numeroDeCargas, componentePrecisaEstarEmpunhado, idElemento, idNivel }: { numeroDeCargas: number, componentePrecisaEstarEmpunhado: boolean, idElemento: number, idNivel: number }) {
//         super();
//         this.numeroDeCargas = numeroDeCargas;
//         this.componentePrecisaEstarEmpunhado = componentePrecisaEstarEmpunhado;
//         this.idElemento = idElemento;
//         this.idNivel = idNivel;
//     }

//     get podeSerPago(): boolean { return true; }
//     get descricaoCusto(): string { return `${this.numeroDeCargas} Carga de Componente de ${this.refElemento.nome} ${this.refNivelComponente.nome}`; }
//     public gastaCusto(props: GastaCustoProps): void {}

//     get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this.idElemento)!; }
//     get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this.idNivel)! }
// }

// export type GastaCustoProps = {
//     [key: string]: number | undefined
// };