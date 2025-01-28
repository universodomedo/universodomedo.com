// #region Imports
import { RLJ_Ficha2 } from 'Classes/ClassesTipos/index.ts';
// #endregion

export const obtemDadosFichaDemonstracao = (): RLJ_Ficha2 => {
    return {
        detalhes: { nome: 'Ficha Demonstração', idClasse: 1, idNivel: 0 },
        estatisticasDanificaveis: [ { id: 1, valorMaximo: 6 }, { id: 2, valorMaximo: 5 }, { id: 3, valorMaximo: 1 } ],
        // estatisticasDanificaveis: [ { id: 1, valorMaximo: 30 }, { id: 2, valorMaximo: 20 }, { id: 3, valorMaximo: 25 } ],
        estatisticasBuffaveis: [],
        atributos: [ { id: 1, valor: 1 }, { id: 2, valor: 1 }, { id: 3, valor: 1 }, { id: 4, valor: 1 }, { id: 5, valor: 1 } ],
        // atributos: [ { id: 1, valor: 2 }, { id: 2, valor: 2 }, { id: 3, valor: 1 }, { id: 4, valor: 0 }, { id: 5, valor: 3 } ],
        periciasPatentes: [ { idPericia: 1, idPatente: 1 }, { idPericia: 2, idPatente: 1 }, { idPericia: 3, idPatente: 1 }, { idPericia: 4, idPatente: 1 }, { idPericia: 5, idPatente: 1 }, { idPericia: 6, idPatente: 1 }, { idPericia: 7, idPatente: 1 }, { idPericia: 8, idPatente: 1 }, { idPericia: 9, idPatente: 1 }, { idPericia: 10, idPatente: 1 }, { idPericia: 11, idPatente: 1 }, { idPericia: 12, idPatente: 1 }, { idPericia: 13, idPatente: 1 }, { idPericia: 14, idPatente: 1 }, { idPericia: 15, idPatente: 1 }, { idPericia: 16, idPatente: 1 }, { idPericia: 17, idPatente: 1 }, { idPericia: 18, idPatente: 1 }, { idPericia: 19, idPatente: 1 }, { idPericia: 20, idPatente: 1 }, { idPericia: 21, idPatente: 1 }, { idPericia: 22, idPatente: 1 }, { idPericia: 23, idPatente: 1 }, { idPericia: 24, idPatente: 1 }, { idPericia: 25, idPatente: 1 }, { idPericia: 26, idPatente: 1 } ],
        // periciasPatentes: [ { idPericia: 1, idPatente: 2 }, { idPericia: 2, idPatente: 1 }, { idPericia: 3, idPatente: 1 }, { idPericia: 4, idPatente: 3 }, { idPericia: 5, idPatente: 1 }, { idPericia: 6, idPatente: 2 }, { idPericia: 7, idPatente: 1 }, { idPericia: 8, idPatente: 2 }, { idPericia: 9, idPatente: 1 }, { idPericia: 10, idPatente: 1 }, { idPericia: 11, idPatente: 1 }, { idPericia: 12, idPatente: 1 }, { idPericia: 13, idPatente: 1 }, { idPericia: 14, idPatente: 1 }, { idPericia: 15, idPatente: 1 }, { idPericia: 16, idPatente: 1 }, { idPericia: 17, idPatente: 1 }, { idPericia: 18, idPatente: 1 }, { idPericia: 19, idPatente: 1 }, { idPericia: 20, idPatente: 2 }, { idPericia: 21, idPatente: 1 }, { idPericia: 22, idPatente: 1 }, { idPericia: 23, idPatente: 1 }, { idPericia: 24, idPatente: 3 }, { idPericia: 25, idPatente: 1 }, { idPericia: 26, idPatente: 1 } ],
        rituais: [],
        inventario: [],
        reducoesDano: [],
        pendencias: { idNivelEsperado: 5 },
    };
}