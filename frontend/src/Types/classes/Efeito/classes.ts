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
    public valorMultiplicadorAdicional: number;
    public valorBonusAdicional: number;
    
    constructor({ valorBaseAdicional = 0, valorMultiplicadorAdicional = 1, valorBonusAdicional = 0 }: { valorBaseAdicional?: number; valorMultiplicadorAdicional?: number; valorBonusAdicional?: number } = {}) {
        this.valorBaseAdicional = valorBaseAdicional;
        this.valorMultiplicadorAdicional = valorMultiplicadorAdicional;
        this.valorBonusAdicional = valorBonusAdicional;
    }
}