// #region Imports
import React, { createContext, useContext, useMemo } from "react";

import { Acao, AtributoPersonagem, criarEfeito, Custos, DadosCustos, DadosDificuldadeAcao, DificuldadeAcao, Duracao, EstatisticaDanificavelPersonagem, Modificador, PericiaPatentePersonagem, PrecoExecucao } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagemHabilidades } from "Classes/ClassesContextuais/PersonagemHabilidades.tsx";
import { useClasseContextualPersonagemNatureza } from "Classes/ClassesContextuais/PersonagemNatureza.tsx";
import { useClasseContextualPersonagemRituais } from "Classes/ClassesContextuais/PersonagemRituais.tsx";
import { useClasseContextualPersonagemAtributos } from "Classes/ClassesContextuais/PersonagemAtributos.tsx";
import { useClasseContextualPersonagemPericias } from "Classes/ClassesContextuais/PersonagemPericias.tsx";
import { useClasseContextualPersonagemEstatisticasDanificaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasDanificaveis.tsx";
import { useClasseContextualPersonagemEstatisticasBuffaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis.tsx";
import { useCustosExecucoes } from "Classes/ClassesContextuais/GerenciadorCustosExecucoes.tsx";
import { useClasseContextualPersonagemModificadores } from "./PersonagemModificadores";
import { SingletonHelper } from "Classes/classes_estaticas";

import { criarCustos } from '../../Hooks/custosAcao.ts';
import { criarDificuldades } from "Hooks/dificuldadesAcao.ts";
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

    const { modificadores } = useClasseContextualPersonagemModificadores();

    const { podePagarPreco, pagaPrecoExecucao, resumoPagamento } = useCustosExecucoes();

    const hookCriarDificuldade = (dadosDificuldade: DadosDificuldadeAcao, informacoesContextuais: { atributos: AtributoPersonagem[], pericias: PericiaPatentePersonagem[] }): DificuldadeAcao => {
        return criarDificuldades(dadosDificuldade, informacoesContextuais);
    }

    const hookCriarCustos = (dadosCustos: DadosCustos, informacoesContextuais: { podePagarPreco: (precos: PrecoExecucao[]) => boolean, pagaPrecoExecucao: (precos: PrecoExecucao[]) => void, resumoPagamento: (precos: PrecoExecucao[]) => string[], estatisticasDanificaveis: EstatisticaDanificavelPersonagem[] }): Custos => {
        return criarCustos(dadosCustos, informacoesContextuais);
    }

    const acoesAnterioresRef = React.useRef<Map<string, Acao>>(new Map());

    const acoes: Acao[] = useMemo(() => {
        const novasAcoes = rituais.flatMap(ritual => ritual.dadosAcoes.flatMap(dadosAcao => {
            const acaoExistente = acoesAnterioresRef.current.get(dadosAcao.nome);

            const acao: Acao = {
                nome: dadosAcao.nome,
                svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
                refPai: ritual,
                get bloqueada(): boolean { return !this.custos.custosPodemSerPagos; },

                travada: acaoExistente?.travada ?? false,
                descricaoTravada: acaoExistente?.descricaoTravada ?? '',
                trava: function (descricao: string) { this.travada = true; this.descricaoTravada = descricao; },
                destrava: function () { this.travada = false; this.descricaoTravada = ''; },

                get custos(): Custos { 
                    return criarCustos(dadosAcao.dadosCustos, { 
                        podePagarPreco, pagaPrecoExecucao, resumoPagamento, estatisticasDanificaveis 
                    }); 
                },

                ...(dadosAcao.dadosDificuldade && {
                    get dificuldadeAcao(): DificuldadeAcao {
                        return acaoExistente?.dificuldadeAcao ?? criarDificuldades(dadosAcao.dadosDificuldade!, { atributos, pericias });
                    },
                }),

                executa: function () {
                    this.modificadores?.filter(modificador => modificador.tipoModificador.tipo === 'Ativo')
                        .map(modificador => modificadores.push(modificador));
                },
            };

            if (dadosAcao.dadosModificadores) {
                acao.modificadores = dadosAcao.dadosModificadores.map(dadosModificador => ({
                    nome: dadosModificador.nome,
                    quantidadeDuracaoMaxima: dadosModificador.quantidadeDuracaoMaxima,
                    quantidadeDuracaoAtual: dadosModificador.quantidadeDuracaoAtual,
                    efeitos: dadosModificador.dadosEfeitos.map(dadosEfeito => criarEfeito(dadosEfeito)),
                    refPai: acao,
                    tipoRefPai: 'Ação',
                    svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PHRleHQgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAiIHg9IjU3IiB5PSIxMTQiIGlkPSJzdmdfMSIgZm9udC1zaXplPSIxNTAiIGZvbnQtZmFtaWx5PSJOb3RvIFNhbnMgSlAiIHRleHQtYW5jaG9yPSJzdGFydCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+RTwvdGV4dD48L2c+PC9zdmc+',
                    get refDuracao(): Duracao { 
                        return SingletonHelper.getInstance().duracoes.find(duracao => duracao.id === dadosModificador.idDuracao)! 
                    },
                    codigoUnico: 'asdgasga',
                    textoDuracao: 'afgsaf',
                    tipoModificador: { tipo: 'Ativo' },
                }));
            }

            return acao;
        }));

        // Atualiza o ref sem causar nova renderização
        acoesAnterioresRef.current = new Map(novasAcoes.map(acao => [acao.nome, acao]));

        return novasAcoes;
    }, [rituais, atributos, pericias, estatisticasDanificaveis, podePagarPreco, pagaPrecoExecucao, resumoPagamento, modificadores]);

    // const acoes: Acao[] = rituais.flatMap(ritual => ritual.dadosAcoes.flatMap(dadosAcao => {
    //     const acao: Acao = {
    //         nome: dadosAcao.nome,
    //         svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
    //         refPai: ritual,
    //         get bloqueada(): boolean { return !this.custos.custosPodemSerPagos; },

    //         travada: false,
    //         descricaoTravada: '',
    //         trava: function (descricao: string) { this.travada = true; this.descricaoTravada = descricao; },
    //         destrava: function () { this.travada = false; this.descricaoTravada = ''; },

    //         get custos(): Custos { return hookCriarCustos(dadosAcao.dadosCustos, { podePagarPreco, pagaPrecoExecucao, resumoPagamento, estatisticasDanificaveis }); },

    //         ...(dadosAcao.dadosDificuldade && {
    //             get dificuldadeAcao(): DificuldadeAcao {
    //                 return hookCriarDificuldade(dadosAcao.dadosDificuldade!, { atributos, pericias });
    //             },
    //         }),

    //         executa: function () {
    //             this.modificadores?.filter(modificador => modificador.tipoModificador.tipo === 'Ativo').map(modificador => modificadores.push(modificador));
    //         },
    //     };

    //     if (dadosAcao.dadosModificadores) {
    //         acao.modificadores = dadosAcao.dadosModificadores.map(dadosModificador => {
    //             return {
    //                 nome: dadosModificador.nome,
    //                 quantidadeDuracaoMaxima: dadosModificador.quantidadeDuracaoMaxima,
    //                 quantidadeDuracaoAtual: dadosModificador.quantidadeDuracaoAtual,
    //                 efeitos: dadosModificador.dadosEfeitos.map(dadosEfeito => criarEfeito(dadosEfeito)),
    //                 refPai: acao,
    //                 tipoRefPai: 'Ação',
    //                 svg: `PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PHRleHQgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAiIHg9IjU3IiB5PSIxMTQiIGlkPSJzdmdfMSIgZm9udC1zaXplPSIxNTAiIGZvbnQtZmFtaWx5PSJOb3RvIFNhbnMgSlAiIHRleHQtYW5jaG9yPSJzdGFydCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+RTwvdGV4dD48L2c+PC9zdmc+`,
    //                 get refDuracao(): Duracao { return SingletonHelper.getInstance().duracoes.find(duracao => duracao.id === dadosModificador.idDuracao)! },
    //                 codigoUnico: 'asdgasga',
    //                 textoDuracao: 'afgsaf',
    //                 tipoModificador: { tipo: 'Ativo' },
    //             }
    //         })
    //     }

    //     return acao;
    // }));

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