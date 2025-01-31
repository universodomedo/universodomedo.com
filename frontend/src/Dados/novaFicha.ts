// #region Imports
import { RLJ_Ficha2 } from 'Classes/ClassesTipos/index.ts';
// #endregion

const retornaFichaAntesDoNex0 = (nome: string, idNexSelecionado: number): RLJ_Ficha2 => {
    return {
        detalhes: { idClasse: 1, idNivel: 0, nome: nome },
        estatisticasDanificaveis: [{ id: 1, valorMaximo: 6, valor: 6 }, { id: 2, valorMaximo: 5, valor: 5 }, { id: 3, valorMaximo: 1, valor: 1 }],
        estatisticasBuffaveis: [],
        atributos: [{ id: 1, valor: 1 }, { id: 2, valor: 1 }, { id: 3, valor: 1 }, { id: 4, valor: 1 }, { id: 5, valor: 1 }],
        periciasPatentes: [{ idPericia: 1, idPatente: 1 }, { idPericia: 2, idPatente: 1 }, { idPericia: 3, idPatente: 1 }, { idPericia: 4, idPatente: 1 }, { idPericia: 5, idPatente: 1 }, { idPericia: 6, idPatente: 1 }, { idPericia: 7, idPatente: 1 }, { idPericia: 8, idPatente: 1 }, { idPericia: 9, idPatente: 1 }, { idPericia: 10, idPatente: 1 }, { idPericia: 11, idPatente: 1 }, { idPericia: 12, idPatente: 1 }, { idPericia: 13, idPatente: 1 }, { idPericia: 14, idPatente: 1 }, { idPericia: 15, idPatente: 1 }, { idPericia: 16, idPatente: 1 }, { idPericia: 17, idPatente: 1 }, { idPericia: 18, idPatente: 1 }, { idPericia: 19, idPatente: 1 }, { idPericia: 20, idPatente: 1 }, { idPericia: 21, idPatente: 1 }, { idPericia: 22, idPatente: 1 }, { idPericia: 23, idPatente: 1 }, { idPericia: 24, idPatente: 1 }, { idPericia: 25, idPatente: 1 }, { idPericia: 26, idPatente: 1 }],
        rituais: [],
        inventario: [],
        reducoesDano: [{ idTipoDano: 1, valor: 0 }, { idTipoDano: 2, valor: 0 }, { idTipoDano: 3, valor: 0 }, { idTipoDano: 4, valor: 0 }, { idTipoDano: 5, valor: 0 }, { idTipoDano: 6, valor: 0 }, { idTipoDano: 7, valor: 0 }, { idTipoDano: 8, valor: 0 }, { idTipoDano: 9, valor: 0 }, { idTipoDano: 10, valor: 0 }, { idTipoDano: 11, valor: 0 }, { idTipoDano: 12, valor: 0 }, { idTipoDano: 13, valor: 0 }, { idTipoDano: 14, valor: 0 }, { idTipoDano: 15, valor: 0 }, { idTipoDano: 16, valor: 0 }, { idTipoDano: 17, valor: 0 }, { idTipoDano: 18, valor: 0 }],
        pendencias: {
            idNivelEsperado: idNexSelecionado,
        }
    };
}

export const criaFichaERetornaIndexInserido = (nome: string, idNexSelecionado: number): number => {
    const data = localStorage.getItem('dadosFicha');
    const dadosFicha = data ? JSON.parse(data) : [];

    const indexDoElementoQueVaiSerInserido = dadosFicha.length;
    dadosFicha.push(retornaFichaAntesDoNex0(nome, idNexSelecionado));
    localStorage.setItem('dadosFicha', JSON.stringify(dadosFicha));

    return indexDoElementoQueVaiSerInserido;
}