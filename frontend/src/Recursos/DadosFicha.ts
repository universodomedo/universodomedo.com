// #region Imports
import { RLJ_Ficha2 } from 'Classes/ClassesTipos/index.ts';
// #endregion

export const obtemDadosFichaDemonstracao = (): RLJ_Ficha2 => {
    return {
        detalhes: { nome: 'Ficha Demonstração', idClasse: 2, idNivel: 5 },
        estatisticasDanificaveis: [{ idEstatisticaDanificavel: 1, valorAtual: 30, valorMaximo: 30, }, { idEstatisticaDanificavel: 2, valorAtual: 20, valorMaximo: 20, }, { idEstatisticaDanificavel: 3, valorAtual: 25, valorMaximo: 25, }],
        estatisticasBuffaveis: [],
        atributos: [{ idAtributo: 1, valor: 2 }, { idAtributo: 2, valor: 2 }, { idAtributo: 3, valor: 1 }, { idAtributo: 4, valor: 0 }, { idAtributo: 5, valor: 3 }],
        periciasPatentes: [{ idPericia: 1, idPatentePericia: 2 }, { idPericia: 2, idPatentePericia: 1 }, { idPericia: 3, idPatentePericia: 1 }, { idPericia: 4, idPatentePericia: 3 }, { idPericia: 5, idPatentePericia: 1 }, { idPericia: 6, idPatentePericia: 2 }, { idPericia: 7, idPatentePericia: 1 }, { idPericia: 8, idPatentePericia: 2 }, { idPericia: 9, idPatentePericia: 1 }, { idPericia: 10, idPatentePericia: 1 }, { idPericia: 11, idPatentePericia: 1 }, { idPericia: 12, idPatentePericia: 1 }, { idPericia: 13, idPatentePericia: 1 }, { idPericia: 14, idPatentePericia: 1 }, { idPericia: 15, idPatentePericia: 1 }, { idPericia: 16, idPatentePericia: 1 }, { idPericia: 17, idPatentePericia: 1 }, { idPericia: 18, idPatentePericia: 1 }, { idPericia: 19, idPatentePericia: 1 }, { idPericia: 20, idPatentePericia: 2 }, { idPericia: 21, idPatentePericia: 1 }, { idPericia: 22, idPatentePericia: 1 }, { idPericia: 23, idPatentePericia: 1 }, { idPericia: 24, idPatentePericia: 3 }, { idPericia: 25, idPatentePericia: 1 }, { idPericia: 26, idPatentePericia: 1 }],
        rituais: [
            {
                dadosNomeCustomizado: { nomePadrao: 'Aprimorar Fortitude', nomeCustomizado: 'Aura Dourada' },
                idElemento: 1,
                idCirculoNivelRitual: 4,
                dadosAcoes: [
                    {
                        nome: 'Usar Ritual',
                        dadosCustos: {
                            dadosPrecoPE: {
                                valor: 4,
                            },
                            dadosPrecoExecucao: [
                                // {
                                //     idExecucao: 3,
                                //     quantidadeExecucoes: 1,
                                // }
                            ],
                            dadosPrecoComponente: {
                                idElemento: 1,
                                idNivelComponente: 2,
                                numeroCargasNoUso: 1,
                                precisaEstarEmpunhado: true,
                            },
                        },
                        // dadosDificuldade: {
                        //     idAtributo: 3,
                        //     idPericia: 15,
                        //     valorDificuldade: 5,
                        //     dadosDificuldadeDinamica: {
                        //         modificadorDificuldadeInicial: 0,
                        //         listaModificadoresDificuldade: [2, 5, 10]
                        //     }
                        // },
                        dadosModificadores: [
                            {
                                nome: 'Aprimorar Fortitude',
                                idDuracao: 3,
                                quantidadeDuracaoMaxima: 1,
                                quantidadeDuracaoAtual: 1,
                                dadosEfeitos: [
                                    {
                                        dadosValorEfeito: { valorBonusAdicional: 5 },
                                        idLinhaEfeito: 16,
                                        idTipoEfeito: 3,
                                    },
                                ],
                                tipoModificador: { tipo: 'Ativo' },
                            }
                        ]
                    }
                ],
            }
        ],
        inventario: {
            identificadorProximoItem: 4,
            dadosItens: [
                {
                    identificadorNomePadrao: '1_Componente de Conhecimento Complexo',
                    idTipoItem: 4,
                    dadosNomeCustomizado: { nomePadrao: 'Componente de Conhecimento Complexo' },
                    peso: 1,
                    categoria: 0,
                    dadosComportamentoEmpunhavel: { dadosCustoEmpunhar: [ { idExecucao: 3, quantidadeExecucoes: 1 } ], extremidadesNecessarias: 1, },
                    dadosComportamentoComponenteRitualistico: { idElemento: 1, idNivelComponente: 2, numeroDeCargasMaximo: 1, numeroDeCargasAtuais: 1 },
                },
                {
                    identificadorNomePadrao: '2_Componente de Conhecimento Complexo',
                    idTipoItem: 4,
                    dadosNomeCustomizado: { nomePadrao: 'Componente de Conhecimento Complexo' },
                    peso: 1,
                    categoria: 0,
                    dadosComportamentoEmpunhavel: { dadosCustoEmpunhar: [ { idExecucao: 3, quantidadeExecucoes: 1 } ], extremidadesNecessarias: 1, },
                    dadosComportamentoComponenteRitualistico: { idElemento: 1, idNivelComponente: 2, numeroDeCargasMaximo: 1, numeroDeCargasAtuais: 1 },
                },
                {
                    identificadorNomePadrao: '3_Componente de Conhecimento Simples',
                    idTipoItem: 4,
                    dadosNomeCustomizado: { nomePadrao: 'Componente de Conhecimento Simples' },
                    peso: 1,
                    categoria: 0,
                    dadosComportamentoEmpunhavel: { dadosCustoEmpunhar: [ { idExecucao: 3, quantidadeExecucoes: 1 } ], extremidadesNecessarias: 1, },
                    dadosComportamentoComponenteRitualistico: { idElemento: 1, idNivelComponente: 1, numeroDeCargasMaximo: 2, numeroDeCargasAtuais: 2 },
                },
            ]
        },
        reducoesDano: [],
        pendencias: { idNivelEsperado: 5 },
    };
}