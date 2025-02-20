import { SingletonHelper } from 'Classes/classes_estaticas';
import { Elemento, Execucao, NivelComponente, OpcoesSelecionadasExecucaoAcao } from 'Classes/ClassesTipos/index.ts';

// #region Dados Gerais Custos
export type Custos = {
    readonly listaCustos: Custo[];

    custoAcaoExecucao: CustoAcaoExecucao;
    custoAcaoPE?: CustoAcaoPE;
    custoAcaoComponente?: CustoAcaoComponente;
    custoAcaoUtilizavel?: CustoAcaoUtilizavel;

    readonly custosPodemSerPagos: boolean;
    aplicaCustos: (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) => void;
};

export type Custo = {
    readonly podeSerPago: boolean;
    aplicaCusto: (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) => void;
};

export type DadosCustos = {
    dadosPrecoExecucao: DadoPrecoExecucao[];
    dadosPrecoPE?: DadosPrecoPE;
    dadosPrecoComponente?: DadosPrecoComponente;
    dadosPrecoUtilizavel? : DadosPrecoUtilizavel;
};
// #endregion

// #region Dados Custo Execução
type CustoExecucao = {
    listaPrecosOriginal: PrecoExecucao[];

    readonly listaPrecosAplicados: PrecoExecucao[];
    readonly descricaoListaPreco: string;
    readonly temApenasAcaoLivre: boolean;
    readonly resumoPagamento: string;
};

export type DadoPrecoExecucao = Pick<PrecoExecucao, 'quantidadeExecucoes'> & {
    idExecucao: number;
};

export type CustoAcaoExecucao = Custo & CustoExecucao;

export type PrecoExecucao = {
    quantidadeExecucoes: number;

    readonly refExecucao: Execucao;
    readonly descricaoPreco: string;

    __key: "criarPrecoExecucao";
};

export const criarPrecoExecucao = (dadosPrecoExecucao: DadoPrecoExecucao[]): PrecoExecucao[] => {
    return dadosPrecoExecucao.map(dadoPrecoExecucao => {
        return {
            quantidadeExecucoes: dadoPrecoExecucao.quantidadeExecucoes,

            get descricaoPreco(): string { return this.refExecucao.id === 1 ? 'Ação Livre' : `${this.quantidadeExecucoes} ${this.refExecucao.nomeExibicao}`; },
            get refExecucao(): Execucao { return SingletonHelper.getInstance().execucoes.find(execucao => execucao.id === dadoPrecoExecucao.idExecucao)!; },

            __key: "criarPrecoExecucao", // PrecoExecucao não deve ser criado se não usando esse metodo
        };
    });
};
// #endregion

// #region Dados Custo PE
type CustoPE = {
    valor: number;
};

export type DadosPrecoPE = Pick<CustoPE, 'valor'>;

export type CustoAcaoPE = Custo & CustoPE;
// #endregion

// #region Dados Custo Componente
type CustoComponente = {
    numeroCargasNoUso: number;
    precisaEstarEmpunhado: boolean;
    readonly refElemento: Elemento;
    readonly refNivelComponente: NivelComponente;
};

export type DadosPrecoComponente = Pick<CustoComponente, 'numeroCargasNoUso' | 'precisaEstarEmpunhado'> & {
    idElemento: number;
    idNivelComponente: number;
};

export type CustoAcaoComponente = Custo & CustoComponente;
// #endregion

// #region Dados Custo Utilizavel
export type CustoUtilizavel = {
    nomeUtilizavel: string;
    custoCargasUtilizavel: number;
};

export type DadosPrecoUtilizavel = Pick<CustoUtilizavel, 'nomeUtilizavel' | 'custoCargasUtilizavel'>;

export type CustoAcaoUtilizavel = Custo & CustoUtilizavel;
// #endregion

// export type GastaCustoProps = {
//     [key: string]: number | undefined
// };