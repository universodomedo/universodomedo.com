// #region Imports
import { Item } from 'Types/classes/index.ts';
import { LoggerHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export class Extremidade {
    public idItemEmpunhado?: number;

    constructor(
        public id: number,
    ) { }

    empunhar = (idItem: number): void => {
        LoggerHelper.getInstance().adicionaMensagem(`Empunhando na Extremidade ${this.id}`);

        this.idItemEmpunhado = idItem;
    }

    guardar = (): void => {
        LoggerHelper.getInstance().adicionaMensagem(`Extremidade ${this.id} livre`);

        this.idItemEmpunhado = undefined;
    }

    public get refItem(): Item | undefined {
        if (this.idItemEmpunhado === undefined) return undefined;

        return getPersonagemFromContext().inventario.items.find(item => item.id === this.idItemEmpunhado);
    }

    get estaOcupada(): boolean { return this.refItem !== undefined; }
}