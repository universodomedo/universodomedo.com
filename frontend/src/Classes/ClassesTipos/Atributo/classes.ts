import { LinhaEfeito } from "Classes/ClassesTipos/index.ts";

export type AtributoModelo = {
    id: number;
    idLinhaEfeito: number;
    nome: string;
    descricao: string;
};

export type Atributo = AtributoModelo & {
    readonly nomeAbreviado: string;
    readonly refLinhaEfeito: LinhaEfeito;
};

export type AtributoPersonagem = {
    valor: number;
    readonly refAtributo: Atributo;
    readonly valorTotal: number;
    readonly detalhesValor: string[];
}

export type DadosAtributoPersonagem = Pick<AtributoPersonagem, 'valor'> & {
    idAtributo: number;
};