// #region Imports
import { ValoresGanhoETroca, RLJ_Ficha2 } from 'Types/classes/index.ts';
// #endregion

class ControladorGanhos {
    private mapaGanhos: { [nivel: number]: any } = {
        1: [
            {
                idTipoGanhoNex: 3,
                opcoes: {
                    valores: [5, 10, 5]
                }
            }
        ],
        // 1: [
        //     {
        //         idTipoGanhoNex: 1,
        //         opcoes: {
        //             valoresGanhoETroca: new ValoresGanhoETroca(2, 1)
        //         }
        //     },
        //     {
        //         idTipoGanhoNex: 2,
        //         opcoes: {
        //             valoresGanhoETroca: {
        //                 treinadas: new ValoresGanhoETroca(2)
        //             }
        //         }
        //     }
        // ],
        // 2: [
        //     {
        //         idTipoGanhoNex: 3,
        //         opcoes: {
        //             valores: [5, 10, 5]
        //         }
        //     }
        // ],
        3: [
            {
                idTipoGanhoNex: 4
            }
        ]
    };

    obterGanhosPorNivel(nivel: number) {
        return this.mapaGanhos[nivel] || [];
    }
}

export const retornaFichaZerada = (idNivelAtual:number, nome:string): RLJ_Ficha2 => {
    return {
        detalhes: { idClasse: 1, idNivel: idNivelAtual, nome: nome},
        estatisticasDanificaveis: [{ id: 1, valorMaximo: 6, valor: 6 }, { id: 2, valorMaximo: 5, valor: 5 }, { id: 3, valorMaximo: 1, valor: 1 }],
        estatisticasBuffaveis: [],
        atributos: [{ id: 1, valor: 1 }, { id: 2, valor: 1 }, { id: 3, valor: 1 }, { id: 4, valor: 1 }, { id: 5, valor: 1 }],
        periciasPatentes: [{ idPericia: 1, idPatente: 1 }, { idPericia: 2, idPatente: 1 }, { idPericia: 3, idPatente: 1 }, { idPericia: 4, idPatente: 1 }, { idPericia: 5, idPatente: 1 }, { idPericia: 6, idPatente: 1 }, { idPericia: 7, idPatente: 1 }, { idPericia: 8, idPatente: 1 }, { idPericia: 9, idPatente: 1 }, { idPericia: 10, idPatente: 1 }, { idPericia: 11, idPatente: 1 }, { idPericia: 12, idPatente: 1 }, { idPericia: 13, idPatente: 1 }, { idPericia: 14, idPatente: 1 }, { idPericia: 15, idPatente: 1 }, { idPericia: 16, idPatente: 1 }, { idPericia: 17, idPatente: 1 }, { idPericia: 18, idPatente: 1 }, { idPericia: 19, idPatente: 1 }, { idPericia: 20, idPatente: 1 }, { idPericia: 21, idPatente: 1 }, { idPericia: 22, idPatente: 1 }, { idPericia: 23, idPatente: 1 }, { idPericia: 24, idPatente: 1 }, { idPericia: 25, idPatente: 1 }, { idPericia: 26, idPatente: 1 }],
    };
}

const controladorGanhos = new ControladorGanhos();
export const obterGanhosPorNivel = (nivel: number) => controladorGanhos.obterGanhosPorNivel(nivel);