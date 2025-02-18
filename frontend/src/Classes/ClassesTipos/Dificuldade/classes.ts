import { Acao, AtributoPersonagem, PericiaPatentePersonagem } from "Classes/ClassesTipos/index.tsx";

export type DificuldadeAcao = {
    readonly refAtributoPersonagem: AtributoPersonagem;
    readonly refPericiaPatentePersonagem: PericiaPatentePersonagem;

    readonly checagemDificuldade: ChecagemDificuldade;
};

export type DadosDificuldadeAcao = {
    idAtributo: number;
    idPericia: number;
    valorDificuldade: number;

    dadosDificuldadeDinamica?: DadosDificuldadeDinamica;
};

export type ChecagemDificuldade = {
    readonly valorChecagemDificuldade: number;

    valorDificuldade: number;
    dificuldadeDinamica?: DificuldadeDinamica;
};

export type DificuldadeDinamica = {
    readonly valorDificuldadeAditivaInicial: number;
    readonly modificadorDificuldadeInicial: number;
    
    valorDificuldadeAditivaAtual: number;
    modificadorDificuldadeAtual: number;
    listaModificadoresDificuldade: number[];

    indiceListaModificadores: number;

    atualizaDificuldade: () => void;

    resetaDificuldade: () => void;

    resetaModificadorDificuldade: () => void;

    __key: "criarDificuldadeDinamica";
}

export type DadosDificuldadeDinamica = Pick<DificuldadeDinamica, 'modificadorDificuldadeInicial'> & {
    listaModificadoresDificuldade: number[];
};

export const criarDificuldadeDinamica = (dadosDificuldadeDinamica: DadosDificuldadeDinamica): DificuldadeDinamica => {
    return {
        valorDificuldadeAditivaInicial: 0,
        modificadorDificuldadeInicial: dadosDificuldadeDinamica.modificadorDificuldadeInicial,

        valorDificuldadeAditivaAtual: 0,
        modificadorDificuldadeAtual: dadosDificuldadeDinamica.modificadorDificuldadeInicial,
        listaModificadoresDificuldade: dadosDificuldadeDinamica.listaModificadoresDificuldade,

        indiceListaModificadores: 0,

        atualizaDificuldade: function() {
            this.valorDificuldadeAditivaAtual += this.modificadorDificuldadeAtual;

            if (this.indiceListaModificadores < this.listaModificadoresDificuldade.length) {
                this.modificadorDificuldadeAtual += this.listaModificadoresDificuldade[this.indiceListaModificadores];

                this.indiceListaModificadores++;
            }
        },

        resetaDificuldade: function() { this.valorDificuldadeAditivaAtual = this.valorDificuldadeAditivaInicial; },

        resetaModificadorDificuldade: function() {
            this.modificadorDificuldadeAtual = this.modificadorDificuldadeInicial;
            this.indiceListaModificadores = 0;
        },

        __key: "criarDificuldadeDinamica", // DificuldadeDinamica não deve ser criado se não usando esse metodo
    }
};

export const realizaChecagemDificuldade = (dificuldadeAcao: DificuldadeAcao): boolean => {
    const retornoChecagemDificuldade = dificuldadeAcao.refPericiaPatentePersonagem.realizarTeste();

    if (retornoChecagemDificuldade >= dificuldadeAcao.checagemDificuldade.valorChecagemDificuldade) {
        if (dificuldadeAcao.checagemDificuldade.dificuldadeDinamica !== undefined) dificuldadeAcao.checagemDificuldade.dificuldadeDinamica.atualizaDificuldade();

        return true;
    } else {
        return false;
    }
};