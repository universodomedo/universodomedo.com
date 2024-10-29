// #region Imports
import { RLJ_Ficha2 } from 'Types/classes/index.ts';
// #endregion

const dadosFicha: { [key: number]: RLJ_Ficha2 } = {
    1: {
        detalhes: { nome: 'Rui', idClasse: 1, idNivel: 1, },
        estatisticasDanificaveis: [
            { id: 1, valorMaximo: 9, valor: 9, },
            { id: 2, valorMaximo: 7, valor: 7, },
            { id: 3, valorMaximo: 3, valor: 3, },
        ],
        estatisticasBuffaveis: [],
        atributos: [
            { id: 1, valor: 2, },
            { id: 2, valor: 1, },
            { id: 3, valor: 1, },
            { id: 4, valor: 2, },
            { id: 5, valor: 1, },
        ],
        periciasPatentes: [
            { idPericia: 7, idPatente: 2, },
            { idPericia: 24, idPatente: 2, },
        ],
        rituais: [
            { nomeRitual: 'Ritual1', idCirculoNivel: 3, idElemento: 2, dadosAcao:
                {
                    nomeAcao: 'Acao1', idTipoAcao: 3, idCateoriaAcao: 1, idMecanica: 3, 
                    custos: { custoPE: { valor: 2 }, custoExecucao: [ { idExecucao: 2, valor: 1 } ], custoComponente: true },
                    buff: { idBuff: 6, nome: 'Aprimorar Acrobacia', valor: 2, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 3 },
                    requisitos: [1]
                }
            }
        ],
    }, // Rui
    2: {
        detalhes: { nome: 'Zumbi de Sangue', idClasse: 1, idNivel: 1, },
        estatisticasDanificaveis: [
            { id: 1, valorMaximo: 22, valor: 22, },
            { id: 2, valorMaximo: 0, valor: 0, },
            { id: 3, valorMaximo: 7, valor: 7, },
        ],
        estatisticasBuffaveis: [],
        atributos: [
            { id: 1, valor: 2, },
            { id: 2, valor: 2, },
            { id: 3, valor: 0, },
            { id: 4, valor: 1, },
            { id: 5, valor: 1, },
        ],
        periciasPatentes: [
            { idPericia: 7, idPatente: 2, },
            { idPericia: 8, idPatente: 2, },
            { idPericia: 22, idPatente: 2, },
        ],
    }, // Zumbi de Sangue
    3: {
        detalhes: { nome: 'Ocultista', idClasse: 4, idNivel: 4 },
        estatisticasDanificaveis: [
            { id: 1, valorMaximo: 17, valor: 17, },
            { id: 2, valorMaximo: 20, valor: 20, },
            { id: 3, valorMaximo: 15, valor: 15, },
        ],
        atributos: [
            { id: 1, valor: 2, },
            { id: 2, valor: 2, },
            { id: 3, valor: 2, },
            { id: 4, valor: 2, },
            { id: 5, valor: 1, },
        ],
        periciasPatentes: [
            { idPericia:4, idPatente: 2, },
            { idPericia:5, idPatente: 2, },
            { idPericia:7, idPatente: 2, },
            { idPericia:14, idPatente: 3, },
            { idPericia:16, idPatente: 3, },
            { idPericia:20, idPatente: 2, },
            { idPericia:25, idPatente: 2, },
        ],
        rituais: [
            {
                nomeRitual: 'Aprimorar Ocultismo', idCirculoNivel: 3, idElemento: 1, dadosAcao:
                {
                    nomeAcao: 'Usar Ritual', idTipoAcao: 3, idCateoriaAcao: 1, idMecanica: 3,
                    custos: { custoPE: { valor: 5 }, custoExecucao: [ { idExecucao: 2, valor: 1 } ], custoComponente: true },
                    buff: { idBuff: 16, nome: 'Aprimorar Ocultismo', valor: 4, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 3 },
                    requisitos: [1]
                }
            },
            {
                nomeRitual: 'Aprimorar Investigação', idCirculoNivel: 5, idElemento: 1, dadosAcao:
                {
                    nomeAcao: 'Usar Ritual', idTipoAcao: 3, idCateoriaAcao: 1, idMecanica: 3,
                    custos: { custoPE: { valor: 9 }, custoExecucao: [ { idExecucao: 2, valor: 1 } ], custoComponente: true },
                    buff: { idBuff: 14, nome: 'Aprimorar Ocultismo', valor: 6, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 3 },
                    requisitos: [1]
                }
            }
        ]
    }, // Ocultista
}

export const getDadoFichaPorIdFake = (idFake: number) => {
    return dadosFicha[idFake];
}