// #region Imports
import { Item } from 'Types/classes/index.ts';
import { FichaHelper, LoggerHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class Extremidade {
    private static nextId = 1;
    public id: number;
    public idItemEmpunhado?: number;
    public bloqueado: boolean = false;
    public refItem?: Item;

    constructor() {
        this.id = Extremidade.nextId++;
    }

    empunhar = (idItem: number): void => {
        LoggerHelper.getInstance().adicionaMensagem(`Empunhando na Extremidade ${this.id}`);

        this.idItemEmpunhado = idItem;
        this.refItem = FichaHelper.getInstance().personagem.inventario.items.find(item => item.id === idItem)!;
        this.refItem?.sacar(this.id);
        FichaHelper.getInstance().personagem.onUpdate();
    }

    guardar = (): void => {
        LoggerHelper.getInstance().adicionaMensagem(`Extremidade ${this.id} livre`);

        this.refItem?.guardar();
        this.limpa();
    }

    limpa = (): void => {
        this.idItemEmpunhado = undefined;
        this.refItem = undefined;
        FichaHelper.getInstance().personagem.onUpdate();
    }
}