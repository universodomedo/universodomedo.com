// #region Imports
import { Defesa, Execucao, EspacoInventario, GerenciadorEspacoCategoria, Extremidade } from 'Types/classes/index.ts';
// #endregion

export class EstatisticasBuffaveisPersonagem {
    constructor(
        public defesa: Defesa,
        public deslocamento: number,
        public resistenciaParanormal: number,
        public execucoes: Execucao[],
        public espacoInventario: EspacoInventario,
        public gerenciadorEspacoCategoria: GerenciadorEspacoCategoria,
        public extremidades: Extremidade[],
    ) { }
}

export class TipoEstatisticaBuffavel {
    constructor(
        public id: number,
        public nome: string
    ) { }
}