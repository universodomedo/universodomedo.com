// #region Imports
import { Personagem } from 'Classes/ClassesTipos/index.ts';
// #endregion

export class RequisitoFicha {
    constructor(
        private condicao: (personagem: Personagem) => boolean
    ) { }

    verificaRequisitoCumprido(personagem: Personagem): boolean {
        return this.condicao(personagem)
    }
}