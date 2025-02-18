import { Custos, DadosCustos, DadosDificuldadeAcao, DadosModificador, DificuldadeAcao, Habilidade, Item, Modificador, OpcoesExecucaoAcao, OpcoesSelecionadasExecucaoAcao, realizaChecagemDificuldade, Ritual } from 'Classes/ClassesTipos/index.ts';
import { ReactNode } from 'react';

export type Acao = {
    nome: string;
    svg: string;
    readonly refPai: Ritual | Item | Habilidade;
    readonly bloqueada: boolean;

    travada: boolean;
    descricaoTravada: string;
    trava: (descricao: string) => void;
    destrava: () => void;

    opcoesExecucaoAcao: OpcoesExecucaoAcao[];
}

export type AcaoGenerica = Acao & {
    readonly dificuldadeAcao?: DificuldadeAcao;

    readonly custos: Custos;

    modificadores?: Modificador[];

    logicaExecucao: () => void;
    executaAcao: (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) => void;
};

export type AcaoEspecifica = Acao & {
    tipoAcaoEspecifica: TipoAcaoEspecifica;

    readonly dadosCarregadosPreviamente: ReactNode;
    readonly dadosCarregadosNoChangeOption: (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) => ReactNode;

    readonly validaExecucao: (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) => boolean;

    executarAcaoEspecifica: (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) => void;
}

export type DadosAcao = Pick<Acao, 'nome'>;

export type DadosAcaoGenerica = DadosAcao & {
    dadosCustos: DadosCustos;
    dadosDificuldade?: DadosDificuldadeAcao;
    dadosModificadores?: DadosModificador[];
};

export type DadosAcaoEspecifica = DadosAcao & {
    tipoAcaoEspecifica: TipoAcaoEspecifica;

    readonly dadosCarregadosPreviamente: ReactNode;
    readonly dadosCarregadosNoChangeOption: (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) => ReactNode;

    readonly validaExecucao: (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) => boolean;

    executarAcaoEspecifica: (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) => void;
};

export type TipoAcaoEspecifica = 'Sacar Item' | 'Guardar Item' | 'Vestir Item' | 'Desvestir Item';

export function ehAcaoGenerica(acao: Acao): acao is AcaoGenerica {
    return !("tipoAcaoEspecifica" in acao);
}

export function ehAcaoEspecifica(acao: Acao): acao is AcaoEspecifica {
    return "tipoAcaoEspecifica" in acao;
}

export function dadosAcaoEhDeAcaoEspecifica(dadosAcao: DadosAcao): dadosAcao is DadosAcao & DadosAcaoEspecifica {
    return 'tipoAcaoEspecifica' in dadosAcao;
}