// #region Imports
import React, { createContext, useContext, useMemo } from "react";

import { criarEfeito, criarNomeCustomizado, CustoAcaoExecucao, DadosItemSemIdentificador, Duracao, Elemento, Extremidade, Inventario, Item, NivelComponente, pluralize, TipoItem } from "Classes/ClassesTipos/index.ts";
import { SingletonHelper } from "Classes/classes_estaticas";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
import { useClasseContextualPersonagemEstatisticasBuffaveis } from "Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis.tsx";
import { useCustosExecucoes } from "Classes/ClassesContextuais/GerenciadorCustosExecucoes.tsx";
import { useClasseContextualPersonagemModificadores } from "Classes/ClassesContextuais/PersonagemModificadores.tsx";

import { criarCustoAcaoExecucao } from "Hooks/custosExecucao";
// #endregion

interface ClasseContextualPersonagemInventarioProps {
    inventario: Inventario
};

export const PersonagemInventario = createContext<ClasseContextualPersonagemInventarioProps | undefined>(undefined);

export const PersonagemInventarioProvider = ({ children }: { children: React.ReactNode }) => {
    const { dadosPersonagem, modificarItemDoInventario, adicionarItemNoInventario } = useClasseContextualPersonagem();
    const { extremidades, execucoes } = useClasseContextualPersonagemEstatisticasBuffaveis();

    const { podePagarPreco, pagaPrecoExecucao, resumoPagamento } = useCustosExecucoes();

    const itens: Item[] = useMemo(() => {
        return dadosPersonagem.inventario.dadosItens.map(dadosItem => {
            const nome = criarNomeCustomizado(dadosItem.dadosNomeCustomizado);
            let codigoUnico = nome.nomeCustomizado !== undefined ? nome.nomeExibicao : dadosItem.identificadorNomePadrao;

            const item: Item = {
                codigoUnico: codigoUnico,
                nome: nome,
                peso: dadosItem.peso,
                categoria: dadosItem.categoria,
                svg: `PHN2ZyB3aWR0aD0iMjU2cHgiIGhlaWdodD0iMjU2cHgiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNDQ0LjE4IDQ0NC4xOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICA8cGF0aCBkPSJtNDA0LjIgMjA1Ljc0Yy0wLjkxNy0wLjY1Ni0yLjA5Ni0wLjgzLTMuMTY1LTAuNDY3IDAgMC0xMTkuMDEgNDAuNDc3LTEyMi4yNiA0MS41OTgtMi43MjUgMC45MzgtNC40ODctMS40Mi00LjQ4Ny0xLjQybC0zNy40NDgtNDYuMjU0Yy0wLjkzNS0xLjE1NC0yLjQ5Mi0xLjU5Mi0zLjg5LTEuMDk4LTEuMzk2IDAuNDk0LTIuMzMyIDEuODE2LTIuMzMyIDMuMjk5djE2Ny44OWMwIDEuMTY4IDAuNTgzIDIuMjYgMS41NTYgMi45MSAwLjU4NCAwLjM5MSAxLjI2MyAwLjU5IDEuOTQ1IDAuNTkgMC40NTEgMCAwLjkwNi0wLjA4OCAxLjMzNi0wLjI2N2wxNjguMDQtNjkuNDM4YzEuMzEtMC41NDEgMi4xNjMtMS44MTggMi4xNjMtMy4yMzR2LTkxLjI2NmMwLTEuMTI2LTAuNTQ0LTIuMTg1LTEuNDYyLTIuODQ0eiIvPiA8cGF0aCBkPSJtNDQzLjQ5IDE2OC4yMi0zMi4wNy00Mi44NTljLTAuNDYtMC42MTUtMS4xMTEtMS4wNjEtMS44NTItMS4yNzBsLTE4Ni40Mi01Mi42MzZjLTAuNjIyLTAuMTc2LTEuNDY1LTAuMTI1LTIuMDk2IDAuMDQ5bC0xODYuNDIgNTIuNjM2Yy0wLjczOSAwLjIwOS0xLjM5MSAwLjY1NC0xLjg1MSAxLjI3bC0zMi4wNzEgNDIuODYwYy0wLjY3MiAwLjg5OC0wLjg3MiAyLjA2My0wLjU0MSAzLjEzMyAwLjMzMiAxLjA3MSAxLjE1NyAxLjkxOCAyLjIxOSAyLjI3OWwxNTcuNjQgNTMuNTAyYzAuMzcgMC4xMjUgMC43NDkgMC4xODcgMS4xMjUgMC4xODcgMS4wMzUgMCAyLjA0MS0wLjQ2MiAyLjcxOC0xLjI5Nmw0NC4xMjgtNTQuMzkxIDEzLjA4MiAzLjZjMC42MDcgMC4xNjggMS4yNDkgMC4xNjggMS44NTcgMCAwIDAgMC4wNjQtMC4wMTYgMC4xOTItMC4wNDFsMTMuMDgyLTMuNiA0NC4xMjkgNTQuMzkxYzAuNjc3IDAuODM0IDEuNjgzIDEuMjk1IDIuNzE4IDEuMjk1IDAuMzc2IDAgMC43NTYtMC4wNjEgMS4xMjUtMC4xODZsMTU3LjY0LTUzLjUwMmMxLjA2Mi0wLjM2MSAxLjg4Ny0xLjIwOSAyLjIxOS0yLjI3OSAwLjMzLTEuMDcyIDAuMTMtMi4yMzYtMC41NDItMy4xMzQtMC41NDItMC42NTgtMS40NjItMS4yMTgtMi44NDQtMS40NDF6bS0yMjEuMy03Ljg0LTEzMy42OS0zNi41MjUgMTMzLjY5LTM3LjUyNyAxMzMuNDkgMzcuNDc5LTEzMy40OSAzNi41NzN6Ii8+IDxwYXRoIGQ9Im0yMTEuMjQgMTk4LjE1Yy0xLjM5Ni0wLjQ5NC0yLjk1NS0wLjA1Ny0zLjg4OSAxLjA5OGwtMzcuNDQ4IDQ2LjI1NXMtMS43NjQgMi4zNTYtNC40ODggMS40MmMtMy4yNTItMS4xMjEtMTIyLjI2LTQxLjU5OC0xMjIuMjYtNDEuNTk4LTEuMDctMC4zNjMtMi4yNDgtMC4xODktMy4xNjUgMC40NjctMC45MTggMC42NTgtMS40NjIgMS43MTctMS40NjIgMi44NDZ2OTEuMjY3YzAgMS40MTYgMC44NTQgMi42OTIgMi4xNjMgMy4yMzNsMTY4LjA0IDY5LjQzOGMwLjQzIDAuMTc4IDAuODg1IDAuMjY2IDEuMzM2IDAuMjY2IDAuNjg0IDAgMS4zNjItMC4xOTkgMS45NDYtMC41OSAwLjk3Mi0wLjY1IDEuNTU1LTEuNzQyIDEuNTU1LTIuOTF2LTE2Ny44OWMwLTEuNDgyLTAuOTM1LTIuODA0LTIuMzMyLTMuMjk4eiIvPiAgPC9zdmc+`,
                get agrupavel(): boolean { return this.refTipoItem.id === 3 || this.refTipoItem.id === 4 },
                get nomeOpcao(): string {
                    if (this.comportamentoComponenteRitualistico !== undefined) return `${this.nome.nomeExibicao} (${this.comportamentoComponenteRitualistico.numeroDeCargasAtuais} ${pluralize(this.comportamentoComponenteRitualistico.numeroDeCargasAtuais, 'Carga')})`

                    if (this.comportamentoUtilizavel !== undefined) return `${this.nome.nomeExibicao} (${this.comportamentoUtilizavel.dadosUtilizaveis.map(utilizavel => `${utilizavel.usosAtuais} ${utilizavel.nomeUtilizavel}`).join(', ')})`;

                    return this.nome.nomeExibicao;
                },

                dadosAcoes: dadosItem.dadosAcoes || [],

                ...(dadosItem.dadosComportamentoEmpunhavel && {
                    comportamentoEmpunhavel: {
                        get refExtremidades(): Extremidade[] { return extremidades.filter(extremidade => extremidade.refItem?.codigoUnico === codigoUnico); },

                        extremidadesNecessarias: dadosItem.dadosComportamentoEmpunhavel.extremidadesNecessarias,
                        get custoEmpunhar(): CustoAcaoExecucao { return criarCustoAcaoExecucao(dadosItem.dadosComportamentoEmpunhavel!.dadosCustoEmpunhar, podePagarPreco, pagaPrecoExecucao, resumoPagamento) },

                        get estaEmpunhado(): boolean { return this.refExtremidades.length === this.extremidadesNecessarias; },
                        get extremidadeLivresSuficiente(): boolean { return extremidades.filter(extremidade => !extremidade.estaOcupada).length >= this.extremidadesNecessarias; },
                    }
                }),

                ...(dadosItem.dadosComportamentoEquipavel && {
                    comportamentoEquipavel: {
                        get estaEquipado(): boolean { return dadosPersonagem.dadosPersonagemEmExecucao.listaCodigoUnicoItensEquipados.some(codigoUnicoGuardado => codigoUnicoGuardado === codigoUnico); },

                        get custoEquipar(): CustoAcaoExecucao { return criarCustoAcaoExecucao(dadosItem.dadosComportamentoEquipavel!.dadosCustoEquipar, podePagarPreco, pagaPrecoExecucao, resumoPagamento) },
                    }
                }),

                ...(dadosItem.dadosComportamentoComponenteRitualistico && {
                    comportamentoComponenteRitualistico: {
                        numeroDeCargasMaximo: dadosItem.dadosComportamentoComponenteRitualistico!.numeroDeCargasMaximo,
                        numeroDeCargasAtuais: dadosItem.dadosComportamentoComponenteRitualistico!.numeroDeCargasMaximo,

                        get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === dadosItem.dadosComportamentoComponenteRitualistico!.idElemento)!; },
                        get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === dadosItem.dadosComportamentoComponenteRitualistico!.idNivelComponente)!; },

                        get nomeComponente(): string { return `Componente de ${this.refElemento.nome} ${this.refNivelComponente.nome}`; },

                        gastaCargaComponente: function () {
                            modificarItemDoInventario(codigoUnico, (dadosItem) => {
                                dadosItem.dadosComportamentoComponenteRitualistico!.numeroDeCargasAtuais--;
                                return dadosItem.dadosComportamentoComponenteRitualistico!.numeroDeCargasAtuais <= 0;
                            })
                        },
                    }
                }),

                ...(dadosItem.dadosComportamentoUtilizavel && {
                    comportamentoUtilizavel: {
                        dadosUtilizaveis: dadosItem.dadosComportamentoUtilizavel.dadosUtilizaveis,
                        retornaDadosUtilizavelPorNome: function (nomeUtilizavel: string) { return this.dadosUtilizaveis.find(dadosUtilizavel => dadosUtilizavel.nomeUtilizavel === nomeUtilizavel) },
                    },
                }),

                get quantidadeUnidadesDesseItem(): number { return (!this.agrupavel || this.itemEstaEmpunhado) ? 1 : inventario.itens.filter(item => !item.itemEstaEmpunhado && item.nome.nomeExibicao === this.nome.nomeExibicao).length },

                get refTipoItem(): TipoItem { return SingletonHelper.getInstance().tipos_items.find(tipo_item => tipo_item.id === dadosItem.idTipoItem)!; },

                get itemEmpunhavel(): boolean { return this.comportamentoEmpunhavel !== undefined; },
                get itemEquipavel(): boolean { return this.comportamentoEquipavel !== undefined; },
                get itemEhComponente(): boolean { return this.comportamentoComponenteRitualistico != undefined; },

                get itemEstaEmpunhado(): boolean { return this.itemEmpunhavel && this.comportamentoEmpunhavel!.estaEmpunhado; },
                get itemEstaEquipado(): boolean { return this.itemEquipavel && this.comportamentoEquipavel!.estaEquipado; },
                get itemEstaGuardado(): boolean { return !this.itemEstaEmpunhado && !this.itemEstaEquipado; },
                itemTemUtilizavelNecessarios(nomeUtilizavel: string, numeroUtilizado: number): boolean { return (this.comportamentoUtilizavel?.retornaDadosUtilizavelPorNome(nomeUtilizavel)?.usosAtuais ?? 0) >= numeroUtilizado; },

                get itemPodeSerEmpunhado(): boolean { return this.itemEmpunhavel && this.itemEstaGuardado; },
                get itemPodeSerGuardado(): boolean { return this.itemEstaEmpunhado; },
                get itemPodeSerEquipado(): boolean { return this.itemEstaEmpunhado; },
                get itemPodeSerDesequipado(): boolean { return this.itemEstaEquipado; },
            };

            if (dadosItem.dadosModificadores) {
                item.modificadores = dadosItem.dadosModificadores.map(dadosModificador => ({
                    nome: dadosModificador.nome,
                    quantidadeDuracaoMaxima: dadosModificador.quantidadeDuracaoMaxima,
                    quantidadeDuracaoAtual: dadosModificador.quantidadeDuracaoAtual,
                    efeitos: dadosModificador.dadosEfeitos.map(dadosEfeito => criarEfeito(dadosEfeito)),
                    refPai: item,
                    tipoRefPai: 'Ação',
                    svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PHRleHQgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAiIHg9IjU3IiB5PSIxMTQiIGlkPSJzdmdfMSIgZm9udC1zaXplPSIxNTAiIGZvbnQtZmFtaWx5PSJOb3RvIFNhbnMgSlAiIHRleHQtYW5jaG9yPSJzdGFydCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+RTwvdGV4dD48L2c+PC9zdmc+',
                    get refDuracao(): Duracao {
                        return SingletonHelper.getInstance().duracoes.find(duracao => duracao.id === dadosModificador.idDuracao)!
                    },
                    codigoUnico: 'asdgasga',
                    textoDuracao: 'afgsaf',
                    tipoModificador: dadosModificador.tipoModificador,
                }));
            }

            return item;
        });
    }, [dadosPersonagem, extremidades, execucoes]);

    const agrupamento = useMemo(() => {
        return itens.reduce((itemAgrupado, itemAtual) => {
            if (!itemAtual.agrupavel || itemAtual.itemEstaEmpunhado || !itemAgrupado.some(item => item.agrupavel && item.nome.nomeExibicao === itemAtual.nome.nomeExibicao && !item.itemEstaEmpunhado)) {
                itemAgrupado.push(itemAtual);
            }
            return itemAgrupado;
        }, [] as Item[]);
    }, [itens]);

    const espacosUsados = useMemo(() => itens.reduce((acc, cur) => acc + cur.peso, 0), [itens]);

    const inventario: Inventario = {
        itens,
        agrupamento,
        espacosUsados,
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