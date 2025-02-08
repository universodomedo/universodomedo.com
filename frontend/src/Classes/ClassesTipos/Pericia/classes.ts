import { Atributo, AtributoPersonagem, LinhaEfeito } from 'Classes/ClassesTipos/index.ts';

export type PericiaModelo = {
    id: number;
    idLinhaEfeito: number;
    idAtributo: number;
    nome: string;
    descricao: string;
};

export type Pericia = PericiaModelo & {
    readonly nomeAbreviado: string;
    readonly refLinhaEfeito: LinhaEfeito;
    readonly refAtributo: Atributo;
};

export type PatentePericiaModelo = {
    id: number;
    nome: string;
    valor: number;
    corTexto: string;
};

export type PatentePericia = PatentePericiaModelo;

export type PericiaPatentePersonagem = {
    readonly refPericia: Pericia;
    readonly refPatente: PatentePericia;
    readonly refAtributoPersonagem: AtributoPersonagem;

    readonly valorNivelPatente: number;
    readonly valorBonusPatente: number;

    readonly valorEfeito: number;
    readonly valorTotal: number;
    readonly detalhesValor: string[];
    
    realizarTeste: () => void;
};

export type DadosPericiaPatentePersonagem = {
    idPericia: number;
    idPatentePericia: number;
};