import { RLJ_Ficha2 } from 'Classes/ClassesTipos/index.ts';

export class RequisitoFicha {
    constructor(
        private condicao: (dados: RLJ_Ficha2) => boolean
    ) { }

    verificaRequisitoCumprido(dados: RLJ_Ficha2): boolean {
        return this.condicao(dados)
    }
}