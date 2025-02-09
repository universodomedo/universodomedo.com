// #region Imports
import React, { createContext, useContext } from "react";

import { Acao, AtributoPersonagem, criarDificuldadeDinamica, Custo, PericiaPatentePersonagem } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagemHabilidades } from "./PersonagemHabilidades";
import { useClasseContextualPersonagemNatureza } from "./PersonagemNatureza";
import { useClasseContextualPersonagemRituais } from "./PersonagemRituais";
import { useClasseContextualPersonagemAtributos } from "./PersonagemAtributos";
import { useClasseContextualPersonagemPericias } from "./PersonagemPericias";
import { useClasseContextualPersonagemEstatisticasDanificaveis } from "./PersonagemEstatisticasDanificaveis";
import { useClasseContextualPersonagemEstatisticasBuffaveis } from "./PersonagemEstatisticasBuffaveis";

// import { EmbrulhoComportamentoAcao, GastaCustoProps, IAcaoService } from "Classes/ClassesTipos/index.ts";
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
                    aplica: true,
                    podeSerPago: true,
                    aplicaCusto: function() { console.log('aplicando custo de Execução'); execucoes.find(execucao => execucao.refExecucao.id === 2)!.numeroAcoesAtuais--; },
                },
                custoAcaoPE: {
                    valor: 3,
                    get podeSerPago(): boolean { return estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)!.valorAtual > this.valor; },
                    aplicaCusto: function() { console.log('aplicando custo de PE'); estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)?.alterarValorAtual(this.valor) },
                },
                get custos(): Custo[] {
                    const listaCustos: Custo[] = [];

                    listaCustos.push(this.custoAcaoExecucao);
                    if (this.custoAcaoPE !== undefined) listaCustos.push(this.custoAcaoPE);

                    return listaCustos;
                },
                get custosPodemSerPagos(): boolean { return this.custos.every(custo => custo.podeSerPago) },
                aplicaCustos: function() {
                    console.log('aplicando Custos');
                    this.custos.map(custo => custo.aplicaCusto());
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
            // processaDificuldades: () => { console.log('precisa implementar processaDificuldades'); return true; },
            // executaComOpcoes: (valoresSelecionados: GastaCustoProps) => {},
            
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