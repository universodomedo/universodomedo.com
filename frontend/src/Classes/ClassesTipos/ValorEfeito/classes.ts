import { SingletonHelper } from "Classes/classes_estaticas";
import { LinhaEfeito } from "Classes/ClassesTipos/index.ts";

export type DadosValorEfeito = {
    valorBaseAdicional?: number;
    valorPorcentagemAdicional?: number;
    valorBonusAdicional?: number;
};

export type ValoresEfeito = {
    valorBaseAdicional: number;
    valorPorcentagemAdicional: number;
    valorBonusAdicional: number;
    __key: "criarValoresEfeito";
};

export const criarValoresEfeito = (dadosValorEfeito: DadosValorEfeito): ValoresEfeito => {
    return {
        valorBaseAdicional: dadosValorEfeito.valorBaseAdicional || 0,
        valorPorcentagemAdicional: dadosValorEfeito.valorPorcentagemAdicional || 0,
        valorBonusAdicional: dadosValorEfeito.valorBonusAdicional || 0,
        __key: "criarValoresEfeito", // ValoresEfeito não deve ser criado se não usando esse metodo
    }
};

export class ValoresLinhaEfeito {
    constructor(
        private _idLinhaEfeito: number,
        public valoresEfeitos: ValoresLinhaEfeitoAgrupados,
    ) { }

    // depois tem que habilidade esse retorno de string para o detalhemento de bonus
    // get teste(): string { return `Valor Base Extra: ${this.valoresEfeitos.valorBaseAdicional}; Valor Multiplicador: ${this.valoresEfeitos.valorMultiplicadorAdicional}; Valor Adicional ${this.valoresEfeitos.valorBonusAdicional}`; }
    get valoresEstaVazio(): boolean { return !this.valoresEfeitos.valorBaseAdicionalPresente && !this.valoresEfeitos.valorPorcentagemAdicionalPresente && !this.valoresEfeitos.valorBonusAdicionalPresente; }

    get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
}

export class ValoresLinhaEfeitoAgrupados {
    public listaValorBaseAdicional: RegistroValorEfeito[] = [];
    public listaPorcentagemAdicional: RegistroValorEfeito[] = [];
    public listaValorBonusAdicional: RegistroValorEfeito[] = [];

    constructor({ listaValorBaseAdicional = [], listaPorcentagemAdicional = [], listaValorBonusAdicional = [] }: { listaValorBaseAdicional?: RegistroValorEfeito[]; listaPorcentagemAdicional?: RegistroValorEfeito[]; listaValorBonusAdicional?: RegistroValorEfeito[] } = {}) {
        this.listaValorBaseAdicional = listaValorBaseAdicional;
        this.listaPorcentagemAdicional = listaPorcentagemAdicional;
        this.listaValorBonusAdicional = listaValorBonusAdicional;
    }

    get valorBaseAdicional(): number { return this.listaValorBaseAdicional.reduce((acc, cur) => acc + (cur.tipoValor === 'reduzindo' ? -cur.valor : cur.valor), 0); }
    get valorBaseAdicionalPresente(): boolean { return this.listaValorBaseAdicional.length > 0; }

    get valorPorcentagemAdicional(): number {
        return (this.valorPorcentagemAdicionalPresente
            ? (this.listaPorcentagemAdicional.reduce((acc, cur) => acc * (cur.tipoValor === 'reduzindo' ? 1 - cur.valor / 100 : 1 + cur.valor / 100), 0) - 1) * 100
            : 0
        );
    }
    get valorPorcentagemAdicionalPresente(): boolean { return this.listaPorcentagemAdicional.length > 0; }

    get valorBonusAdicional(): number { return this.listaValorBonusAdicional.reduce((acc, cur) => acc + (cur.tipoValor === 'reduzindo' ? -cur.valor : cur.valor), 0); }
    get valorBonusAdicionalPresente(): boolean { return this.listaValorBonusAdicional.length > 0; }
}

export type RegistroValorEfeito = {
    tipoPai: string;
    nomeRegistro: string;
    tipoValor: 'aumentando' | 'reduzindo';
    valor: number;
}