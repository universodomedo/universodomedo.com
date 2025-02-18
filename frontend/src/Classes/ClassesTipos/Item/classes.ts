import { DadosAcao, DadosModificador, DadosNomeCustomizado, DadoPrecoExecucao, Elemento, Extremidade, Modificador, NivelComponente, NomeCustomizado, PrecoExecucao, CustoAcaoExecucao } from "Classes/ClassesTipos/index.ts";

export type Item = {
    readonly codigoUnico: string;
    readonly nome: NomeCustomizado;
    peso: number;
    categoria: number;

    readonly svg: string;
    readonly agrupavel: boolean;
    readonly nomeOpcao: string;

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

    readonly itemPodeSerEmpunhado: boolean;
    readonly itemPodeSerGuardado: boolean;
};

export type DadosItem = Pick<Item, 'peso' | 'categoria'> & {
    readonly identificadorNomePadrao: string;

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
    readonly custoEmpunhar: CustoAcaoExecucao;

    readonly estaEmpunhado: boolean;
    readonly extremidadeLivresSuficiente: boolean;
    // readonly execucoesSuficientes: boolean;
    // readonly mensagemExecucoesUsadasParaSacar: string;
};

export type DadosComportamentoEmpunhavel = Pick<ComportamentoEmpunhavel, 'extremidadesNecessarias'> & {
    readonly dadosCustoEmpunhar: DadoPrecoExecucao[];
};

export type ComportamentoVestivel = {
    estaVestido: boolean;

    readonly custoVestir: CustoAcaoExecucao;

    veste: () => void;
    desveste: () => void;
};

export type DadosComportamentoVestivel = {
    readonly dadosCustoVestir: DadoPrecoExecucao[];
}

export type ComportamentoComponenteRitualistico = {
    numeroDeCargasMaximo: number;
    numeroDeCargasAtuais: number;

    readonly refElemento: Elemento;
    readonly refNivelComponente: NivelComponente;

    readonly nomeComponente: string;

    gastaCargaComponente: () => void;
};

export type DadosComportamentoComponenteRitualistico = Pick<ComportamentoComponenteRitualistico, 'numeroDeCargasMaximo' | 'numeroDeCargasAtuais'> & {
    idElemento: number;
    idNivelComponente: number;
};