// #region Imports
import { GanhoIndividualNexFactory, GanhoIndividualNex } from './factory.ts'
import { RLJ_Ficha2, Atributo, PericiaPatentePersonagem, Pericia, PatentePericia } from 'Types/classes/index.ts';
import { SingletonHelper } from "Types/classes_estaticas.tsx";
// #endregion

export class GanhosNex {
    public dadosFicha: RLJ_Ficha2;
    public ganhos: GanhoIndividualNex[];
    public etapa: number = 0;
    private indexAtual: number = 0;

    constructor(
        dadosFicha: RLJ_Ficha2,
        dadosGanhos: { idTipoGanhoNex: number, opcoes?: any }[]
    ) {
        this.ganhos = SingletonHelper.getInstance().tipos_ganho_nex.map(tipo => {
            const ganhoQueVaiAcontecer = dadosGanhos.find(dado => dado.idTipoGanhoNex === tipo.id);

            return GanhoIndividualNexFactory.criarGanhoIndividual(
                tipo.id, dadosFicha, ganhoQueVaiAcontecer ? ganhoQueVaiAcontecer.opcoes : {}
            );
        });

        this.dadosFicha = dadosFicha;
        this.proximaEtapa();
    }

    get finalizados(): boolean { return false; }
    // this.indexAtual++;
    proximaEtapa() {
        // Itera até encontrar o próximo ganho que esteja sendo alterado
        while (this.indexAtual < this.ganhos.length) {
            if (this.ganhos[this.indexAtual].alterando) {
                this.etapa = this.ganhos[this.indexAtual].id;
                return;
            }
            this.indexAtual++;
        }

        // Se não houver mais etapas a percorrer, finalize o processo
        this.etapa = 0; // ou outro valor que indique o fim das etapas
    }
    finalizar() { console.log('nex finalizado'); }

    clickBotao() {

    }
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

    constructor(numeroGanhos: number, numeroTrocas: number) {
        this.ganhos = new ValorUtilizavel(numeroGanhos);
        this.trocas = new ValorUtilizavel(numeroTrocas);
    }

    get ganhoTemPontos(): boolean { return !this.ganhos.valorZerado; }
    get trocaTemPontos(): boolean { return !this.trocas.valorZerado; }
    get alterando(): boolean { return this.ganhos.valorInicial > 0 || this.trocas.valorInicial > 0; }
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
    get refPatenteInicial(): PatentePericia { return this.refPatente(this._idPatenteInicial) }
    get refPatenteAtual(): PatentePericia { return this.refPatente(this.idPatenteAtual) }

    refPatente(idPatente: number): PatentePericia {
        return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === idPatente)!;
    }

    alterarValor(modificador: number) {
        this.idPatenteAtual += modificador;
    }

    get estaEmValorMinimo(): boolean { return this.idPatenteAtual === 1; }
    get podeAumentar(): boolean { return false; }
}