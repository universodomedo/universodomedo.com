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

    get defesaAdicionaPorAtributos(): number { return (this.valorAdicionalPorAgilidade * getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === 1)?.valorTotal!) + (this.valorAdicionalPorForca * getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === 2)?.valorTotal!) + (this.valorAdicionalPorVigor * getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === 5)?.valorTotal!); }

    get defesaTotal(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito( this.valorNatural + this.defesaAdicionaPorAtributos, 54); }
}