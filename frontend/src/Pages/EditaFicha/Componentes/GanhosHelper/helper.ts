// #region Imports
import { SingletonHelper } from 'Types/classes_estaticas.tsx';
import { ValoresGanhoETroca, RLJ_Ficha2, GanhoIndividualNex, GanhoIndividualNexAtributo, GanhoIndividualNexPericia, GanhoIndividualNexEstatisticaFixa } from 'Types/classes/index.ts';
// #endregion

export function instanciaComArgumentos<T extends new (...args: any[]) => any>(
    Ctor: T,
    ...params: ConstructorParameters<T>
) {
    return { Ctor, params } as const;
}

class ControladorGanhos {
    private mapaGanhos: {
        [nivel: number]: {
            readonly Ctor: new (...args: any[]) => GanhoIndividualNex;
            readonly params: any[];
        }[];
    } = {
        1: [
            instanciaComArgumentos(GanhoIndividualNexAtributo, new ValoresGanhoETroca(2, 1), 3),
            instanciaComArgumentos(GanhoIndividualNexPericia, new ValoresGanhoETroca(2))
        ],
        2: [
            instanciaComArgumentos(GanhoIndividualNexEstatisticaFixa, 5, 10, 5),
        ],
    };

    obterGanhosPorNivel(nivel: number): GanhoIndividualNex[] {
        return SingletonHelper.getInstance().tipos_ganho_nex.map(tipo => {
            // Verifica se o tipo já está definido no mapaGanhos
            const ganhoExistente = this.mapaGanhos[nivel]?.find(dado => {
                const instanciaTeste = new dado.Ctor(...dado.params);
                return instanciaTeste.id === tipo.id;
            });

            if (ganhoExistente) {
                return new ganhoExistente.Ctor(...ganhoExistente.params);
            } else {
                const Ctor = this.obterClassePorTipo(tipo.id);
                return new Ctor();
            }
        });
    }

    private obterClassePorTipo(idTipo: number): new (...args: any[]) => GanhoIndividualNex {
        switch (idTipo) {
            case 1:
                return GanhoIndividualNexAtributo;
            case 2:
                return GanhoIndividualNexPericia;
            case 3:
                return GanhoIndividualNexEstatisticaFixa;
            default:
                throw new Error(`Tipo de ganho não suportado: ${idTipo}`);
        }
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