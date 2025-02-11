// // #region Imports
import { Item } from 'Classes/ClassesTipos/index.ts';
// import { LoggerHelper } from 'Classes/classes_estaticas.ts';

// import { getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';
// // #endregion


export type Extremidade = {
    refItem: Item | undefined;
    readonly estaOcupada: boolean;

    empunhar: () => void;
    guardar: () => void;
};

// export class Extremidade {
//     public idItemEmpunhado?: number;

//     constructor(
//         public id: number,
//     ) { }

//     empunhar = (idItem: number): void => {
//         LoggerHelper.getInstance().adicionaMensagem(`Empunhando na Extremidade ${this.id}`);

//         this.idItemEmpunhado = idItem;
//     }

//     guardar = (): void => {
//         LoggerHelper.getInstance().adicionaMensagem(`Extremidade ${this.id} livre`);

//         this.idItemEmpunhado = undefined;
//     }

//     public get refItem(): Item | undefined {
//         if (this.idItemEmpunhado === undefined) return undefined;

//         return getPersonagemFromContext().inventario.items.find(item => item.id === this.idItemEmpunhado);
//     }

//     get estaOcupada(): boolean { return this.refItem !== undefined; }
// }