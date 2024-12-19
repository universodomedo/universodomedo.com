// #region Imports
import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export class Defesa {
    constructor(
        public valorNatural: number,
        public valorAdicionaPorAgilidade: number,
        public valorAdicionaPorForca: number,
        public valorAdicionaPorVigor: number,
    ) { }

    get defesaTotal(): number {
        return (
            this.valorNatural +
            (this.valorAdicionaPorAgilidade * getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === 1)?.valorTotal!) +
            (this.valorAdicionaPorForca * getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === 2)?.valorTotal!) +
            (this.valorAdicionaPorVigor * getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === 5)?.valorTotal!)
        );
    }
}