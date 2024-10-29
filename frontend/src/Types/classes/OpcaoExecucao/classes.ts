// #region Imports
// #endregion

export class OpcoesExecucao {
    constructor(private _key: string, private _displayName: string, private _obterOpcoes: () => Opcao[]) { }
    get opcoes(): Opcao[] { return this._obterOpcoes(); }
    get key(): string { return this._key; }
    get displayName(): string { return this._displayName; }
}

export type Opcao = { key: number, value: string };