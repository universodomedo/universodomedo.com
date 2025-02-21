import { DadosModificador, DadosNomeCustomizado, DadoPrecoExecucao, Elemento, Extremidade, Modificador, NivelComponente, NomeCustomizado, CustoAcaoExecucao, DadosAcaoGenerica } from "Classes/ClassesTipos/index.ts";

export type Item = {
    readonly codigoUnico: string;
    readonly nome: NomeCustomizado;
    peso: number;
    categoria: number;

    readonly svg: string;
    readonly agrupavel: boolean;
    readonly nomeOpcao: string;

    dadosAcoes: DadosAcaoGenerica[];

    // eh opcional pq ele não pode ser criado ao mesmo tempo q o objeto do pai, para obter sua referencia
    modificadores?: Modificador[];

    comportamentoEmpunhavel?: ComportamentoEmpunhavel;
    comportamentoEquipavel?: ComportamentoEquipavel;
    comportamentoComponenteRitualistico?: ComportamentoComponenteRitualistico;
    comportamentoUtilizavel?: ComportamentoUtilizavel;

    quantidadeUnidadesDesseItem: number;

    readonly refTipoItem: TipoItem;

    readonly itemEmpunhavel: boolean;
    readonly itemEquipavel: boolean;
    readonly itemEhComponente: boolean;
    
    readonly itemEstaGuardado: boolean;
    readonly itemEstaEmpunhado: boolean;
    readonly itemEstaEquipado: boolean;
    itemTemUtilizavelNecessarios: (nomeUtilizavel: string, numeroUtilizelUsado: number) => boolean;

    readonly itemPodeSerEmpunhado: boolean;
    readonly itemPodeSerGuardado: boolean;
    readonly itemPodeSerEquipado: boolean;
    readonly itemPodeSerDesequipado: boolean;
};

export type DadosItem = Pick<Item, 'peso' | 'categoria'> & {
    readonly identificadorNomePadrao: string;

    idTipoItem: number;
    dadosNomeCustomizado: DadosNomeCustomizado;

    dadosAcoes?: DadosAcaoGenerica[];
    dadosModificadores?: DadosModificador[];
    
    dadosComportamentoEmpunhavel?: DadosComportamentoEmpunhavel;
    dadosComportamentoEquipavel?: DadosComportamentoEquipavel;
    dadosComportamentoComponenteRitualistico?: DadosComportamentoComponenteRitualistico;
    dadosComportamentoUtilizavel?: DadosComportamentoUtilizavel;
};

export type DadosItemSemIdentificador = Omit<DadosItem, 'identificadorNomePadrao'>;

export type TipoItemModelo = {
    id: number;
    nome: string;
};

export type TipoItem = TipoItemModelo;


// #region ComportamentoEmpunhavel
export type ComportamentoEmpunhavel = {
    refExtremidades: Extremidade[];

    readonly extremidadesNecessarias: number;
    readonly custoEmpunhar: CustoAcaoExecucao;

    readonly estaEmpunhado: boolean;
    readonly extremidadeLivresSuficiente: boolean;
};

export type DadosComportamentoEmpunhavel = Pick<ComportamentoEmpunhavel, 'extremidadesNecessarias'> & {
    readonly dadosCustoEmpunhar: DadoPrecoExecucao[];
};
// #endregion

// #region ComportamentoEquipavel
export type ComportamentoEquipavel = {
    estaEquipado: boolean;

    readonly custoEquipar: CustoAcaoExecucao;
};

export type DadosComportamentoEquipavel = {
    readonly dadosCustoEquipar: DadoPrecoExecucao[];
}
// #endregion

// #region ComportamentoComponenteRitualistico
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
// #endregion

// #region ComportamentoUtilizavel
export type ComportamentoUtilizavel = {
    dadosUtilizaveis: DadosUtilizavel[];

    retornaDadosUtilizavelPorNome: (nomeUtilizavel: string) => DadosUtilizavel | undefined;
};

export type DadosComportamentoUtilizavel = Pick<ComportamentoUtilizavel, 'dadosUtilizaveis'>;

export type DadosUtilizavel = {
    nomeUtilizavel: string;
    usosMaximos: number;
    usosAtuais: number;
};
// export type DadosComportamentoUtilizavel = ComportamentoUtilizavel;
// #endregion