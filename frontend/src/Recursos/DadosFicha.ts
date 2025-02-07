// #region Imports
import { RLJ_Ficha2 } from 'Classes/ClassesTipos/index.ts';
// #endregion

export const obtemDadosFichaDemonstracao = (): RLJ_Ficha2 => {
    return {
        detalhes: { nome: 'Ficha Demonstração', idClasse: 2, idNivel: 5 },
        estatisticasDanificaveis: [ { id: 1, valorMaximo: 30 }, { id: 2, valorMaximo: 20 }, { id: 3, valorMaximo: 25 } ],
        estatisticasBuffaveis: [],
        atributos: [ { id: 1, valor: 2 }, { id: 2, valor: 2 }, { id: 3, valor: 1 }, { id: 4, valor: 0 }, { id: 5, valor: 3 } ],
        periciasPatentes: [ { idPericia: 1, idPatente: 2 }, { idPericia: 2, idPatente: 1 }, { idPericia: 3, idPatente: 1 }, { idPericia: 4, idPatente: 3 }, { idPericia: 5, idPatente: 1 }, { idPericia: 6, idPatente: 2 }, { idPericia: 7, idPatente: 1 }, { idPericia: 8, idPatente: 2 }, { idPericia: 9, idPatente: 1 }, { idPericia: 10, idPatente: 1 }, { idPericia: 11, idPatente: 1 }, { idPericia: 12, idPatente: 1 }, { idPericia: 13, idPatente: 1 }, { idPericia: 14, idPatente: 1 }, { idPericia: 15, idPatente: 1 }, { idPericia: 16, idPatente: 1 }, { idPericia: 17, idPatente: 1 }, { idPericia: 18, idPatente: 1 }, { idPericia: 19, idPatente: 1 }, { idPericia: 20, idPatente: 2 }, { idPericia: 21, idPatente: 1 }, { idPericia: 22, idPatente: 1 }, { idPericia: 23, idPatente: 1 }, { idPericia: 24, idPatente: 3 }, { idPericia: 25, idPatente: 1 }, { idPericia: 26, idPatente: 1 } ],
        rituais: [ 
            {
                args: { nome: 'Aprimorar Fortitude' },
                dadosComportamentos: { dadosComportamentoRitual: { idElemento: 1, idCirculoNivel: 4 } },
                dadosAcoes: [
                    {
                        args: { nome: 'Usar Ritual', idTipoAcao: 1, },
                        modificadores: [ { props: { nome: 'Fortitude Aprimorada', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosComportamentos: { dadosComportamentoAtivo: [] }, dadosEfeitos: [ { idLinhaEfeito: 16, idTipoEfeito: 1, dadosValoresEfeitos: { valorBonusAdicional: 5 } } ] } } ],
                        requisitos: [1],
                        dadosComportamentos: { dadosComportamentoCustoAcao: { custoPE: { valor: 3 }, custoExecucao: { precoExecucao: { precos: [ { idTipoExecucao: 2, quantidadeExecucoes: 1 } ] } } } }
                        // dadosComportamentos: { dadosComportamentoCustoAcao: { custoPE: { valor: 3 }, custoExecucao: { precoExecucao: { precos: [ { idTipoExecucao: 2, quantidadeExecucoes: 1 } ] } }, custoComponente: { numeroDeCargas: 1, componentePrecisaEstarEmpunhado: true, idElemento: 1, idNivel: 2, } } }
                    }
                ]
            }
        ],
        inventario: [],
        reducoesDano: [],
        pendencias: { idNivelEsperado: 5 },
    };
}