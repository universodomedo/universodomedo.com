// #region Imports
import React, { createContext, useContext, useMemo } from "react";

import { DadosItemSemIdentificador, Inventario, Item, Particao } from "Classes/ClassesTipos/index.ts";
import { SingletonHelper } from "Classes/classes_estaticas";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
import { useClasseContextualPersonagemEstatisticasBuffaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis.tsx";
import { useCustosExecucoes } from "Classes/ClassesContextuais/GerenciadorCustosExecucoes.tsx";

import { criarItem } from "Hooks/item.ts";
// #endregion

interface ClasseContextualPersonagemInventarioProps {
    inventario: Inventario
};

export const PersonagemInventario = createContext<ClasseContextualPersonagemInventarioProps | undefined>(undefined);

export const PersonagemInventarioProvider = ({ children }: { children: React.ReactNode }) => {
    const { dadosPersonagem, modificarItemDoInventario, adicionarItemNoInventario } = useClasseContextualPersonagem();
    const { extremidades } = useClasseContextualPersonagemEstatisticasBuffaveis();

    const { podePagarPreco, pagaPrecoExecucao, resumoPagamento } = useCustosExecucoes();

    const inventario: Inventario = {
        particoes: useMemo(() => {
            const particao: Particao = {
                nome: 'Partição Principal',
                itens: dadosPersonagem.inventario.dadosItens.filter(dadosItem => dadosItem.indexParticao === 0).map(dadosItem => criarItem(dadosItem, { dadosPersonagem, getInventario: () => inventario, extremidades, podePagarPreco, pagaPrecoExecucao, resumoPagamento, modificarItemDoInventario })),
                bloqueada: false,
                get cargaFinal(): number { return this.itens.reduce((acc, cur) => acc + cur.peso, 0)},

    
                // particaoLimiteCategoria: {
                //     limitesCategoria: [
                //         {
                //             tipoCategoria: SingletonHelper.getInstance().tipos_categoria.find(tipo_categoria => tipo_categoria.id === 2)!,
                //             quantidadeMaxima: 2,
                //         },
                //         {
                //             tipoCategoria: SingletonHelper.getInstance().tipos_categoria.find(tipo_categoria => tipo_categoria.id === 3)!,
                //             quantidadeMaxima: 1,
                //         },
                //     ],
                // }
            };

            const particao2: Particao = {
                nome: 'Mochila Simples',
                itens: dadosPersonagem.inventario.dadosItens.filter(dadosItem => dadosItem.indexParticao === 1).map(dadosItem => criarItem(dadosItem, { dadosPersonagem, getInventario: () => inventario, extremidades, podePagarPreco, pagaPrecoExecucao, resumoPagamento, modificarItemDoInventario })),
                bloqueada: false,
                tipoParticao: 'Desconsidera Categoria',
                particaoLimiteCarga: {
                    limite: 4,
                },
                get cargaFinal(): number { return this.tipoParticao === 'Desconsidera Carga' ? 0 : this.itens.reduce((acc, cur) => acc + cur.peso, 0)},
            }
    
            return [particao, particao2];
        }, [dadosPersonagem]),
        get itens(): Item[] { return this.particoes.flatMap(particao => particao.itens) },
        get agrupamento(): Item[] {
            return this.itens.reduce((itemAgrupado, itemAtual) => {
                if (!itemAtual.agrupavel || itemAtual.itemEstaEmpunhado || !itemAgrupado.some(item => item.agrupavel && item.nome.nomeExibicao === itemAtual.nome.nomeExibicao && !item.itemEstaEmpunhado)) {
                    itemAgrupado.push(itemAtual);
                }
                return itemAgrupado;
            }, [] as Item[]);
        },
        get espacosUsados(): number { return this.particoes.reduce((acc, cur) => acc + cur.cargaFinal, 0); },
        numeroItensCategoria: function (valorCategoria: number) { return this.itens.filter(item => item.categoria === valorCategoria).length; },
        adicionarItem: (dadosItem: DadosItemSemIdentificador) => { adicionarItemNoInventario(dadosItem); },
        removerItem: (item: Item) => { console.log("precisa implementar removerItem"); },
    };

    return (
        <PersonagemInventario.Provider value={{ inventario }}>
            {children}
        </PersonagemInventario.Provider>
    );
};

export const useClasseContextualPersonagemInventario = (): ClasseContextualPersonagemInventarioProps => {
    const context = useContext(PersonagemInventario);
    if (!context) throw new Error('useClasseContextualPersonagemInventario precisa estar dentro de uma ClasseContextual de PersonagemInventario');
    return context;
};