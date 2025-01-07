// #region Imports
import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export class Defesa {
    constructor(
        public valorNatural: number,
        public valorAdicionalPorAgilidade: number,
        public valorAdicionalPorForca: number,
        public valorAdicionalPorVigor: number,
    ) { }

    get defesaTotal(): number {
        return (
            this.valorNatural +
            (this.valorAdicionalPorAgilidade * getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === 1)?.valorTotal!) +
            (this.valorAdicionalPorForca * getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === 2)?.valorTotal!) +
            (this.valorAdicionalPorVigor * getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === 5)?.valorTotal!)
        );
    }
}