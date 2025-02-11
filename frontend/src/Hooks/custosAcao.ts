import { criarPrecoExecucao, Custo, Custos, DadosCustos, EstatisticaDanificavelPersonagem, PrecoExecucao } from "Classes/ClassesTipos/index.ts";

export const criarCustos = (dadosCustos: DadosCustos, informacoesContextuais: { podePagarPreco: (precos: PrecoExecucao[]) => boolean, pagaPrecoExecucao: (precos: PrecoExecucao[]) => void, resumoPagamento: (precos: PrecoExecucao[]) => string[], estatisticasDanificaveis: EstatisticaDanificavelPersonagem[] }): Custos => {
    const { podePagarPreco, pagaPrecoExecucao, resumoPagamento, estatisticasDanificaveis } = informacoesContextuais;

    return {
        custoAcaoExecucao: {
            listaPrecosOriginal: criarPrecoExecucao(dadosCustos.dadosPrecoExecucao),

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
            // get podeSerPago(): boolean { return true; },
            get podeSerPago(): boolean { return podePagarPreco(this.listaPrecosAplicados); },
            get resumoPagamento(): string { return resumoPagamento(this.listaPrecosAplicados).join(' e '); },
            aplicaCusto: function () { pagaPrecoExecucao(this.listaPrecosAplicados); },
        },
        ...(dadosCustos.dadosPrecoPE && {
            custoAcaoPE: {
                valor: dadosCustos.dadosPrecoPE.valor,
                // get podeSerPago(): boolean { return true },
                get podeSerPago(): boolean { return (estatisticasDanificaveis?.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)?.valorAtual ?? 0) > this.valor },
                aplicaCusto: function () { estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)?.alterarValorAtual(this.valor); },
            }
        }),
        get listaCustos(): Custo[] {
            const listaCustos: Custo[] = [];
            listaCustos.push(this.custoAcaoExecucao);
            if (this.custoAcaoPE !== undefined) listaCustos.push(this.custoAcaoPE);
            return listaCustos;
        },

        get custosPodemSerPagos(): boolean { return this.listaCustos.every(custo => custo.podeSerPago); },
        aplicaCustos: function () { this.listaCustos.forEach(custo => custo.aplicaCusto()); },
    };
};