// #region Imports
import { RLJ_Ficha2 } from 'Types/classes/index.ts';
// #endregion

export const obtemDadosFichaDemonstracao = (): RLJ_Ficha2 => {
    return {
        detalhes: { nome: 'Ficha Demonstração', idClasse: 2, idNivel: 5 },
        estatisticasDanificaveis: [ { id: 1, valorMaximo: 30 }, { id: 2, valorMaximo: 20 }, { id: 3, valorMaximo: 25 } ],
        estatisticasBuffaveis: [],
        atributos: [ { id: 1, valor: 2 }, { id: 2, valor: 2 }, { id: 3, valor: 1 }, { id: 4, valor: 0 }, { id: 5, valor: 3 } ],
        periciasPatentes: [ { idPericia: 1, idPatente: 2 }, { idPericia: 2, idPatente: 1 }, { idPericia: 3, idPatente: 1 }, { idPericia: 4, idPatente: 3 }, { idPericia: 5, idPatente: 1 }, { idPericia: 6, idPatente: 2 }, { idPericia: 7, idPatente: 1 }, { idPericia: 8, idPatente: 2 }, { idPericia: 9, idPatente: 1 }, { idPericia: 10, idPatente: 1 }, { idPericia: 11, idPatente: 1 }, { idPericia: 12, idPatente: 1 }, { idPericia: 13, idPatente: 1 }, { idPericia: 14, idPatente: 1 }, { idPericia: 15, idPatente: 1 }, { idPericia: 16, idPatente: 2 }, { idPericia: 17, idPatente: 1 }, { idPericia: 18, idPatente: 1 }, { idPericia: 19, idPatente: 1 }, { idPericia: 20, idPatente: 2 }, { idPericia: 21, idPatente: 1 }, { idPericia: 22, idPatente: 1 }, { idPericia: 23, idPatente: 1 }, { idPericia: 24, idPatente: 3 }, { idPericia: 25, idPatente: 1 }, { idPericia: 26, idPatente: 1 } ],
        rituais: [],
        inventario: [],
        reducoesDano: [],
        pendencias: { idNivelEsperado: 5 },
    };
}

// // const dadosFicha: { [key: number]: RLJ_Ficha2 } = {
// //     1: {
// //         detalhes: { nome: 'Rui', idClasse: 1, idNivel: 1, },
// //         estatisticasDanificaveis: [
// //             { id: 1, valorMaximo: 9, valor: 9, },
// //             { id: 2, valorMaximo: 7, valor: 7, },
// //             { id: 3, valorMaximo: 3, valor: 3, },
// //         ],
// //         estatisticasBuffaveis: [],
// //         atributos: [
// //             { id: 1, valor: 2, },
// //             { id: 2, valor: 1, },
// //             { id: 3, valor: 1, },
// //             { id: 4, valor: 2, },
// //             { id: 5, valor: 1, },
// //         ],
// //         periciasPatentes: [
// //             { idPericia: 7, idPatente: 2, },
// //             { idPericia: 24, idPatente: 2, },
// //         ],
// //         rituais: [],
// //         inventario: [
// //             {
// //                 idTipoItem: 1, nomeItem: { nomePadrao: 'Arma Leve 2', nomeCustomizado: 'Gorge2' }, peso: 3, categoria: 1,
// //                 detalhesArma: { dano: 6, variancia:2, numeroExtremidadesUtilizadas: 1, idPericiaUtilizada: 8 },
// //                 dadosAcoes: [
// //                     {
// //                         nomeAcao: 'Realizar Ataque', idTipoAcao: 2, idMecanica: 3,
// //                         custos: { custoExecucao: [ { idExecucao: 2, valor: 1 } ] },
// //                         requisitos: [2]
// //                     }
// //                 ],
// //             },
// //             {
// //                 idTipoItem: 4, nomeItem: { nomePadrao: 'Componente de Energia '}, peso: 1, categoria: 0,
// //                 detalhesComponente: { idElemento: 2, idNivelComponente: 1, usosMaximos: 2, usos: 2 },
// //             }
// //         ],
// //     }, // Rui
// //     2: {
// //         detalhes: { nome: 'Zumbi de Sangue', idClasse: 1, idNivel: 1, },
// //         estatisticasDanificaveis: [
// //             { id: 1, valorMaximo: 22, valor: 22, },
// //             { id: 2, valorMaximo: 0, valor: 0, },
// //             { id: 3, valorMaximo: 7, valor: 7, },
// //         ],
// //         estatisticasBuffaveis: [],
// //         atributos: [
// //             { id: 1, valor: 2, },
// //             { id: 2, valor: 2, },
// //             { id: 3, valor: 0, },
// //             { id: 4, valor: 1, },
// //             { id: 5, valor: 1, },
// //         ],
// //         periciasPatentes: [
// //             { idPericia: 7, idPatente: 2, },
// //             { idPericia: 8, idPatente: 2, },
// //             { idPericia: 22, idPatente: 2, },
// //         ],
// //         rituais: [],
// //         inventario: [],
// //     }, // Zumbi de Sangue
// //     3: {
// //         detalhes: { nome: 'Ocultista', idClasse: 4, idNivel: 4 },
// //         estatisticasDanificaveis: [
// //             { id: 1, valorMaximo: 17, valor: 17, },
// //             { id: 2, valorMaximo: 20, valor: 20, },
// //             { id: 3, valorMaximo: 15, valor: 15, },
// //         ],
// //         atributos: [
// //             { id: 1, valor: 2, },
// //             { id: 2, valor: 2, },
// //             { id: 3, valor: 2, },
// //             { id: 4, valor: 2, },
// //             { id: 5, valor: 1, },
// //         ],
// //         periciasPatentes: [
// //             { idPericia:4, idPatente: 2, },
// //             { idPericia:5, idPatente: 2, },
// //             { idPericia:7, idPatente: 2, },
// //             { idPericia:14, idPatente: 3, },
// //             { idPericia:16, idPatente: 3, },
// //             { idPericia:20, idPatente: 2, },
// //             { idPericia:25, idPatente: 2, },
// //         ],
// //         rituais: [
// //             {
// //                 nomeRitual: 'Aprimorar Ocultismo', idCirculoNivel: 3, idElemento: 1, dadosAcoes: [
// //                     {
// //                         nomeAcao: 'Usar Ritual', idTipoAcao: 3, idMecanica: 3,
// //                         custos: { custoPE: { valor: 5 }, custoExecucao: [ { idExecucao: 2, valor: 1 } ], custoComponente: true },
// //                         buffs: [{ idBuff: 16, nome: 'Aprimorar Ocultismo', valor: 4, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 3 }],
// //                         requisitos: [1]
// //                     }
// //                 ]
// //             },
// //             {
// //                 nomeRitual: 'Aprimorar Investigação', idCirculoNivel: 5, idElemento: 1, dadosAcoes: [
// //                     {
// //                         nomeAcao: 'Usar Ritual', idTipoAcao: 3, idMecanica: 3,
// //                         custos: { custoPE: { valor: 9 }, custoExecucao: [ { idExecucao: 2, valor: 1 } ], custoComponente: true },
// //                         buffs: [{ idBuff: 14, nome: 'Aprimorar Ocultismo', valor: 6, duracao: { idDuracao: 3, valor: 1 }, idTipoBuff: 3 }],
// //                         requisitos: [1]
// //                     }
// //                 ]
// //             }
// //         ],
// //         inventario: [],
// //     }, // Ocultista
// // }

// export const getDadoFichaPorIdFake = (idFake: number) => {
//     return dadosFicha[idFake];
// }