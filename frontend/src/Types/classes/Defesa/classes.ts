// #region Imports
import { FichaHelper } from 'Types/classes_estaticas.tsx';
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
            (this.valorAdicionaPorAgilidade * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 1)?.valorTotal!) +
            (this.valorAdicionaPorForca * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 2)?.valorTotal!) +
            (this.valorAdicionaPorVigor * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 5)?.valorTotal!)
        );
    }
}