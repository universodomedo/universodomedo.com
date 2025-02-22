import { criarPrecoExecucao, CustoAcaoExecucao, DadoPrecoExecucao, PrecoExecucao } from "Classes/ClassesTipos/index.ts";

export const criarCustoAcaoExecucao = (dadosPrecoExecucao: DadoPrecoExecucao[], podePagarPreco: (precos: PrecoExecucao[]) => boolean, pagaPrecoExecucao: (precos: PrecoExecucao[]) => void, resumoPagamento: (precos: PrecoExecucao[]) => string[]): CustoAcaoExecucao => {
    return {
        listaPrecosOriginal: criarPrecoExecucao(dadosPrecoExecucao),

        get listaPrecosAplicados(): PrecoExecucao[] {
            const agrupados = this.listaPrecosOriginal.reduce((map, preco) => {
                const id = preco.refExecucao.id;
                if (!map.has(id)) map.set(id, { idExecucao: id, quantidadeExecucoes: 0 });
                map.get(id)!.quantidadeExecucoes += preco.quantidadeExecucoes;
                return map;
            }, new Map<number, { idExecucao: number, quantidadeExecucoes: number }>());

            const agrupadosFiltrados = Array.from(agrupados.values()).filter(preco => preco.quantidadeExecucoes > 0);

            if (agrupadosFiltrados.length > 0) {
                return criarPrecoExecucao(agrupadosFiltrados.map(precoAgrupado => ({
                    quantidadeExecucoes: precoAgrupado.quantidadeExecucoes,
                    idExecucao: precoAgrupado.idExecucao,
                })));
            } else {
                return criarPrecoExecucao([{ idExecucao: 1, quantidadeExecucoes: 1 }]); // Ação Livre
            }
        },

        get descricaoListaPreco(): string { return this.listaPrecosAplicados.map(preco => preco.descricaoPreco).join(' e ') },
        get temApenasAcaoLivre(): boolean { return !this.listaPrecosAplicados.some(preco => preco.refExecucao.id !== 1); },
        get podeSerPago(): boolean { return podePagarPreco(this.listaPrecosAplicados); },
        get resumoPagamento(): string { return resumoPagamento(this.listaPrecosAplicados).join(' e '); },
        aplicaCusto: function () { pagaPrecoExecucao(this.listaPrecosAplicados); },
    }
};