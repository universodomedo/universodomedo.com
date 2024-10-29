// #region Imports
import { Personagem } from 'Types/classes/index.ts';
// #endregion

export class RequisitoFicha {
    constructor(
        private condicao: (personagem: Personagem) => boolean
    ) { }

    verificaRequisitoCumprido(personagem: Personagem): boolean {
        return this.condicao(personagem)
    }
}