// #region Imports
import { GanhoIndividualNexFactory, GanhoIndividualNex, GanhoIndividualNexAtributo } from './factory.ts'
import { RLJ_Ficha2, Atributo, PericiaPatentePersonagem, Pericia, PatentePericia } from 'Types/classes/index.ts';
import { SingletonHelper } from "Types/classes_estaticas.tsx";
// #endregion

export class GanhosNex {
    public ganhos: GanhoIndividualNex[] = [];
    public finalizando: boolean = false;
    public indexEtapa: number = 0;

    constructor(public dadosFicha: RLJ_Ficha2) { }

    adicionarNovoGanho(dadosGanhos: { idTipoGanhoNex: number, opcoes?: any }[]) {
        this.ganhos = SingletonHelper.getInstance().tipos_ganho_nex.map(tipo => {
            const ganhoQueVaiAcontecer = dadosGanhos.find(dado => dado.idTipoGanhoNex === tipo.id);

            return GanhoIndividualNexFactory.criarGanhoIndividual(
                tipo.id, this.dadosFicha, ganhoQueVaiAcontecer ? ganhoQueVaiAcontecer.opcoes : {}
            );
        });

        this.finalizando = false;
        this.indexEtapa = 0;
    }

    get finalizados(): boolean { return false; }

    finalizar() { console.log('nex finalizado'); }

    clickBotao() {

    }

    get pvAtualizado(): number {
        return (
            this.dadosFicha.estatisticasDanificaveis?.find(estatistica_danificavel => estatistica_danificavel.id === 1)!.valor! +
            this.ganhos.find(ganho => ganho instanceof GanhoIndividualNexAtributo)!.pvDeAtributos
        );
    }

    get psAtualizado(): number {
        return (
            this.dadosFicha.estatisticasDanificaveis?.find(estatistica_danificavel => estatistica_danificavel.id === 2)!.valor! +
            this.ganhos.find(ganho => ganho instanceof GanhoIndividualNexAtributo)!.psDeAtributos
        );
    }

    get peAtualizado(): number {
        return (
            this.dadosFicha.estatisticasDanificaveis?.find(estatistica_danificavel => estatistica_danificavel.id === 3)!.valor! +
            this.ganhos.find(ganho => ganho instanceof GanhoIndividualNexAtributo)!.peDeAtributos
        );
    }

    get ganhosQueTemAlteracao(): GanhoIndividualNex[] { return this.ganhos.filter(ganho => ganho.alterando); }
    get etapa(): GanhoIndividualNex { return this.ganhosQueTemAlteracao[this.indexEtapa]; }
    get estaNaUltimaEtapa(): boolean { return this.indexEtapa === this.ganhosQueTemAlteracao.length - 1; }
    get estaNaPrimeiraEtapa(): boolean { return this.indexEtapa === 0; }
    get textoBotaoProximo(): string { return this.estaNaUltimaEtapa ? 'Finalizar' : 'Continuar'; }
    
    retrocedeEtapa() { (this.finalizando) ? this.finalizando = false : this.indexEtapa--; }
    get podeRetrocederEtapa(): boolean { return !this.estaNaPrimeiraEtapa; }

    avancaEtapa() { (this.estaNaUltimaEtapa) ? this.finalizando = true : this.indexEtapa++;  }
    get podeAvancarEtapa(): boolean { return this.etapa.finalizado; }
}

export class TipoGanhoNex {
    constructor(
        public id: number,
        public nome: string
    ) { }
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

type GanhoEstatisticaPorPontoDeAtributo = { idEstatistica: number, valorPorPonto: number }

export class ValorUtilizavel {
    public valorAtual: number;
    constructor(public valorInicial: number) { this.valorAtual = this.valorInicial; }

    get valorZerado(): boolean { return this.valorAtual === 0 }
    get valorAbaixoDeZero(): boolean { return this.valorAtual < 0 }

    aumentaValor() { this.valorAtual++; }
    diminuiValor() { this.valorAtual--; }
}

export class ValoresGanhoETroca {
    public ganhos: ValorUtilizavel;
    public trocas: ValorUtilizavel;

    constructor(numeroGanhos: number = 0, numeroTrocas: number = 0) {
        this.ganhos = new ValorUtilizavel(numeroGanhos);
        this.trocas = new ValorUtilizavel(numeroTrocas);
    }

    realizaGanho() { this.ganhos.diminuiValor(); }
    desrealizaGanho() { this.ganhos.aumentaValor(); }

    realizaTroca() { this.realizaGanho(); this.trocas.aumentaValor(); }
    desrealizaTroca() { this.desrealizaGanho(); this.trocas.diminuiValor(); }

    get ganhoTemPontos(): boolean { return !this.ganhos.valorZerado; }
    get trocaTemPontos(): boolean { return !this.trocas.valorZerado; }
    get alterando(): boolean { return this.ganhos.valorInicial > 0 || this.trocas.valorInicial > 0; }
    get finalizado(): boolean { return this.ganhos.valorZerado; }
}

export class AtributoEmGanho {
    public ganhosEstatisticas: GanhoEstatisticaPorPontoDeAtributo[];
    public valorAtual: number;

    constructor(
        private _refAtributo: Atributo,
        private _valorInicial: number,
        private _valorMaximo: number,
    ) {
        this.valorAtual = this._valorInicial;
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

    get refAtributo(): Atributo { return this._refAtributo; }
    get valorInicial(): number { return this._valorInicial; }
    get valorMaximo(): number { return this._valorMaximo; }

    alterarValor(modificador: number) {
        this.valorAtual += modificador;
    }

    ganhoEstatistica(idEstatistica: number): number { const ganho = this.ganhosEstatisticas.find(ganhoEstatistica => ganhoEstatistica.idEstatistica === idEstatistica); return ganho ? ganho.valorPorPonto * this.valorAtual : 0; }

    get menorQueInicialmente(): boolean { return this.valorAtual < this._valorInicial }
    get estaEmValorMaximo(): boolean { return this.valorAtual >= this._valorMaximo }
    get estaEmValorMinimo(): boolean { return this.valorAtual < 1 }
    get estaMaiorQueInicial(): boolean { return this.valorAtual > this._valorInicial }
}

export class PericiaEmGanho {
    public idPatenteAtual: number;

    constructor(
        private _refPericia: Pericia,
        private _idPatenteInicial: number,
    ) {
        this.idPatenteAtual = this._idPatenteInicial;
    }

    get refPericia(): Pericia { return this._refPericia; }
    get refPatenteInicial(): PatentePericia { return this._refPatente(this._idPatenteInicial); }
    get refPatenteAtual(): PatentePericia { return this._refPatente(this.idPatenteAtual); }
    get estaEmValorMinimo(): boolean { return this.idPatenteAtual === 1; }

    private _refPatente(idPatente: number): PatentePericia { return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === idPatente)!; }
    alterarValor(modificador: number) { this.idPatenteAtual += modificador; }
}