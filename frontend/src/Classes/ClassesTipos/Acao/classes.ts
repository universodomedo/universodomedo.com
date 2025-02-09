import { Custos, DificuldadeAcao, Habilidade, Item, realizaChecagemDificuldade, Ritual } from 'Classes/ClassesTipos/index.ts';

export type Acao = {
    nome: string;
    svg: string;
    readonly refPai: Ritual | Item | Habilidade;
    readonly bloqueada: boolean;

    travada: boolean;
    descricaoTravada: string;
    trava: (descricao: string) => void;
    destrava: () => void;

    custos: Custos;

    dadosAcaoCustomizada: undefined;

    dificuldadeAcao?: DificuldadeAcao;
    // processaDificuldades: () => boolean;

    executa: () => void;
};

export type DadosAcao = Pick<Acao, 'nome'> & {
    
};

export const executaAcao = (acao: Acao) => {
    if (!realizaChecagemDificuldade(acao)) return false;

    acao.custos.aplicaCustos();

    acao.executa();
};