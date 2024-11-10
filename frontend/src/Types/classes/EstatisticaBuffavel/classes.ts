// #region Imports
import { Defesa, Execucao, EspacoInventario, GerenciadorEspacoCategoria, Extremidade } from 'Types/classes/index.ts';
// #endregion

export class EstatisticasBuffaveisPersonagem {
    public extremidades: Extremidade[];

    constructor(
        public defesa: Defesa,
        public deslocamento: number,
        public resistenciaParanormal: number,
        public execucoes: Execucao[],
        public espacoInventario: EspacoInventario,
        public gerenciadorEspacoCategoria: GerenciadorEspacoCategoria,
        numExtremidades: number,
    ) {
        this.extremidades = Array.from({ length: numExtremidades }, () => new Extremidade());
    }
}

export class TipoEstatisticaBuffavel {
    constructor(
        public id: number,
        public nome: string
    ) { }
}