// #region Imports
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
import { ValoresGanhoETroca, RLJ_Ficha2, GanhoIndividualNex, GanhoIndividualNexAtributo, GanhoIndividualNexPericia, GanhoIndividualNexEstatisticaFixa, GanhoIndividualNexEscolhaClasse, GanhoIndividualNexRitual } from 'Types/classes/index.ts';
// #endregion

export function instanciaComArgumentos<T extends new (...args: any[]) => any>(
    Ctor: T,
    ...params: ConstructorParameters<T>
) {
    return { Ctor, params } as const;
}

class ControladorGanhos {
    private mapaValorMaximoAtributo: { [nivel: number]: { readonly maximo: number } } = {
        1: { maximo: 3 },
        7: { maximo: 4 },
        11: { maximo: 5 },
        17: { maximo: 6 },
        21: { maximo: 7 }
    };

    public obterValorMaximoDeAtributoNoNivel(nivel: number): number {
        const niveis = Object.keys(this.mapaValorMaximoAtributo).map(Number).sort((a, b) => a - b);

        let nivelMaisBaixo = niveis[0];
        for (const n of niveis) {
            if (nivel >= n) {
                nivelMaisBaixo = n;
            } else {
                break;
            }
        }

        return this.mapaValorMaximoAtributo[nivelMaisBaixo].maximo;
    }

    private mapaGanhos: { [idNivel: number]: { readonly Ctor: new (...args: any[]) => GanhoIndividualNex; readonly params: any[]; }[]; } = {
        // 1: [
        //     instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 0, trocas: 0 }, this.obterValorMaximoDeAtributoNoNivel(1)),
        //     instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
        //     instanciaComArgumentos(GanhoIndividualNexEscolhaClasse, true)
        // ]
        1: [
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 1 }, this.obterValorMaximoDeAtributoNoNivel(1)),
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 2, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
        ],
        2: [
            instanciaComArgumentos(GanhoIndividualNexEstatisticaFixa, { pv: 5, ps: 10, pe:5 }),
        ],
        3: [],
    };


    private mapaGanhosClasse: { [idClasse: number]: { [idNivel: number]: { readonly Ctor: new (...args: any[]) => GanhoIndividualNex; readonly params: any[]; }[] } } = {
        1: {
            3: [
                instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 0, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexEscolhaClasse, true)
            ]
        },
        2: {
            3: [
                instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 5, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
            ]
        },
        3: {
            3: [
                instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 7, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
            ]
        },
        4: {
            3: [
                instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 4, trocas: 0 }, { ganhos: 1, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
                instanciaComArgumentos(GanhoIndividualNexRitual, { numeroDeRituais: 1 })
            ]
        },
    }

    private testeGanhosAtributos: { [nivel: number]: { readonly Ctor: new (...args: any[]) => GanhoIndividualNex; readonly params: any[]; }[]; } = {
        // começa com 5
        1: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 })],
        3: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 })],
        7: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })],
        9: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })],
        11: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 0 })],
        13: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })],
        15: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })],
        17: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })],
        19: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })],
        20: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })],
        21: [instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 1, trocas: 0 })],
    };

    obterGanhosGerais(nivel: number, idClasse: number): GanhoIndividualNex[] {
        const ganhosPadrao = this.obterGanhosPorNivel(nivel);
        const ganhosClasse = this.obterGanhosDeClassePorNivel(nivel, idClasse);

        const ganhosCombinados: { [key: string]: { Ctor: new (...args: any[]) => GanhoIndividualNex; params: any[] } } = {};
    
        const processarGanhos = (ganhos: { Ctor: new (...args: any[]) => GanhoIndividualNex; params: any[] }[]) => {
            ganhos.forEach(ganho => {
                const key = ganho.Ctor.name;
    
                if (ganhosCombinados[key]) {
                    ganhosCombinados[key].params = this.combinarParams(ganhosCombinados[key].Ctor, ganhosCombinados[key].params, ganho.params);
                } else {
                    ganhosCombinados[key] = { Ctor: ganho.Ctor, params: ganho.params };
                }
            });
        };
    
        processarGanhos(ganhosPadrao);
        processarGanhos(ganhosClasse);
    
        return Object.values(ganhosCombinados).map(ganho => new ganho.Ctor(...ganho.params));
    }

    private obterGanhosDeClassePorNivel(nivel: number, idClasse: number): { Ctor: new (...args: any[]) => GanhoIndividualNex; params: any[] }[] {
        return this.mapaGanhosClasse[idClasse]?.[nivel] ?? [];
    }

    private obterGanhosPorNivel(nivel: number): { Ctor: new (...args: any[]) => GanhoIndividualNex; params: any[] }[] {
        return this.mapaGanhos[nivel] ?? [];
    }

    private combinarParams(Ctor: new (...args: any[]) => GanhoIndividualNex, params1: any[], params2: any[]): any[] {
        if (Ctor === GanhoIndividualNexAtributo) {
            return [ { ganhos: params1[0].ganhos + params2[0].ganhos, trocas: params1[0].trocas + params2[0].trocas } ];
        } else if (Ctor === GanhoIndividualNexPericia) {
            return params1.map((param, index) => ({ ganhos: param.ganhos + params2[index].ganhos, trocas: param.trocas + params2[index].trocas }));
        } else if (Ctor === GanhoIndividualNexEstatisticaFixa) {
            return [ { pv: params1[0].pv + params2[0].pv, ps: params1[0].ps + params2[0].ps, pe: params1[0].pe + params2[0].pe } ]
        }
    
        return [];
    }
}

export const retornaFichaZerada = (idNivelAtual: number, nome: string): RLJ_Ficha2 => {
    return {
        detalhes: { idClasse: 1, idNivel: idNivelAtual, nome: nome },
        estatisticasDanificaveis: [{ id: 1, valorMaximo: 6, valor: 6 }, { id: 2, valorMaximo: 5, valor: 5 }, { id: 3, valorMaximo: 1, valor: 1 }],
        estatisticasBuffaveis: [],
        atributos: [{ id: 1, valor: 1 }, { id: 2, valor: 1 }, { id: 3, valor: 1 }, { id: 4, valor: 1 }, { id: 5, valor: 1 }],
        periciasPatentes: [{ idPericia: 1, idPatente: 1 }, { idPericia: 2, idPatente: 1 }, { idPericia: 3, idPatente: 1 }, { idPericia: 4, idPatente: 1 }, { idPericia: 5, idPatente: 1 }, { idPericia: 6, idPatente: 1 }, { idPericia: 7, idPatente: 1 }, { idPericia: 8, idPatente: 1 }, { idPericia: 9, idPatente: 1 }, { idPericia: 10, idPatente: 1 }, { idPericia: 11, idPatente: 1 }, { idPericia: 12, idPatente: 1 }, { idPericia: 13, idPatente: 1 }, { idPericia: 14, idPatente: 1 }, { idPericia: 15, idPatente: 1 }, { idPericia: 16, idPatente: 1 }, { idPericia: 17, idPatente: 1 }, { idPericia: 18, idPatente: 1 }, { idPericia: 19, idPatente: 1 }, { idPericia: 20, idPatente: 1 }, { idPericia: 21, idPatente: 1 }, { idPericia: 22, idPatente: 1 }, { idPericia: 23, idPatente: 1 }, { idPericia: 24, idPatente: 1 }, { idPericia: 25, idPatente: 1 }, { idPericia: 26, idPatente: 1 }],
        rituais: [],
    };
}

const controladorGanhos = new ControladorGanhos();
export const obterGanhosGerais = (idNivel: number, idClasse: number) => controladorGanhos.obterGanhosGerais(idNivel, idClasse);