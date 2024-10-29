// #region Imports
import { SingletonHelper } from "Types/classes_estaticas.tsx";
// #endregion

export class GanhoIndividualNex {
    constructor(
        private _idTipoGanhoNex: number,
        public valor: number
    ) {}

    get refTipoGanhoNex(): TipoGanhoNex { return SingletonHelper.getInstance().tipos_ganho_nex.find(tipo_ganho_nex => tipo_ganho_nex.id === this._idTipoGanhoNex)! }
    get realizado(): boolean { return this.valor !== 0; }
}

export class TipoGanhoNex {
    constructor(
        public id: number,
        public nome: string
    ) {}
}

export class GanhosNex {
    constructor(
        public ganhos: GanhoIndividualNex[],
        public maxAtributo: number,
        public ganhosClasse?: GanhoIndividualNex[],
        public trocas?: GanhoIndividualNex[],
    ) {}

    get realizados(): boolean {
        return (
            this.ganhos
                ? this.ganhos?.every(ganho => ganho.realizado) ?? false
                : true
        );
    }
}

export class GanhosNex0 {
    public numeroAtributosRestantes:number;
    public numeroPericiasTreinadasRestantes:number = 0;

    constructor (
        public numeroAtributos: number,
        public numeroPericiasTreinadas: number,
        public numeroPericiasTreinadasPorInt: number,
        public maximoAtributo: number,
    ) {
        this.numeroAtributosRestantes = numeroAtributos;
    }

    public atualizaPericiasTreinadasRestantes(valorInt: number): void { this.numeroPericiasTreinadasRestantes = this.numeroPericiasTreinadas + (valorInt * this.numeroPericiasTreinadasPorInt); }
    public get realizado(): boolean { return this.numeroAtributos !== 0 && this.numeroPericiasTreinadasRestantes !== 0; }
}

type GanhoClasse = { idClasse:number, ganhoPorAtributo: GanhoPorAtributo };
type GanhoPorAtributo = { idAtributo: number, ganhoDaEstatistica: GanhoDaEstatistica };
type GanhoDaEstatistica = { idEstatisticaDanificavel: number, valorPorPonto: number };