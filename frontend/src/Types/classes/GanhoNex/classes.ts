// #region Imports
import { Atributo, PericiaPatentePersonagem } from 'Types/classes/index.ts';
import { SingletonHelper } from "Types/classes_estaticas.tsx";
// #endregion

export class GanhosNex {
    public estadoGanhosNex: EstadoGanhosNex;
    public etapa:number = 2;
    // public etapa:number = 1;

    constructor(
        public ganhos: GanhoIndividualNex[],
        public maxAtributo: number,
        public trocas?: TrocaIndividualNex[],
        // public ganhosClasse?: GanhoIndividualNex[],
    ) {
        this.estadoGanhosNex = new EstadoGanhosNex(ganhos.find(ganho => ganho.refTipoGanhoNex.id === 1)!, trocas?.find(troca => troca.refTipoGanhoNex.id === 1)!, maxAtributo)
    }

    get finalizados(): boolean {
        return (
            this.ganhos
                ? this.ganhos?.every(ganho => ganho.finalizado) ?? false
                : true
        );
    }

    proximaEtapa() {
        this.etapa++;
    }
}

export class TipoGanhoNex {
    constructor(
        public id: number,
        public nome: string
    ) { }
}

export class EstadoGanhosNex {
    public atributos: AtributoNexUp[];
    public pericias: PericiaNexUp[];

    constructor(
        public ganhosAtributos: GanhoIndividualNex,
        public trocasAtributos: TrocaIndividualNex,
        public valorMaxAtributo: number,
        public valorMinAtributo: number = 0
    ) {
        this.atributos = SingletonHelper.getInstance().atributos.map(atributo => { return new AtributoNexUp(atributo, 1, valorMaxAtributo) });
        this.pericias = SingletonHelper.getInstance().pericias.map(pericia => { return new PericiaNexUp(new PericiaPatentePersonagem(pericia.id, 1)) });
    }

    gastaPonto(idAtributo: number, modificador: number) {
        const atributo = this.atributos.find(atributo => atributo.refAtributo.id === idAtributo)!;
        atributo.alterarValor(modificador);
        this.ganhosAtributos.alterarValor(modificador);
        this.trocasAtributos.atualizaValorRestante(this.atributos.filter(atributo => atributo.menorQueInicialmente).length);
    }

    get quantidadeDeAtributosReduzidos(): number { return this.atributos.filter(atributo => atributo.menorQueInicialmente).length }

    get pvFinal(): number {
        return Math.ceil(
            this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(1) }, 0) + 6
        );
    }

    get psFinal(): number {
        return Math.ceil(
            this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(2) }, 0) + 5
        );
    }

    get peFinal(): number {
        return Math.ceil(
            this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(3) }, 0) + 1
        );
    }
}

export class GanhoIndividualNex {
    public valorRestante: number;

    constructor(
        private _idTipoGanhoNex: number,
        private _valor: number
    ) {
        this.valorRestante = this._valor;
    }

    alterarValor(modificador: number) {
        console.log(`alterando valor de ${this.refTipoGanhoNex.nome}: ${modificador}`);
        this.valorRestante -= modificador;
    }

    get refTipoGanhoNex(): TipoGanhoNex { return SingletonHelper.getInstance().tipos_ganho_nex.find(tipo_ganho_nex => tipo_ganho_nex.id === this._idTipoGanhoNex)! }
    get finalizado(): boolean { return this.valorRestante < 1; }
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

class AtributoNexUp {
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

class PericiaNexUp {
    constructor(
        public periciaPatente: PericiaPatentePersonagem,
    ) { }
}

type GanhoEstatisticaPorPontoDeAtributo = { idEstatistica: number, valorPorPonto: number }