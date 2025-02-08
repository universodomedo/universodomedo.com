export type NomeCustomizado = {
    nomePadrao: string;
    nomeCustomizado?: string;
    readonly temNomeCustomizado: boolean;
    readonly nomeExibicao: string;
    __key: "criarNomeCustomizado";
};

export type DadosNomeCustomizado = Pick<NomeCustomizado, 'nomePadrao' | 'nomeCustomizado'>;

export const criarNomeCustomizado = (nomeCustomizado: DadosNomeCustomizado): NomeCustomizado => {
    return {
        ...nomeCustomizado,
        get temNomeCustomizado() { return this.nomeCustomizado !== undefined },
        get nomeExibicao() { return this.nomeCustomizado || this.nomePadrao },
        __key: "criarNomeCustomizado", // NomeCustomizado não deve ser criado se não usando esse metodo
    }
};