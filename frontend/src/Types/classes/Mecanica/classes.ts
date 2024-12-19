// #region Imports
import { Acao, GastaCustoProps } from 'Types/classes/index.ts';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export class Mecanica {
    constructor(
        public id: number,
        public descricao: string,
    ) { }
}

export const logicaMecanicas: { [key: number]: (valoresSelecionados: GastaCustoProps, acao: Acao) => void } = {
    // Sacar
    1: (valoresSelecionados) => {
        const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

        itemSelecionado?.sacar();
    },

    // Guardar
    2: (valoresSelecionados) => {
        const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

        itemSelecionado?.guardar();
    },

    // Aplicar Buff
    3: (valoresSelecionados, acao) => {
        acao.ativaBuffs();
    },

    // Vestir
    4: (valoresSelecionados) => {
        const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

        itemSelecionado?.vestir();
    },

    // Desvestir
    5: (valoresSelecionados) => {
        const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

        itemSelecionado?.desvestir();
    },
};
