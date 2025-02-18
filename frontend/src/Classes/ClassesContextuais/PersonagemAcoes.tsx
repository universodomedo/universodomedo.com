// #region Imports
import React, { createContext, ReactNode, useContext, useMemo } from "react";

import { Acao, AcaoEspecifica, AcaoGenerica, Custos, dadosAcaoEhDeAcaoEspecifica, DadosAcaoEspecifica, DadosAcaoGenerica, DificuldadeAcao, Habilidade, Item, OpcoesExecucaoAcao, OpcoesSelecionadasExecucaoAcao, realizaChecagemDificuldade, Ritual } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagemHabilidades } from "Classes/ClassesContextuais/PersonagemHabilidades.tsx";
import { useClasseContextualPersonagemInerencias } from "Classes/ClassesContextuais/PersonagemInerencias.tsx";
import { useClasseContextualPersonagemRituais } from "Classes/ClassesContextuais/PersonagemRituais.tsx";
import { useClasseContextualPersonagemAtributos } from "Classes/ClassesContextuais/PersonagemAtributos.tsx";
import { useClasseContextualPersonagemPericias } from "Classes/ClassesContextuais/PersonagemPericias.tsx";
import { useClasseContextualPersonagemEstatisticasDanificaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasDanificaveis.tsx";
import { useClasseContextualPersonagemEstatisticasBuffaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis.tsx";
import { useCustosExecucoes } from "Classes/ClassesContextuais/GerenciadorCustosExecucoes.tsx";
import { useClasseContextualPersonagemModificadores } from "./PersonagemModificadores";
import { useClasseContextualPersonagemInventario } from "./PersonagemInventario.tsx";

import { criarCustos } from 'Hooks/custosAcao.ts';
import { criarDificuldades } from "Hooks/dificuldadesAcao.ts";
// #endregion

interface ClasseContextualPersonagemAcoesProps {
    acoes: Acao[];
}

export const PersonagemAcoes = createContext<ClasseContextualPersonagemAcoesProps | undefined>(undefined);

export const PersonagemAcoesProvider = ({ children }: { children: React.ReactNode; }) => {
    const { acoesHabilidades } = useClasseContextualPersonagemHabilidades();
    const { habilidadesInerentes } = useClasseContextualPersonagemInerencias();
    const { rituais } = useClasseContextualPersonagemRituais();

    const { atributos } = useClasseContextualPersonagemAtributos();
    const { pericias } = useClasseContextualPersonagemPericias();

    const { estatisticasDanificaveis } = useClasseContextualPersonagemEstatisticasDanificaveis();
    const { execucoes } = useClasseContextualPersonagemEstatisticasBuffaveis();

    const { modificadores } = useClasseContextualPersonagemModificadores();

    const { inventario } = useClasseContextualPersonagemInventario();

    const { podePagarPreco, pagaPrecoExecucao, resumoPagamento } = useCustosExecucoes();

    const criarAcaoGenerica = (dadosAcaoGenerica: DadosAcaoGenerica, refPai: Ritual | Item | Habilidade): AcaoGenerica => {
        return {
            nome: dadosAcaoGenerica.nome,
            svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
            refPai: refPai,
            get bloqueada(): boolean { return !this.custos.custosPodemSerPagos || this.travada; },

            travada: false,
            // travada: acaoExistente?.travada ?? false,
            descricaoTravada: '',
            // descricaoTravada: acaoExistente?.descricaoTravada ?? '',
            trava: function (descricao: string) { this.travada = true; this.descricaoTravada = descricao; },
            destrava: function () { this.travada = false; this.descricaoTravada = ''; },

            ...(dadosAcaoGenerica.dadosDificuldade && {
                get dificuldadeAcao(): DificuldadeAcao {
                    return criarDificuldades(dadosAcaoGenerica.dadosDificuldade!, { atributos, pericias });
                    // return acaoExistente?.dificuldadeAcao ?? criarDificuldades(dadosAcaoGenerica.dadosDificuldade!, { atributos, pericias });
                },
            }),

            get custos(): Custos { 
                return criarCustos(dadosAcaoGenerica.dadosCustos, { 
                    podePagarPreco, pagaPrecoExecucao, resumoPagamento, estatisticasDanificaveis, inventario
                }); 
            },

            get opcoesExecucaoAcao(): OpcoesExecucaoAcao[] {
                const opcoes: OpcoesExecucaoAcao[] = [];

                if (this.custos.custoAcaoComponente !== undefined) {
                    opcoes.push({
                        identificador: 'custoComponente',
                        nomeExibicao: 'Componente Ritualístico',
                        opcoes: inventario.itens.filter(item => item.itemEhComponente && item.comportamentoComponenteRitualistico!.refElemento.id === this.custos.custoAcaoComponente?.refElemento.id && item.comportamentoComponenteRitualistico!.refNivelComponente.id === this.custos.custoAcaoComponente.refNivelComponente.id && (!this.custos.custoAcaoComponente.precisaEstarEmpunhado || item.itemEstaEmpunhado)).map(item => ({
                            key: item.codigoUnico,
                            value: `${item.nomeOpcao}`,
                        })),
                    });
                }
            
                return opcoes;
            },

            logicaExecucao: function () {
                this.modificadores?.filter(modificador => modificador.tipoModificador.tipo === 'Ativo')
                    .map(modificador => modificadores.push(modificador));
            },
            executaAcao: function(opcoesSelecionadas: OpcoesSelecionadasExecucaoAcao) {
                if (this.dificuldadeAcao !== undefined) {
                    const retornoDificuldade = realizaChecagemDificuldade(this.dificuldadeAcao);
                    if (!retornoDificuldade) {
                        this.trava('Dificuldade não superada');
                        return false;
                    }
                }
                
                this.custos.aplicaCustos(opcoesSelecionadas);

                this.logicaExecucao();
            }
        }
    }

    const criarAcaoEspecifica = (dadosAcaoEspecifica: DadosAcaoEspecifica, refPai: Ritual | Item | Habilidade): AcaoEspecifica => {
        return {
            nome: dadosAcaoEspecifica.nome,
            svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
            refPai: refPai,
            // depois teria q verificar se realmente faz sentido ter trava nas AcoesEspecificas. Quando fizer as condições volto pra verificar
            get bloqueada(): boolean { return this.travada; },

            travada: false,
            descricaoTravada: '',
            trava: function (descricao: string) { this.travada = true; this.descricaoTravada = descricao; },
            destrava: function () { this.travada = false; this.descricaoTravada = ''; },

            tipoAcaoEspecifica: 'Sacar Item',
            dadosCarregadosPreviamente: dadosAcaoEspecifica.dadosCarregadosPreviamente,
            dadosCarregadosNoChangeOption: dadosAcaoEspecifica.dadosCarregadosNoChangeOption,
            
            validaExecucao: dadosAcaoEspecifica.validaExecucao,
            executarAcaoEspecifica: dadosAcaoEspecifica.executarAcaoEspecifica,

            get opcoesExecucaoAcao(): OpcoesExecucaoAcao[] {
                const opcoes: OpcoesExecucaoAcao[] = [];

                if (this.nome === 'Sacar Item') {
                    opcoes.push({
                        identificador: 'itemParaSacar',
                        nomeExibicao: 'Item à Sacar',
                        opcoes: inventario.itens.filter(item => item.itemPodeSerEmpunhado).map(item => ({
                            key: item.codigoUnico,
                            value: `${item.nomeOpcao}`,
                        })),
                    });
                }

                if (this.nome === 'Guardar Item') {
                    opcoes.push({
                        identificador: 'itemParaGuardar',
                        nomeExibicao: 'Item à Guardar',
                        opcoes: inventario.itens.filter(item => item.itemPodeSerGuardado).map(item => ({
                            key: item.codigoUnico,
                            value: `${item.nomeOpcao}`,
                        })),
                    });
                }

                return opcoes;
            },
        };
    }

    const acoes: Acao[] = useMemo(() => {
        const todasFontes = [...rituais, ...habilidadesInerentes];

        const novasAcoes = todasFontes.flatMap(paiAcao => paiAcao.dadosAcoes.flatMap(dadosAcao => {
            if (dadosAcaoEhDeAcaoEspecifica(dadosAcao)) {
                return criarAcaoEspecifica(dadosAcao as DadosAcaoEspecifica, paiAcao);
            } else {
                return criarAcaoGenerica(dadosAcao as DadosAcaoGenerica, paiAcao);
            }
        }));

        return novasAcoes;
    }, [rituais, habilidadesInerentes, atributos, pericias, estatisticasDanificaveis, modificadores]);

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