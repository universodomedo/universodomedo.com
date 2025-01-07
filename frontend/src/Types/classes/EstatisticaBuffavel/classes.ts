// #region Imports
import { Defesa, Execucao, EspacoInventario, GerenciadorEspacoCategoria, Extremidade, ValoresEfeito } from 'Types/classes/index.ts';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
// #endregion

export class EstatisticasBuffaveisPersonagem {
    public extremidades: Extremidade[];

    constructor(
        public defesa: Defesa,
        public _deslocamento: number,
        public resistenciaParanormal: number,
        public execucoes: Execucao[],
        public espacoInventario: EspacoInventario,
        public gerenciadorEspacoCategoria: GerenciadorEspacoCategoria,
        numExtremidades: number,
    ) {
        this.extremidades = Array.from({ length: numExtremidades }, (_, index) => new Extremidade(index + 1));
    }

    get deslocamento(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(this._deslocamento, 53); }

    // get deslocamento():number {
    //     return ((this._deslocamento * getPersonagemFromContext().modificadores.valorBuffPorId(53)) + 

    // }

    // get deslocamentoAdicional(): {valorMultiplicador: number, valor: number} {


    //     return {
    //         valorMultiplicador
    //     };
    // }

    get extremidadesLivres(): number { return this.extremidades.filter(extremidade => !extremidade.estaOcupada).length }
}

export class TipoEstatisticaBuffavel {
    constructor(
        public id: number,
        public nome: string
    ) { }
}