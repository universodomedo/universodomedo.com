// #region Imports
import { GanhoIndividualNexFactory, GanhoIndividualNex } from './factory.ts'
import { Atributo, PericiaPatentePersonagem } from 'Types/classes/index.ts';
import { SingletonHelper } from "Types/classes_estaticas.tsx";
// #endregion

export class GanhosNex {
    public ganhos: GanhoIndividualNex[];
    public etapa:number = 1;

    constructor(dadosGanhos: { idTipoGanhoNex: number, opcoes?: any }[]) {
        this.ganhos = dadosGanhos.map(dado => GanhoIndividualNexFactory.criarGanhoIndividual(dado.idTipoGanhoNex, dado.opcoes));
    }

    get finalizados(): boolean { return false }

    proximaEtapa() { this.etapa++; }
}

export class TipoGanhoNex {
    constructor(
        public id: number,
        public nome: string
    ) { }
}

export class TrocaIndividualNex {
    public valorRestante: number = 0;

    constructor(
        private _idTipoGanhoNex: number,
        private _valor: number
    ) {
        this.atualizaValorRestante();
    }

    atualizaValorRestante(quantidadeTrocasRealizadas: number = 0) {
        this.valorRestante = this._valor - quantidadeTrocasRealizadas;
    }

    get refTipoGanhoNex(): TipoGanhoNex { return SingletonHelper.getInstance().tipos_ganho_nex.find(tipo_ganho_nex => tipo_ganho_nex.id === this._idTipoGanhoNex)! }
    get finalizado(): boolean { return this.valorRestante < 1 }
}

export class AtributoNexUp {
    public valorAtual: number;
    public ganhosEstatisticas: GanhoEstatisticaPorPontoDeAtributo[];

    constructor(
        public refAtributo: Atributo,
        public valorInicial: number,
        public valorMaximo: number
    ) {
        this.valorAtual = valorInicial;
        if (this.refAtributo.id === 1) {
            this.ganhosEstatisticas = [
                {
                    idEstatistica: 3,
                    valorPorPonto: .3
                }
            ];
        } else if (this.refAtributo.id === 2) {
            this.ganhosEstatisticas = [
                {
                    idEstatistica: 1,
                    valorPorPonto: 1
                },
                {
                    idEstatistica: 3,
                    valorPorPonto: .3
                }
            ];
        } else if (this.refAtributo.id === 3) {
            this.ganhosEstatisticas = [
                {
                    idEstatistica: 2,
                    valorPorPonto: .5
                }
            ];
        } else if (this.refAtributo.id === 4) {
            this.ganhosEstatisticas = [
                {
                    idEstatistica: 2,
                    valorPorPonto: .5
                }
            ];
        } else if (this.refAtributo.id === 5) {
            this.ganhosEstatisticas = [
                {
                    idEstatistica: 1,
                    valorPorPonto: 2
                },
                {
                    idEstatistica: 3,
                    valorPorPonto: .3
                }
            ];
        } else {
            this.ganhosEstatisticas = [];
        }
    }

    alterarValor(modificador: number) {
        this.valorAtual += modificador;
    }

    ganhoEstatistica(idEstatistica: number): number { const ganho = this.ganhosEstatisticas.find(ganhoEstatistica => ganhoEstatistica.idEstatistica === idEstatistica); return ganho ? ganho.valorPorPonto * this.valorAtual : 0; }

    get menorQueInicialmente(): boolean { return this.valorAtual < this.valorInicial }
    get estaEmValorMaximo(): boolean { return this.valorAtual >= this.valorMaximo }
    get estaMaiorQueInicial(): boolean { return this.valorAtual > this.valorInicial }
}

export class PericiaNexUp {
    constructor(
        public periciaPatente: PericiaPatentePersonagem,
    ) { }
}

type GanhoEstatisticaPorPontoDeAtributo = { idEstatistica: number, valorPorPonto: number }

export class ValorUtilizavel {
    public valorAtual:number;
    constructor(public valorInicial: number) { this.valorAtual = this.valorInicial; }

    get valorZerado(): boolean { return this.valorAtual === 0 }
    get valorAbaixoDeZero(): boolean { return this.valorAtual < 0 }

    aumentaValor() { this.valorAtual++; }
    diminuiValor() { this.valorAtual--; }
}

export class ValoresGanhoETroca {
    constructor (
        public ganhos: ValorUtilizavel,
        public trocas: ValorUtilizavel,
    ) {}
}