// #region Imports
import { RLJ_Ficha2 } from '../Ficha/classes.ts';
import { PericiaPatentePersonagem } from '../Pericia/classes.ts';
import { ValoresGanhoETroca, ValorUtilizavel, TipoGanhoNex, AtributoEmGanho, PericiaEmGanho } from './classes.ts';
import { SingletonHelper } from "Types/classes_estaticas.tsx";
// #endregion

export class GanhoIndividualNexFactory {
    static criarGanhoIndividual(idTipoGanhoNex: number, refFicha: RLJ_Ficha2, opcoes: any = {}): GanhoIndividualNex {
        switch (idTipoGanhoNex) {
            case 1:
                return new GanhoIndividualNexAtributo(idTipoGanhoNex, refFicha, opcoes.valoresGanhoETroca ? opcoes.valoresGanhoETroca[0] : [], opcoes.valorMaxiAtributo ?? 3);
            case 2:
                return new GanhoIndividualNexPericia(idTipoGanhoNex, refFicha, opcoes.valoresGanhoETroca ?? []);
            default:
                return new GanhoIndividualNexAtributo(idTipoGanhoNex, refFicha, opcoes.valoresGanhoETroca ? opcoes.valoresGanhoETroca[0] : [], opcoes.valorMaxiAtributo ?? 3);
        }
    }
}

export abstract class GanhoIndividualNex {
    constructor(
        private _idTipoGanhoNex: number,
        protected _refFicha: RLJ_Ficha2,
        protected _alterando: boolean,
    ) { }
    get refTipoGanhoNex(): TipoGanhoNex { return SingletonHelper.getInstance().tipos_ganho_nex.find(tipo_ganho_nex => tipo_ganho_nex.id === this._idTipoGanhoNex)! }

    get id(): number { return this._idTipoGanhoNex; }
    get alterando(): boolean { return this._alterando; }
    abstract get finalizado(): boolean;

    abstract adicionaPonto(id: number): void;
    abstract subtraiPonto(id: number): void;
}

export class GanhoIndividualNexAtributo extends GanhoIndividualNex {
    public ganhosAtributo: ValoresGanhoETroca;
    public atributos: AtributoEmGanho[];

    constructor(idTipoGanhoNex: number, refFicha: RLJ_Ficha2, valoresGanhoETroca: ValoresGanhoETroca, valorMaxAtributo: number) {
        super(idTipoGanhoNex, refFicha, valoresGanhoETroca.alterando);
        this.ganhosAtributo = valoresGanhoETroca;
        this.atributos = refFicha.atributos?.map(atributoBase => new AtributoEmGanho(SingletonHelper.getInstance().atributos.find(atributo => atributo.id === atributoBase.id)!, atributoBase.valor, valorMaxAtributo))!;
    }

    get finalizado(): boolean { return this.ganhosAtributo.ganhos.valorZerado; }
    get quantidadeDeAtributosReduzidos(): number { return this.atributos.filter(atributo => atributo.menorQueInicialmente).length }
    get pvFinal(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(1) }, 0)); }
    get psFinal(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(2) }, 0)); }
    get peFinal(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(3) }, 0)); }

    adicionaPonto(idAtributo: number) {
        const atributo = this.atributos.find(atributo => atributo.refAtributo.id === idAtributo)!;

        if (atributo.valorAtual < atributo.valorInicial) {
            // foi um aumento de uma troca já feita
            this.ganhosAtributo.trocas.aumentaValor();
            this.ganhosAtributo.ganhos.diminuiValor();
        } else {
            // aumento normal
            this.ganhosAtributo.ganhos.diminuiValor();
        }

        atributo.alterarValor(1);
    }

    subtraiPonto(idAtributo: number) {
        const atributo = this.atributos.find(atributo => atributo.refAtributo.id === idAtributo)!;

        atributo.alterarValor(-1);

        if (atributo.valorAtual < atributo.valorInicial) {
            // foi uma troca
            this.ganhosAtributo.trocas.diminuiValor();
            this.ganhosAtributo.ganhos.aumentaValor();
        } else {
            // foi uma redução de um valor já colocado
            this.ganhosAtributo.ganhos.aumentaValor();
        }
    }
}

export class GanhoIndividualNexPericia extends GanhoIndividualNex {
    public ganhosPericias: {
        treinadas?: ValoresGanhoETroca,
        veteranas?: ValoresGanhoETroca,
        experts?: ValoresGanhoETroca,
        livres?: ValoresGanhoETroca,
    };
    public pericias: PericiaEmGanho[];

    constructor(idTipoGanhoNex: number, refFicha: RLJ_Ficha2, valoresGanhoETroca: ValoresGanhoETroca[]) {
        super(idTipoGanhoNex, refFicha, valoresGanhoETroca.reduce((acc, item) => acc || item.alterando, false));
        this.ganhosPericias = { treinadas: valoresGanhoETroca[0] };
        this.pericias = refFicha.periciasPatentes?.map(pericia_patente => new PericiaEmGanho(
            SingletonHelper.getInstance().pericias.find(pericia => pericia.id === pericia_patente.idPericia)!,
            pericia_patente.idPatente
        ))!;
    }

    get finalizado(): boolean {
        throw new Error('Method not implemented.');
    }

    adicionaPonto(idPericia: number) {
        const pericia = this.pericias.find(pericia => pericia.refPericia.id === idPericia)!;

        pericia.alterarValor(1);
    }

    subtraiPonto(idPericia: number) {
        const pericia = this.pericias.find(pericia => pericia.refPericia.id === idPericia)!;

        pericia.alterarValor(-1);
    }
}