// #region Imports
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class Efeito {
    constructor(
        private _idLinhaEfeito: number,
        private _idTipoEfeito: number,
        public valor: number,
        public valorMultiplicador: number = 1,
    ) { }

    get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
    get refTipoEfeito(): TipoEfeito { return SingletonHelper.getInstance().tipos_efeito.find(tipo_efeito => tipo_efeito.id === this._idTipoEfeito)!; }
}

export class LinhaEfeito {
    constructor(
        public id: number,
        public nome: string,
    ) { }

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