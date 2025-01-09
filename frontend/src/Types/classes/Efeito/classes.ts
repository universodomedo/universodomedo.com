// #region Imports
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class Efeito {
    private _idLinhaEfeito: number;
    private _idTipoEfeito: number;
    public valoresEfeitos: ValoresEfeito;

    constructor({ idLinhaEfeito, idTipoEfeito, dadosValoresEfeitos }: { idLinhaEfeito: number; idTipoEfeito: number; dadosValoresEfeitos: ConstructorParameters<typeof ValoresEfeito>[0] }) {
        this._idLinhaEfeito = idLinhaEfeito;
        this._idTipoEfeito = idTipoEfeito;
        this.valoresEfeitos = new ValoresEfeito(dadosValoresEfeitos);
    }

    get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
    get refTipoEfeito(): TipoEfeito { return SingletonHelper.getInstance().tipos_efeito.find(tipo_efeito => tipo_efeito.id === this._idTipoEfeito)!; }
}

export class LinhaEfeito {
    constructor(
        public id: number,
        public nome: string,
    ) { }

    public svg = `PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PHRleHQgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAiIHg9IjU3IiB5PSIxMTQiIGlkPSJzdmdfMSIgZm9udC1zaXplPSIxNTAiIGZvbnQtZmFtaWx5PSJOb3RvIFNhbnMgSlAiIHRleHQtYW5jaG9yPSJzdGFydCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+RTwvdGV4dD48L2c+PC9zdmc+`;

    // acho q eeh de boa remover
    static obtemEfeitoRefPorId(idLinhaEfeito: number): string {
        return SingletonHelper.getInstance().linhas_efeito.find(linhas_efeito => linhas_efeito.id === idLinhaEfeito)!.nome;
    }
}

export class TipoEfeito {
    constructor(
        public id: number,
        public nome: string,
        public nomeExibirTooltip: string,
    ) { }
}

export class ValoresEfeito {
    public valorBaseAdicional: number;
    public valorPorcentagemAdicional: number;
    public valorBonusAdicional: number;
    
    constructor({ valorBaseAdicional = 0, valorPorcentagemAdicional = 0, valorBonusAdicional = 0 }: { valorBaseAdicional?: number; valorPorcentagemAdicional?: number; valorBonusAdicional?: number } = {}) {
        this.valorBaseAdicional = valorBaseAdicional;
        this.valorPorcentagemAdicional = valorPorcentagemAdicional;
        this.valorBonusAdicional = valorBonusAdicional;
    }
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

    get valorPorcentagemAdicional(): number { return (this.valorPorcentagemAdicionalPresente
        ? (this.listaPorcentagemAdicional.reduce((acc, cur) => acc * (cur.tipoValor === 'reduzindo' ? 1 - cur.valor / 100 : 1 + cur.valor / 100), 0) - 1) * 100
        : 0
    ); }
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