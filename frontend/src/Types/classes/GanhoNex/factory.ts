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
                return new GanhoIndividualNexAtributo(idTipoGanhoNex, refFicha, opcoes.valoresGanhoETroca ? opcoes.valoresGanhoETroca : {}, opcoes.valorMaxiAtributo ?? 3);
            case 2: {
                const valoresGanhoETroca = {
                    treinadas: new ValoresGanhoETroca(0, 0),
                    veteranas: new ValoresGanhoETroca(0, 0),
                    experts: new ValoresGanhoETroca(0, 0),
                    livres: new ValoresGanhoETroca(0, 0),
                    // treinadas: opcoes.valoresGanhoETroca.treinadas ?? new ValoresGanhoETroca(0, 0),
                    // veteranas: opcoes.valoresGanhoETroca.veteranas ?? new ValoresGanhoETroca(0, 0),
                    // experts: opcoes.valoresGanhoETroca.experts ?? new ValoresGanhoETroca(0, 0),
                    // livres: opcoes.valoresGanhoETroca.livres ?? new ValoresGanhoETroca(0, 0),
                };

                return new GanhoIndividualNexPericia(idTipoGanhoNex, refFicha, valoresGanhoETroca);
            }
            case 3: {
                return new GanhoIndividualNexEstatisticaFixa(idTipoGanhoNex, refFicha, opcoes.valores ?? []);
            }
            default:
                return new GanhoIndividualNexAtributo(idTipoGanhoNex, refFicha, opcoes.valoresGanhoETroca ? opcoes.valoresGanhoETroca : {}, opcoes.valorMaxiAtributo ?? 3);
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
}

export class GanhoIndividualNexAtributo extends GanhoIndividualNex {
    public ganhosAtributo: ValoresGanhoETroca;
    public atributos: AtributoEmGanho[];

    constructor(idTipoGanhoNex: number, refFicha: RLJ_Ficha2, valoresGanhoETroca: ValoresGanhoETroca, valorMaxAtributo: number) {
        super(idTipoGanhoNex, refFicha, valoresGanhoETroca.alterando);
        this.ganhosAtributo = valoresGanhoETroca;
        this.atributos = refFicha.atributos?.map(atributoBase => new AtributoEmGanho(SingletonHelper.getInstance().atributos.find(atributo => atributo.id === atributoBase.id)!, atributoBase.valor, valorMaxAtributo))!;
    }

    get finalizado(): boolean { return this.ganhosAtributo.finalizado; }
    get quantidadeDeAtributosReduzidos(): number { return this.atributos.filter(atributo => atributo.menorQueInicialmente).length }
    get pvDeAtributos(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(1) }, 0)); }
    get psDeAtributos(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(2) }, 0)); }
    get peDeAtributos(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(3) }, 0)); }

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
    public ganhosPericias: {
        treinadas: ValoresGanhoETroca,
        veteranas: ValoresGanhoETroca,
        experts: ValoresGanhoETroca,
        livres: ValoresGanhoETroca,
    };
    public pericias: PericiaEmGanho[];

    constructor(idTipoGanhoNex: number, refFicha: RLJ_Ficha2, valoresGanhoETroca: { treinadas?: ValoresGanhoETroca, veteranas?: ValoresGanhoETroca, experts?: ValoresGanhoETroca, livres?: ValoresGanhoETroca } = {}) {
        super(idTipoGanhoNex, refFicha, Object.values(valoresGanhoETroca).some(item => item?.alterando));
        this.ganhosPericias = {
            treinadas: valoresGanhoETroca.treinadas ?? new ValoresGanhoETroca(0, 0),
            veteranas: valoresGanhoETroca.veteranas ?? new ValoresGanhoETroca(0, 0),
            experts: valoresGanhoETroca.experts ?? new ValoresGanhoETroca(0, 0),
            livres: valoresGanhoETroca.livres ?? new ValoresGanhoETroca(0, 0),
        };
        this.pericias = refFicha.periciasPatentes?.map(pericia_patente => new PericiaEmGanho(
            SingletonHelper.getInstance().pericias.find(pericia => pericia.id === pericia_patente.idPericia)!,
            pericia_patente.idPatente
        ))!;
    }

    get finalizado(): boolean {
        return Object.values(this.ganhosPericias).every(
            (valor) => !valor.alterando || valor.finalizado
        );
    }

    temPontosParaEssaPatente(pericia: PericiaEmGanho):boolean {
        switch (pericia.idPatenteAtual) {
            case 1:
                return this.ganhosPericias.treinadas?.ganhoTemPontos!;
            case 2:
                return this.ganhosPericias.veteranas?.ganhoTemPontos!;
            case 3:
                return this.ganhosPericias.experts?.ganhoTemPontos!;
            default:
                return false;
        }
    }

    deparaPericiaPatente(pericia: PericiaEmGanho): ValoresGanhoETroca | undefined {
        switch (pericia.refPatenteAtual.id) {
            case 2:
                return this.ganhosPericias.treinadas!;
            case 3:
                return this.ganhosPericias.veteranas!;
            case 4:
                return this.ganhosPericias.experts!;
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
}

export class GanhoIndividualNexEstatisticaFixa extends GanhoIndividualNex {
    public valores: number[];

    constructor(idTipoGanhoNex: number, refFicha: RLJ_Ficha2, valores: number[]) {
        super(idTipoGanhoNex, refFicha, valores.length > 0);
        this.valores = valores;
    }

    get finalizado(): boolean { return true; }
}

export class GanhoIndividualNexEscolhaClasse extends GanhoIndividualNex {
    constructor(idTipoGanhoNex: number, refFicha: RLJ_Ficha2) {
        super(idTipoGanhoNex, refFicha, false);
    }
    get finalizado(): boolean { return true; }
}

export class GanhoIndividualNexRitual extends GanhoIndividualNex {
    constructor(idTipoGanhoNex: number, refFicha: RLJ_Ficha2,) {
        super(idTipoGanhoNex, refFicha, false);
    }
    get finalizado(): boolean { return true; }
}