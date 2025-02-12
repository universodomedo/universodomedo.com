import { Custos, DadosCustos, DadosDificuldadeAcao, DadosModificador, DificuldadeAcao, Habilidade, Item, Modificador, realizaChecagemDificuldade, Ritual } from 'Classes/ClassesTipos/index.ts';

export type Acao = {
    nome: string;
    svg: string;
    readonly refPai: Ritual | Item | Habilidade;
    readonly bloqueada: boolean;

    travada: boolean;
    descricaoTravada: string;
    trava: (descricao: string) => void;
    destrava: () => void;

    readonly dificuldadeAcao?: DificuldadeAcao;

    readonly custos: Custos;

    modificadores?: Modificador[];

    dadosAcaoCustomizada?: undefined;

    executa: () => void;
};

export type DadosAcao = Pick<Acao, 'nome'> & {
    dadosCustos: DadosCustos;
    dadosDificuldade: DadosDificuldadeAcao;
    dadosModificadores?: DadosModificador[];
};

export const executaAcao = (acao: Acao) => {
    if (!realizaChecagemDificuldade(acao)) return false;
    
    acao.custos.aplicaCustos();

    acao.executa();
};