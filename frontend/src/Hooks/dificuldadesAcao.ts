import { AtributoPersonagem, criarDificuldadeDinamica, DadosDificuldadeAcao, DificuldadeAcao, PericiaPatentePersonagem } from "Classes/ClassesTipos/index.ts";

export const criarDificuldades = (dadosDificuldade: DadosDificuldadeAcao, informacoesContextuais: { atributos: AtributoPersonagem[], pericias: PericiaPatentePersonagem[] }): DificuldadeAcao => {
    const { atributos, pericias } = informacoesContextuais;

    return {
        get refAtributoPersonagem(): AtributoPersonagem { return atributos.find(atributo => atributo.refAtributo.id === dadosDificuldade.idAtributo)!; },
        get refPericiaPatentePersonagem(): PericiaPatentePersonagem { return pericias.find(pericia => pericia.refPericia.id === dadosDificuldade.idPericia)!; },
        checagemDificuldade: {
            get valorChecagemDificuldade(): number { return (this.dificuldadeDinamica === undefined ? this.valorDificuldade : this.valorDificuldade + this.dificuldadeDinamica.valorDificuldadeAditivaAtual) },

            valorDificuldade: dadosDificuldade.valorDificuldade,
            ...(dadosDificuldade.dadosDificuldadeDinamica && {
                dificuldadeDinamica: criarDificuldadeDinamica(dadosDificuldade.dadosDificuldadeDinamica),
            })
        },
    }
};
