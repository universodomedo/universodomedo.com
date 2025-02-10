// #region Imports
import React, { createContext, useContext } from "react";

import { Acao, AtributoPersonagem, criarDificuldadeDinamica, criarPrecoExecucao, Custo, PericiaPatentePersonagem, pluralize, PrecoExecucao } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagemHabilidades } from "Classes/ClassesContextuais/PersonagemHabilidades.tsx";
import { useClasseContextualPersonagemNatureza } from "Classes/ClassesContextuais/PersonagemNatureza.tsx";
import { useClasseContextualPersonagemRituais } from "Classes/ClassesContextuais/PersonagemRituais.tsx";
import { useClasseContextualPersonagemAtributos } from "Classes/ClassesContextuais/PersonagemAtributos.tsx";
import { useClasseContextualPersonagemPericias } from "Classes/ClassesContextuais/PersonagemPericias.tsx";
import { useClasseContextualPersonagemEstatisticasDanificaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasDanificaveis.tsx";
import { useClasseContextualPersonagemEstatisticasBuffaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis.tsx";
import { useCustosExecucoes } from "Classes/ClassesContextuais/GerenciadorCustosExecucoes.tsx";
// #endregion

interface ClasseContextualPersonagemAcoesProps {
    acoes: Acao[];
}

export const PersonagemAcoes = createContext<ClasseContextualPersonagemAcoesProps | undefined>(undefined);

export const PersonagemAcoesProvider = ({ children }: { children: React.ReactNode; }) => {
    const { acoesHabilidades } = useClasseContextualPersonagemHabilidades();
    const { acoesNatureza } = useClasseContextualPersonagemNatureza();
    const { rituais } = useClasseContextualPersonagemRituais();

    const { atributos } = useClasseContextualPersonagemAtributos();
    const { pericias } = useClasseContextualPersonagemPericias();

    const { estatisticasDanificaveis } = useClasseContextualPersonagemEstatisticasDanificaveis();
    const { execucoes } = useClasseContextualPersonagemEstatisticasBuffaveis();

    const { podePagarPreco, pagaPrecoExecucao, resumoPagamento } = useCustosExecucoes();

    const acoes: Acao[] = rituais.flatMap(ritual => ritual.dadosAcoes.flatMap(dadosAcao => {
        const acaoServico: Acao = {
            ...dadosAcao,
            nome: dadosAcao.nome,
            svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
            refPai: ritual,
            get bloqueada(): boolean { return !this.custos.custosPodemSerPagos || this.travada; },

            travada: false,
            descricaoTravada: '',
            trava: function(descricao: string) { this.travada = true; this.descricaoTravada = descricao; },
            destrava: function() { this.travada = false; this.descricaoTravada = ''; },

            custos: {
                custoAcaoExecucao: {
                    listaPrecosOriginal: criarPrecoExecucao( [ { idExecucao: 3, quantidadeExecucoes: 1 } ] ),

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
                            return criarPrecoExecucao( [ { idExecucao: 1, quantidadeExecucoes: 0 } ] ); // Ação Livre
                        }
                    },

                    get descricaoListaPreco(): string { return this.listaPrecosAplicados.map(preco => preco.descricaoPreco).join(' e ')},
                    get temApenasAcaoLivre(): boolean { return !this.listaPrecosAplicados.some(preco => preco.refExecucao.id !== 1); },
                    get podeSerPago(): boolean { return podePagarPreco(this.listaPrecosAplicados); },
                    get resumoPagamento(): string { return resumoPagamento(this.listaPrecosAplicados).join(' e '); },

                    aplicaCusto: function() { console.log('aplicando custo de Execução'); console.log(`pagando ${this.resumoPagamento}`); pagaPrecoExecucao(this.listaPrecosAplicados); },
                },
                custoAcaoPE: {
                    valor: 3,
                    get podeSerPago(): boolean { return estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)!.valorAtual > this.valor; },
                    aplicaCusto: function() { console.log('aplicando custo de PE'); console.log(`pagando ${this.valor} P.E.`); estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)?.alterarValorAtual(this.valor) },
                },
                get listaCustos(): Custo[] {
                    const listaCustos: Custo[] = [];

                    listaCustos.push(this.custoAcaoExecucao);
                    if (this.custoAcaoPE !== undefined) listaCustos.push(this.custoAcaoPE);

                    return listaCustos;
                },
                get custosPodemSerPagos(): boolean { return this.listaCustos.every(custo => custo.podeSerPago) },
                aplicaCustos: function() {
                    console.log('aplicando Custos');
                    this.listaCustos.map(custo => custo.aplicaCusto());
                },
            },

            dadosAcaoCustomizada: undefined,

            dificuldadeAcao: {
                get refAtributoPersonagem(): AtributoPersonagem { return atributos.find(atributo => atributo.refAtributo.id === 1)!; },
                get refPericiaPatentePersonagem(): PericiaPatentePersonagem { return pericias.find(pericia => pericia.refPericia.id === 1)!; },
                checagemDificuldade: {
                    get valorChecagemDificuldade(): number { return (this.dificuldadeDinamica === undefined ? this.valorDificuldade : this.valorDificuldade + this.dificuldadeDinamica.valorDificuldadeAditivaAtual) },
                    valorDificuldade: 10,
                    dificuldadeDinamica: criarDificuldadeDinamica({
                        modificadorDificuldadeInicial: 0,
                        listaModificadoresDificuldade: [2],
                    }),
                },
            },
            
            executa: () => { console.log('precisa implementar executa'); },
        };

        return acaoServico;
    }));

    return (
        <PersonagemAcoes.Provider value={{ acoes }}>
            {children}
        </PersonagemAcoes.Provider>
    );
}

export const useClasseContextualPersonagemAcoes = (): ClasseContextualPersonagemAcoesProps => {
    const context = useContext(PersonagemAcoes);
    if (!context) throw new Error('useClasseContextualPersonagemAcoes precisa estar dentro de uma ClasseContextual de PersonagemAcoes');
    return context;
};