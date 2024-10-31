// #region Imports
import { PericiaPatentePersonagem } from '../Pericia/classes.ts';
import { ValoresGanhoETroca, ValorUtilizavel, TipoGanhoNex, AtributoNexUp, PericiaNexUp } from './classes.ts';
import { SingletonHelper } from "Types/classes_estaticas.tsx";
// #endregion

export class GanhoIndividualNexFactory {
    static criarGanhoIndividual(idTipoGanhoNex: number, opcoes: any = {}): GanhoIndividualNex {
        switch (idTipoGanhoNex) {
            case 1:
                return new GanhoIndividualNexAtributo(idTipoGanhoNex, opcoes.valorGanho ?? 1, opcoes.valorTroca ?? 0, opcoes.valorMaxiAtributo ?? 3);
            case 2:
                return new GanhoIndividualNexPericia(idTipoGanhoNex, opcoes.valorGanho ?? 1, opcoes.valorTroca ?? 0);
            default:
                return new GanhoIndividualNexAtributo(idTipoGanhoNex, opcoes.valorGanho ?? 1, opcoes.valorTroca ?? 0, opcoes.valorMaxiAtributo ?? 3);
        }
    }
}

export abstract class GanhoIndividualNex {
    constructor(private _idTipoGanhoNex: number) { }
    get refTipoGanhoNex(): TipoGanhoNex { return SingletonHelper.getInstance().tipos_ganho_nex.find(tipo_ganho_nex => tipo_ganho_nex.id === this._idTipoGanhoNex)! }

    get id(): number { return this._idTipoGanhoNex; }
    abstract get finalizado(): boolean;
}

export class GanhoIndividualNexAtributo extends GanhoIndividualNex {
    public ganhosAtributo: ValoresGanhoETroca;
    public atributos: AtributoNexUp[];

    constructor(idTipoGanhoNex: number, valorDeGanho: number, valorDeTroca: number, valorMaxAtributo: number) {
        super(idTipoGanhoNex);
        this.ganhosAtributo = new ValoresGanhoETroca(new ValorUtilizavel(valorDeGanho), new ValorUtilizavel(valorDeTroca));
        this.atributos = SingletonHelper.getInstance().atributos.map(atributo => { return new AtributoNexUp(atributo, 1, valorMaxAtributo) });
    }

    get finalizado(): boolean { return this.ganhosAtributo.ganhos.valorZerado; }
    get quantidadeDeAtributosReduzidos(): number { return this.atributos.filter(atributo => atributo.menorQueInicialmente).length }
    get pvFinal(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(1) }, 0) + 6); }
    get psFinal(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(2) }, 0) + 5); }
    get peFinal(): number { return Math.ceil(this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(3) }, 0) + 1); }

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

class GanhoIndividualNexPericia extends GanhoIndividualNex {
    public ganhosPericiaTreinada: ValoresGanhoETroca;
    public pericias: PericiaNexUp[];

    constructor(idTipoGanhoNex: number, valorDeGanho: number, valorDeTroca: number) {
        super(idTipoGanhoNex);
        this.ganhosPericiaTreinada = new ValoresGanhoETroca(new ValorUtilizavel(valorDeGanho), new ValorUtilizavel(valorDeTroca));
        this.pericias = SingletonHelper.getInstance().pericias.map(pericia => new PericiaNexUp(new PericiaPatentePersonagem(pericia.id, 1)));
    }

    get finalizado(): boolean {
        throw new Error('Method not implemented.');
    }

}