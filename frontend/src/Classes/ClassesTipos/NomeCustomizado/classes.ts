export type NomeCustomizado = {
    nomePadrao: string;
    nomeCustomizado?: string;
};

export type NomeExibicaoCustomizado = NomeCustomizado & {
    readonly temNomeCustomizado: boolean;
    readonly nomeExibicao: string;
}

const criarObjetoComNome = (nomeCustomizado: NomeCustomizado): NomeExibicaoCustomizado => {
    return {
        ...nomeCustomizado,
        get temNomeCustomizado() { return this.nomeCustomizado !== undefined },
        get nomeExibicao() { return this.nomeCustomizado || this.nomePadrao },
    }
};