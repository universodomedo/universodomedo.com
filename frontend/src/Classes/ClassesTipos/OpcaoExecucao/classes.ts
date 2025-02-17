export type OpcoesExecucaoAcao = {
    identificador: string;
    nomeExibicao: string;
    readonly opcoes: Opcao[];
};

export type OpcoesSelecionadasExecucaoAcao = {
    [key: string]: string | undefined
};

// export class OpcoesExecucao {
//     constructor(private _key: string, private _displayName: string, private _obterOpcoes: () => Opcao[]) { }
//     get opcoes(): Opcao[] { return this._obterOpcoes(); }
//     get key(): string { return this._key; }
//     get displayName(): string { return this._displayName; }
// }

export type Opcao = { key: string, value: string, disabled?: boolean };