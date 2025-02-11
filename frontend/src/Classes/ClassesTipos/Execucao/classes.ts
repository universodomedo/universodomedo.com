import { SingletonHelper } from 'Classes/classes_estaticas';
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


export type PrecoExecucao = {
    quantidadeExecucoes: number;

    readonly refExecucao: Execucao;
    readonly descricaoPreco: string;

    __key: "criarPrecoExecucao";
};

export type DadosPrecoExecucao = Pick<PrecoExecucao, 'quantidadeExecucoes'> & {
    idExecucao: number;
};

export const criarPrecoExecucao = (listaDadosPrecoExecucao: DadosPrecoExecucao[]): PrecoExecucao[] => {
    return listaDadosPrecoExecucao.map(dadosPrecoExecucao => {
        return {
            quantidadeExecucoes: dadosPrecoExecucao.quantidadeExecucoes,

            get descricaoPreco(): string { return this.refExecucao.id === 1 ? 'Ação Livre' : `${this.quantidadeExecucoes} ${this.refExecucao.nomeExibicao}`; },
            get refExecucao(): Execucao { return SingletonHelper.getInstance().execucoes.find(execucao => execucao.id === dadosPrecoExecucao.idExecucao)!; },

            __key: "criarPrecoExecucao", // PrecoExecucao não deve ser criado se não usando esse metodo
        };
    });
};

// export type ExecucaoModificada =
//     { tipo: 'Diminui', passo: number }
//     |
//     { tipo: 'Sobreescreve', novoGasto: ConstructorParameters<typeof CustoExecucao>[0] }