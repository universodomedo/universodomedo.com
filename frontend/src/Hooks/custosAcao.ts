import { Custo, Custos, DadosCustos, Elemento, EstatisticaDanificavelPersonagem, Habilidade, Inventario, Item, NivelComponente, OpcoesSelecionadasExecucaoAcao, PrecoExecucao, Ritual } from "Classes/ClassesTipos/index.ts";
import { SingletonHelper } from "Classes/classes_estaticas";

import { criarCustoAcaoExecucao } from "Hooks/custosExecucao.ts";

export const criarCustos = (dadosCustos: DadosCustos, refPai: Ritual | Item | Habilidade, informacoesContextuais: { podePagarPreco: (precos: PrecoExecucao[]) => boolean, pagaPrecoExecucao: (precos: PrecoExecucao[]) => void, resumoPagamento: (precos: PrecoExecucao[]) => string[], estatisticasDanificaveis: EstatisticaDanificavelPersonagem[], inventario: Inventario }): Custos => {
    const { podePagarPreco, pagaPrecoExecucao, resumoPagamento, estatisticasDanificaveis, inventario } = informacoesContextuais;

    return {
        custoAcaoExecucao: criarCustoAcaoExecucao(dadosCustos.dadosPrecoExecucao, podePagarPreco, pagaPrecoExecucao, resumoPagamento,),

        ...(dadosCustos.dadosPrecoPE && {
            custoAcaoPE: {
                valor: dadosCustos.dadosPrecoPE.valor,

                get podeSerPago(): boolean { return (estatisticasDanificaveis?.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)?.valorAtual ?? 0) > this.valor },
                aplicaCusto: function () { estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)?.alterarValorAtual(this.valor); },
            }
        }),

        ...(dadosCustos.dadosPrecoComponente && {
            custoAcaoComponente: {
                numeroCargasNoUso: dadosCustos.dadosPrecoComponente.numeroCargasNoUso,
                precisaEstarEmpunhado: dadosCustos.dadosPrecoComponente.precisaEstarEmpunhado,

                get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === dadosCustos.dadosPrecoComponente?.idElemento)!; },
                get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === dadosCustos.dadosPrecoComponente?.idNivelComponente)!; },

                get podeSerPago(): boolean { return inventario.itens.some(item => item.itemEhComponente && item.comportamentoComponenteRitualistico?.refElemento.id === this.refElemento.id && item.comportamentoComponenteRitualistico?.refNivelComponente.id === this.refNivelComponente.id && (!this.precisaEstarEmpunhado || item.itemEstaEmpunhado)); },
                aplicaCusto: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) { inventario.itens.find(item => item.codigoUnico === opcoesSelecionadas['custoComponente'])!.comportamentoComponenteRitualistico?.gastaCargaComponente(); },
            }
        }),

        ...(dadosCustos.dadosPrecoUtilizavel && {
            custoAcaoUtilizavel: {
                nomeUtilizavel: dadosCustos.dadosPrecoUtilizavel.nomeUtilizavel,
                custoCargasUtilizavel: dadosCustos.dadosPrecoUtilizavel.custoCargasUtilizavel,

                get podeSerPago(): boolean { return (refPai as Item).itemTemUtilizavelNecessarios(this.nomeUtilizavel, this.custoCargasUtilizavel); },
                aplicaCusto: function () {
                    const dadosUtilizavel = (refPai as Item).comportamentoUtilizavel?.retornaDadosUtilizavelPorNome(this.nomeUtilizavel);

                    if (dadosUtilizavel) {
                        dadosUtilizavel.usosAtuais = (dadosUtilizavel.usosAtuais ?? 0) - 1;
                    }
                },
            }
        }),

        get listaCustos(): Custo[] {
            const listaCustos: Custo[] = [];
            listaCustos.push(this.custoAcaoExecucao);
            if (this.custoAcaoPE !== undefined) listaCustos.push(this.custoAcaoPE);
            if (this.custoAcaoComponente !== undefined) listaCustos.push(this.custoAcaoComponente);
            return listaCustos;
        },

        get custosPodemSerPagos(): boolean { return this.listaCustos.every(custo => custo.podeSerPago); },
        aplicaCustos: function (opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) { this.listaCustos.forEach(custo => custo.aplicaCusto(opcoesSelecionadas)); },
    };
};