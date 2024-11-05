// #region Imports
import { RLJ_Ficha2 } from '../Ficha/classes.ts';
import { PericiaPatentePersonagem } from '../Pericia/classes.ts';
import { ValoresGanhoETroca, ValorUtilizavel, TipoGanhoNex, AtributoEmGanho, PericiaEmGanho } from './classes.ts';
import { SingletonHelper } from "Types/classes_estaticas.tsx";
// #endregion

export class GanhoIndividualNexFactory {
    public static ficha:RLJ_Ficha2;

    static setFicha(ficha:RLJ_Ficha2) {
        GanhoIndividualNexFactory.ficha = ficha;
    }
}

export abstract class GanhoIndividualNex {
    protected _refFicha: RLJ_Ficha2;

    constructor(
        private _idTipoGanhoNex: number,
        protected _alterando: boolean,
    ) {
        this._refFicha = GanhoIndividualNexFactory.ficha;
    }
    get refTipoGanhoNex(): TipoGanhoNex { return SingletonHelper.getInstance().tipos_ganho_nex.find(tipo_ganho_nex => tipo_ganho_nex.id === this._idTipoGanhoNex)! }

    get id(): number { return this._idTipoGanhoNex; }
    get alterando(): boolean { return this._alterando; }
    abstract get finalizado(): boolean;
    abstract get pvGanhoIndividual(): number;
    abstract get peGanhoIndividual(): number;
    abstract get psGanhoIndividual(): number;
}

export class GanhoIndividualNexAtributo extends GanhoIndividualNex {
    public ganhosAtributo: ValoresGanhoETroca;
    public atributos: AtributoEmGanho[];

    constructor(valoresGanhoETroca: ValoresGanhoETroca = new ValoresGanhoETroca(0), valorMaxAtributo: number = 3) {
        super(1, valoresGanhoETroca.alterando);
        this.ganhosAtributo = valoresGanhoETroca;
        this.atributos = this._refFicha.atributos?.map(atributoBase => new AtributoEmGanho(SingletonHelper.getInstance().atributos.find(atributo => atributo.id === atributoBase.id)!, atributoBase.valor, valorMaxAtributo))!;
    }

    get finalizado(): boolean { return this.ganhosAtributo.finalizado; }
    get quantidadeDeAtributosReduzidos(): number { return this.atributos.filter(atributo => atributo.menorQueInicialmente).length }
    get pvGanhoIndividual(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(1) }, 0)); }
    get peGanhoIndividual(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(2) }, 0)); }
    get psGanhoIndividual(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(3) }, 0)); }

    adicionaPonto(idAtributo: number) {
        const atributo = this.atributos.find(atributo => atributo.refAtributo.id === idAtributo)!;

        (atributo.valorAtual < atributo.valorInicial) ? this.ganhosAtributo.realizaTroca() : this.ganhosAtributo.realizaGanho();

        atributo.alterarValor(1);
    }

    subtraiPonto(idAtributo: number) {
        const atributo = this.atributos.find(atributo => atributo.refAtributo.id === idAtributo)!;

        atributo.alterarValor(-1);

        (atributo.valorAtual < atributo.valorInicial) ? this.ganhosAtributo.desrealizaTroca() : this.ganhosAtributo.desrealizaGanho();
    }
}

export class GanhoIndividualNexPericia extends GanhoIndividualNex {
    public ganhosTreinadas: ValoresGanhoETroca;
    public ganhosVeteranas: ValoresGanhoETroca;
    public ganhosExperts: ValoresGanhoETroca;
    public ganhosLivres: ValoresGanhoETroca;
    public pericias: PericiaEmGanho[];

    constructor(treinadas: ValoresGanhoETroca = new ValoresGanhoETroca(0), veteranas: ValoresGanhoETroca = new ValoresGanhoETroca(0), experts: ValoresGanhoETroca = new ValoresGanhoETroca(0), livres: ValoresGanhoETroca = new ValoresGanhoETroca(0)) {
        super(2, treinadas.alterando || veteranas.alterando || experts.alterando || livres.alterando);
        
        this.ganhosTreinadas = treinadas;
        this.ganhosVeteranas = veteranas;
        this.ganhosExperts = experts;
        this.ganhosLivres = livres;

        this.pericias = this._refFicha.periciasPatentes?.map(pericia_patente => new PericiaEmGanho(
            SingletonHelper.getInstance().pericias.find(pericia => pericia.id === pericia_patente.idPericia)!,
            pericia_patente.idPatente
        ))!;
    }

    get finalizado(): boolean {
        return (
            this.ganhosTreinadas.finalizado &&
            this.ganhosVeteranas.finalizado &&
            this.ganhosExperts.finalizado &&
            this.ganhosLivres.finalizado
        );
    }

    temPontosParaEssaPatente(pericia: PericiaEmGanho):boolean {
        switch (pericia.idPatenteAtual) {
            case 1:
                return this.ganhosTreinadas.ganhoTemPontos!;
            case 2:
                return this.ganhosVeteranas.ganhoTemPontos!;
            case 3:
                return this.ganhosExperts.ganhoTemPontos!;
            default:
                return false;
        }
    }

    deparaPericiaPatente(pericia: PericiaEmGanho): ValoresGanhoETroca | undefined {
        switch (pericia.refPatenteAtual.id) {
            case 2:
                return this.ganhosTreinadas;
            case 3:
                return this.ganhosVeteranas;
            case 4:
                return this.ganhosExperts;
        }
    }

    adicionaPonto(idPericia: number) {
        const pericia = this.pericias.find(pericia => pericia.refPericia.id === idPericia)!;

        pericia.alterarValor(1);

        const valorGanhoeETrocaPatenteAtual = this.deparaPericiaPatente(pericia);

        (pericia.refPatenteAtual.id < pericia.refPatenteInicial.id) ? valorGanhoeETrocaPatenteAtual!.realizaTroca() : valorGanhoeETrocaPatenteAtual!.realizaGanho();
    }

    subtraiPonto(idPericia: number) {
        const pericia = this.pericias.find(pericia => pericia.refPericia.id === idPericia)!;
        const valorGanhoeETrocaPatenteAntesSubtrair = this.deparaPericiaPatente(pericia);
        
        pericia.alterarValor(-1);
                
        valorGanhoeETrocaPatenteAntesSubtrair!.desrealizaGanho();
    }

    get pvGanhoIndividual(): number { return 0; }
    get peGanhoIndividual(): number { return 0; }
    get psGanhoIndividual(): number { return 0; }
}

export class GanhoIndividualNexEstatisticaFixa extends GanhoIndividualNex {
    public ganhoPv: number;
    public ganhoPs: number;
    public ganhoPe: number;

    constructor(pv:number = 0, ps:number = 0, pe:number = 0) {
        super(3, pv > 0 || ps > 0 || pe > 0);
        this.ganhoPv = pv;
        this.ganhoPs = ps;
        this.ganhoPe = pe;
    }

    get finalizado(): boolean { return true; }
    get pvGanhoIndividual(): number { return this.ganhoPv; }
    get peGanhoIndividual(): number { return this.ganhoPs; }
    get psGanhoIndividual(): number { return this.ganhoPe; }
}

export class GanhoIndividualNexEscolhaClasse extends GanhoIndividualNex {
    constructor() {
        super(4, false);
    }

    get finalizado(): boolean { return true; }
    get pvGanhoIndividual(): number { return 0; }
    get peGanhoIndividual(): number { return 0; }
    get psGanhoIndividual(): number { return 0; }
}

export class GanhoIndividualNexRitual extends GanhoIndividualNex {
    constructor() {
        super(5, false);
    }

    get finalizado(): boolean { return true; }
    get pvGanhoIndividual(): number { return 0; }
    get peGanhoIndividual(): number { return 0; }
    get psGanhoIndividual(): number { return 0; }
}