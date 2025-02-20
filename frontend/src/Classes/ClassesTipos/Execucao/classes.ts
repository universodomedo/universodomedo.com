import { LinhaEfeito } from 'Classes/ClassesTipos/index.ts';

export type ExecucaoModelo = {
    id: number;
    idLinhaEfeito: number;
    nome: string;
};

export type Execucao = ExecucaoModelo & {
    readonly nomeExibicao: string;
    readonly refLinhaEfeito: LinhaEfeito;
};

export type ExecucaoPersonagem = {
    numeroAcoesMaximasNatural: number;
    numeroAcoesAtuais: number;
    readonly numeroAcoesMaximasTotal: number;
    readonly refExecucao: Execucao;

    recarregaNumeroAcoes: () => void;
};

export type DadosExecucaoPersonagem = Omit<ExecucaoPersonagem, 'refExecucao'> & {
    idExecucao: number;
};

// export type ExecucaoModificada =
//     { tipo: 'Diminui', passo: number }
//     |
//     { tipo: 'Sobreescreve', novoGasto: ConstructorParameters<typeof CustoExecucao>[0] }