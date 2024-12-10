// #region Imports
import { Item } from 'Types/classes/index.ts';
import { FichaHelper, LoggerHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class Extremidade {
    public id: number;
    public idItemEmpunhado?: number;
    public bloqueado: boolean = false;
    public refItem?: Item;

    constructor(id: number) {
        this.id = id;
    }

    empunhar = (idItem: number): void => {
        LoggerHelper.getInstance().adicionaMensagem(`Empunhando na Extremidade ${this.id}`);

        this.idItemEmpunhado = idItem;
    }

    guardar = (): void => {
        LoggerHelper.getInstance().adicionaMensagem(`Extremidade ${this.id} livre`);

        this.limpa();
    }

    limpa = (): void => {
        this.idItemEmpunhado = undefined;
        this.refItem = undefined;
    }

    get estaOcupada(): boolean { return this.idItemEmpunhado !== undefined; }
}