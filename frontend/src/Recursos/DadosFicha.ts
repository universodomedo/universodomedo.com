// #region Imports
import { RLJ_Ficha2 } from 'Types/classes.tsx';
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
}

export const getDadoFichaPorIdFake = (idFake: number) => {
    return dadosFicha[idFake];
}