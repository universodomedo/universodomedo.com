// #region Imports
import { Atributo } from 'Types/classes/index.ts';
import { SingletonHelper } from "Types/classes_estaticas.tsx";
// #endregion

export class GanhosNex {
    public estadoGanhosNex: EstadoGanhosNex;

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
}

export class TipoGanhoNex {
    constructor(
        public id: number,
        public nome: string
    ) { }
}

export class EstadoGanhosNex {
    public atributos: AtributoNexUp[];

    constructor(
        public ganhosAtributos: GanhoIndividualNex,
        public trocasAtributos: TrocaIndividualNex,
        public valorMaxAtributo: number,
        public valorMinAtributo: number = 0
    ) {
        this.atributos = SingletonHelper.getInstance().atributos.map(atributo => { return new AtributoNexUp(atributo, 1, valorMaxAtributo) });
    }

    gastaPonto(idAtributo: number, modificador: number) {
        const atributo =  this.atributos.find(atributo => atributo.refAtributo.id === idAtributo)!;
        atributo.alterarValor(modificador);
        this.ganhosAtributos.alterarValor(modificador);
        this.trocasAtributos.atualizaValorRestante(this.atributos.filter(atributo => atributo.menorQueInicialmente).length);
    }

    get quantidadeDeAtributosReduzidos(): number { return this.atributos.filter(atributo => atributo.menorQueInicialmente).length }
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

    atualizaValorRestante(quantidadeTrocasRealizadas:number = 0) {
        this.valorRestante = this._valor - quantidadeTrocasRealizadas;
    }

    get refTipoGanhoNex(): TipoGanhoNex { return SingletonHelper.getInstance().tipos_ganho_nex.find(tipo_ganho_nex => tipo_ganho_nex.id === this._idTipoGanhoNex)! }
    get finalizado(): boolean { return this.valorRestante < 1 }
}

class AtributoNexUp {
    public valorAtual: number;

    constructor(
        public refAtributo: Atributo,
        public valorInicial: number,
        public valorMaximo: number
    ) {
        this.valorAtual = valorInicial;
    }

    alterarValor(modificador: number) {
        this.valorAtual += modificador;
    }

    get menorQueInicialmente(): boolean { return this.valorAtual < this.valorInicial }
    get estaEmValorMaximo(): boolean { return this.valorAtual >= this.valorMaximo }
    get estaMaiorQueInicial(): boolean { return this.valorAtual > this.valorInicial }
}