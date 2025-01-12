// #region Imports
import React from 'react';
import { RLJ_Ficha2, Atributo, Pericia, PatentePericia, ArgsRitual, AvisoGanhoNex, ValidacoesGanhoNex, CondicaoGanhoNexComOperador, RegrasCondicaoGanhoNex, OperadorCondicao, CondicaoGanhoNex, TipoEstatisticaDanificavel } from 'Types/classes/index.ts';
import { SingletonHelper } from "Types/classes_estaticas.tsx";

import { CircleIcon, Cross1Icon, CheckIcon } from '@radix-ui/react-icons';
// #endregion

export class GanhosNex {
    public ganhos: GanhoIndividualNex[] = [];
    public finalizando: boolean = false;
    public indexEtapa: number = 0;

    constructor(public dadosFicha: RLJ_Ficha2) { }

    adicionarNovoGanho(ganhos: GanhoIndividualNex[]) {
        this.ganhos = ganhos;

        this.finalizando = false;
        this.indexEtapa = 0;
    }

    get finalizados(): boolean { return false; }

    finalizar() { console.log('nex finalizado'); }

    clickBotao() {

    }

    get pvAtualizado(): number {
        const valorAtualizado = this.dadosFicha.estatisticasDanificaveis?.find(estatistica_danificavel => estatistica_danificavel.id === 1)!.valor! + this.ganhos.reduce((acc, cur) => acc + cur.pvGanhoIndividual, 0);

        return (this.dadosFicha.detalhes?.idNivel === 0 ? Math.ceil(valorAtualizado) : valorAtualizado);
    }

    get psAtualizado(): number {
        const valorAtualizado = this.dadosFicha.estatisticasDanificaveis?.find(estatistica_danificavel => estatistica_danificavel.id === 2)!.valor! + this.ganhos.reduce((acc, cur) => acc + cur.psGanhoIndividual, 0);

        return (this.dadosFicha.detalhes?.idNivel === 0 ? Math.ceil(valorAtualizado) : valorAtualizado);
    }

    get peAtualizado(): number {
        const valorAtualizado = this.dadosFicha.estatisticasDanificaveis?.find(estatistica_danificavel => estatistica_danificavel.id === 3)!.valor! + this.ganhos.reduce((acc, cur) => acc + cur.peGanhoIndividual, 0);

        return (this.dadosFicha.detalhes?.idNivel === 0 ? Math.ceil(valorAtualizado) : valorAtualizado);
    }

    get ganhosQueTemAlteracao(): GanhoIndividualNex[] { return this.ganhos.filter(ganho => ganho.alterando); }
    get etapa(): GanhoIndividualNex { return this.ganhosQueTemAlteracao[this.indexEtapa]; }
    get estaNaUltimaEtapa(): boolean { return this.indexEtapa === this.ganhosQueTemAlteracao.length - 1; }
    get estaNaPrimeiraEtapa(): boolean { return this.indexEtapa === 0; }
    get textoBotaoProximo(): string { return this.estaNaUltimaEtapa ? 'Finalizar' : 'Continuar'; }

    retrocedeEtapa() { (this.finalizando) ? this.finalizando = false : this.indexEtapa--; this.etapa.validaCondicoes(); }
    get podeRetrocederEtapa(): boolean { return !this.estaNaPrimeiraEtapa; }

    avancaEtapa() { (this.estaNaUltimaEtapa) ? this.finalizando = true : this.indexEtapa++; this.etapa.validaCondicoes(); }

    get podeAvancarEtapa(): boolean { return this.etapa.finalizado && this.etapa.pontosObrigatoriosValidadosGenerico; }
}

export class TipoGanhoNex {
    constructor(
        public id: number,
        public nome: string
    ) { }
}

export class GanhoEstatisticaPorPontoDeAtributo {
    constructor(
        private _idEstatistica: number,
        public valorPorPonto: number
    ) { }

    get refEstatistica(): TipoEstatisticaDanificavel { return SingletonHelper.getInstance().tipo_estatistica_danificavel.find(estatistica_danificavel => estatistica_danificavel.id === this._idEstatistica)! };
}

export class ValorUtilizavel {
    public valorAtual: number;
    constructor(public valorInicial: number) { this.valorAtual = this.valorInicial; }

    get valorZerado(): boolean { return this.valorAtual === 0 }
    get valorAbaixoDeZero(): boolean { return this.valorAtual < 0 }

    aumentaValor() { this.valorAtual++; }
    diminuiValor() { this.valorAtual--; }
}

export class ValoresGanhoETroca {
    public ganhos: ValorUtilizavel;
    public trocas: ValorUtilizavel;

    constructor(numeroGanhos: number = 0, numeroTrocas: number = 0) {
        this.ganhos = new ValorUtilizavel(numeroGanhos);
        this.trocas = new ValorUtilizavel(numeroTrocas);
    }

    realizaGanho() { this.ganhos.diminuiValor(); }
    desrealizaGanho() { this.ganhos.aumentaValor(); }

    realizaTroca() { this.realizaGanho(); this.trocas.aumentaValor(); }
    desrealizaTroca() { this.desrealizaGanho(); this.trocas.diminuiValor(); }

    get ganhoTemPontos(): boolean { return !this.ganhos.valorZerado; }
    get trocaTemPontos(): boolean { return !this.trocas.valorZerado; }
    get alterando(): boolean { return this.ganhos.valorInicial > 0 || this.trocas.valorInicial > 0; }
    get finalizado(): boolean { return this.ganhos.valorZerado; }
}

export class AtributoEmGanho {
    public ganhosEstatisticas: GanhoEstatisticaPorPontoDeAtributo[] = [];
    public valorAtual: number;

    constructor(
        private _refAtributo: Atributo,
        private _valorInicial: number,
        private _valorMaximo: number,
    ) {
        this.valorAtual = this._valorInicial;
    }

    get refAtributo(): Atributo { return this._refAtributo; }
    get valorInicial(): number { return this._valorInicial; }
    get valorMaximo(): number { return this._valorMaximo; }

    alterarValor(modificador: number) {
        this.valorAtual += modificador;
    }

    ganhoEstatistica(idEstatistica: number): number {
        const ganho = this.ganhosEstatisticas.find(ganhoEstatistica => ganhoEstatistica.refEstatistica.id === idEstatistica);

        return ganho ? ganho.valorPorPonto * this.valorAtual : 0;
    }

    get menorQueInicialmente(): boolean { return this.valorAtual < this._valorInicial }
    get estaEmValorMaximo(): boolean { return this.valorAtual >= this._valorMaximo }
    get estaEmValorMinimo(): boolean { return this.valorAtual < 1 }
    get estaMaiorQueInicial(): boolean { return this.valorAtual > this._valorInicial }
}

export class PericiaEmGanho {
    public idPatenteAtual: number;

    constructor(
        private _refPericia: Pericia,
        private _idPatenteInicial: number,
    ) {
        this.idPatenteAtual = this._idPatenteInicial;
    }

    get refPericia(): Pericia { return this._refPericia; }
    get refPatenteInicial(): PatentePericia { return this._refPatente(this._idPatenteInicial); }
    get refPatenteAtual(): PatentePericia { return this._refPatente(this.idPatenteAtual); }
    get estaEmValorMinimo(): boolean { return this.idPatenteAtual === 1; }
    get estaMaiorQueInicial(): boolean { return this.idPatenteAtual > this._idPatenteInicial }

    private _refPatente(idPatente: number): PatentePericia { return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === idPatente)!; }
    alterarValor(modificador: number) { this.idPatenteAtual += modificador; }
}

function instanciaComArgumentos<T extends new (...args: any[]) => any>(
    Ctor: T,
    ...params: ConstructorParameters<T>
) {
    return { Ctor, params } as const;
}

export class ControladorGanhos {
    private mapaGanhoObrigatorio: { [idNivel: number]: { [idClasse: number]: { [Ctor: string]: { mensagem: string; operador?: OperadorCondicao; condicoes: { idOpcao: number; regra: RegrasCondicaoGanhoNex; valorCondicao: number; }[] }[] } } } = {
        1: {
            1: {
                GanhoIndividualNexPericia: [
                    {
                        condicoes: [
                            { idOpcao: 16, regra: 'igual', valorCondicao: 1 },
                        ],
                        mensagem: 'Você não pode ser Treinado em Ocultismo',
                    }
                ],
            }
        },
        3: {
            2: {
                GanhoIndividualNexAtributo: [
                    {
                        operador: 'OU',
                        condicoes: [
                            { idOpcao: 1, regra: 'maior', valorCondicao: 1 },
                            { idOpcao: 2, regra: 'maior', valorCondicao: 1 },
                            { idOpcao: 5, regra: 'maior', valorCondicao: 1 },
                        ],
                        mensagem: 'Você precisa ter Mais de 1 em Agilidade, Força ou Vigor',
                    },
                ],
                GanhoIndividualNexPericia: [
                    {
                        operador: 'OU',
                        condicoes: [
                            { idOpcao: 5, regra: 'maior', valorCondicao: 1 },
                            { idOpcao: 8, regra: 'maior', valorCondicao: 1 },
                        ],
                        mensagem: 'Você precisa ser Treinado em Pontaria ou Luta',
                    },
                    {
                        operador: 'OU',
                        condicoes: [
                            { idOpcao: 6, regra: 'maior', valorCondicao: 1 },
                            { idOpcao: 26, regra: 'maior', valorCondicao: 1 },
                        ],
                        mensagem: 'Você precisa ser Treinado em Reflexo ou Fortitude',
                    }
                ],
            },
            4: {
                GanhoIndividualNexAtributo: [
                    {
                        operador: 'OU',
                        condicoes: [
                            { idOpcao: 3, regra: 'maior', valorCondicao: 1 },
                            { idOpcao: 4, regra: 'maior', valorCondicao: 1 },
                        ],
                        mensagem: 'Você precisa ter Mais de 1 em Inteligência ou Presença',
                    },
                ],
                GanhoIndividualNexPericia: [
                    {
                        condicoes: [
                            { idOpcao: 16, regra: 'maior', valorCondicao: 1 },
                        ],
                        mensagem: 'Você precisa ser Treinado em Ocultismo',
                    },
                ],
            }
        }
    }

    public obterGanhoObrigatorio(idNivel: number, idClasse: number): { [Ctor: string]: { mensagem: string; operador?: OperadorCondicao; condicoes: { idOpcao: number; regra: RegrasCondicaoGanhoNex; valorCondicao: number; }[] }[] } {
        return this.mapaGanhoObrigatorio[idNivel]?.[idClasse] || {};
    }

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
        1: [
            instanciaComArgumentos(GanhoIndividualNexAtributo, { ganhos: 2, trocas: 1 }, this.obterValorMaximoDeAtributoNoNivel(1)),
            instanciaComArgumentos(GanhoIndividualNexPericia, { ganhos: 2, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }, { ganhos: 0, trocas: 0 }),
        ],
        2: [
            instanciaComArgumentos(GanhoIndividualNexEstatisticaFixa, { pv: 5, ps: 10, pe: 5 }),
        ],
        3: [],
    };

    private mapaGanhosClasse: {
        [idClasse: number]: { [idNivel: number]: { readonly Ctor: new (...args: any[]) => GanhoIndividualNex; readonly params: any[]; }[] }
    } = {
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

    private mapaGanhosEstatisticas: {
        [idClasse: number]: { [idAtributo: number]: { [idEstatisticaDanificavel: number]: { valor: number } } }
    } = {
            // Classe Mundano
            1: {
                1: {
                    1: { valor: 0.0 },
                    2: { valor: 0.0 },
                    3: { valor: 0.3 }
                },
                2: {
                    1: { valor: 1.0 },
                    2: { valor: 0.0 },
                    3: { valor: 0.3 },
                },
                3: {
                    1: { valor: 0.0 },
                    2: { valor: 0.5 },
                    3: { valor: 0.0 },
                },
                4: {
                    1: { valor: 0.0 },
                    2: { valor: 0.5 },
                    3: { valor: 0.0 },
                },
                5: {
                    1: { valor: 2.0 },
                    2: { valor: 0.0 },
                    3: { valor: 0.3 },
                },
            },
            // Classe Combatente
            2: {
                1: {
                    1: { valor: 0.3 },
                    2: { valor: 0.4 },
                    3: { valor: 1.0 }
                },
                2: {
                    1: { valor: 0.6 },
                    2: { valor: 0.4 },
                    3: { valor: 0.6 },
                },
                3: {
                    1: { valor: 0.6 },
                    2: { valor: 1.0 },
                    3: { valor: 1.0 },
                },
                4: {
                    1: { valor: 0.4 },
                    2: { valor: 0.8 },
                    3: { valor: 0.4 },
                },
                5: {
                    1: { valor: 1.5 },
                    2: { valor: 0.8 },
                    3: { valor: 0.5 },
                },
            },
            // Classe Especialista
            3: {
                1: {
                    1: { valor: 0.3 },
                    2: { valor: 0.4 },
                    3: { valor: 0.8 }
                },
                2: {
                    1: { valor: 0.4 },
                    2: { valor: 0.4 },
                    3: { valor: 0.8 },
                },
                3: {
                    1: { valor: 0.6 },
                    2: { valor: 1.0 },
                    3: { valor: 0.8 },
                },
                4: {
                    1: { valor: 0.6 },
                    2: { valor: 1.0 },
                    3: { valor: 0.5 },
                },
                5: {
                    1: { valor: 0.7 },
                    2: { valor: 0.5 },
                    3: { valor: 0.4 },
                },
            },
            // Classe Ocultista
            4: {
                1: {
                    1: { valor: 0.3 },
                    2: { valor: 0.8 },
                    3: { valor: 0.5 }
                },
                2: {
                    1: { valor: 0.4 },
                    2: { valor: 0.8 },
                    3: { valor: 0.5 },
                },
                3: {
                    1: { valor: 0.6 },
                    2: { valor: 1.4 },
                    3: { valor: 1.0 },
                },
                4: {
                    1: { valor: 0.3 },
                    2: { valor: 1.0 },
                    3: { valor: 0.6 },
                },
                5: {
                    1: { valor: 0.6 },
                    2: { valor: 1.0 },
                    3: { valor: 0.3 },
                },
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

    obterGanhosEstatisticasDoAtributoPorClasse(idClasse: number): { idAtributo: number, ganhos: GanhoEstatisticaPorPontoDeAtributo[] }[] {
        const atributosDaClasse = this.mapaGanhosEstatisticas[idClasse];

        if (!atributosDaClasse) {
            return [];
        }

        return Object.entries(atributosDaClasse).map(([idAtributo, estatisticas]) => ({
            idAtributo: parseInt(idAtributo),
            ganhos: Object.entries(estatisticas).map(([idEstatistica, { valor }]) => ( new GanhoEstatisticaPorPontoDeAtributo(parseInt(idEstatistica), valor))),
        }));
        // return Object.entries(atributosDaClasse).map(([idAtributo, estatisticas]) => ({
        //     idAtributo: parseInt(idAtributo),
        //     ganhos: Object.entries(estatisticas).map(([idEstatistica, { valor }]) => ({
        //         idEstatistica: parseInt(idEstatistica),
        //         valorPorPonto: valor,
        //     })),
        // }));
    }

    obterGanhosGerais(idNivel: number, idClasse: number): GanhoIndividualNex[] {
        const ganhosPadrao = this.obterGanhosPorNivel(idNivel);
        const ganhosClasse = this.obterGanhosDeClassePorNivel(idNivel, idClasse);
        const ganhosObrigatorios = this.obterGanhoObrigatorio(idNivel, idClasse);

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

        return Object.values(ganhosCombinados).map(ganho => {
            const newClass = new ganho.Ctor(...ganho.params);
            newClass.carregaPontosObrigatorios(ganhosObrigatorios[ganho.Ctor.name] ?? []);
            return newClass;
        });
    }

    private obterGanhosDeClassePorNivel(nivel: number, idClasse: number): { Ctor: new (...args: any[]) => GanhoIndividualNex; params: any[] }[] {
        return this.mapaGanhosClasse[idClasse]?.[nivel] ?? [];
    }

    private obterGanhosPorNivel(nivel: number): { Ctor: new (...args: any[]) => GanhoIndividualNex; params: any[] }[] {
        return this.mapaGanhos[nivel] ?? [];
    }

    private combinarParams(Ctor: new (...args: any[]) => GanhoIndividualNex, params1: any[], params2: any[]): any[] {
        if (Ctor === GanhoIndividualNexAtributo) {
            return [{ ganhos: params1[0].ganhos + params2[0].ganhos, trocas: params1[0].trocas + params2[0].trocas }];
        } else if (Ctor === GanhoIndividualNexPericia) {
            return params1.map((param, index) => ({ ganhos: param.ganhos + params2[index].ganhos, trocas: param.trocas + params2[index].trocas }));
        } else if (Ctor === GanhoIndividualNexEstatisticaFixa) {
            return [{ pv: params1[0].pv + params2[0].pv, ps: params1[0].ps + params2[0].ps, pe: params1[0].pe + params2[0].pe }]
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
        inventario: [],
        // buffs: [],
    };
}

interface ValoresGanhoETrocaProps {
    ganhos: number,
    trocas: number,
}

interface GanhosEstatisticaProps {
    pv: number,
    ps: number,
    pe: number,
}

interface GanhoRitualProps {
    numeroDeRituais: number,
}

export class GanhoIndividualNexFactory {
    public static ficha: RLJ_Ficha2;

    static setFicha(ficha: RLJ_Ficha2) {
        GanhoIndividualNexFactory.ficha = ficha;
    }
}

export abstract class GanhoIndividualNex {
    protected _refFicha: RLJ_Ficha2;

    constructor(
        private _idTipoGanhoNex: number,
        protected _alterando: boolean,
    ) {
        this._refFicha = GanhoIndividualNexFactory.ficha;
    }

    public abstract tituloEtapa: string;
    public abstract get avisoGanhoNex(): AvisoGanhoNex[];
    public pontosObrigatorios: ValidacoesGanhoNex[] = [];

    public get pontosObrigatoriosValidadosGenerico(): boolean {
        this.validaCondicoes();

        return this.pontosObrigatorios.every(pontoObrigatorio => pontoObrigatorio.valido);
    }

    public validaCondicoes(): void {        
        this.pontosObrigatorios.forEach(pontoObrigatorio => {
            pontoObrigatorio.condicao.condicoes.forEach(condicao => condicao.validaCondicao(this.obtemOpcaoAValidar(condicao.idOpcao)))
        });
    }
    
    abstract obtemOpcaoAValidar(idOpcao: number): number;

    get refTipoGanhoNex(): TipoGanhoNex { return SingletonHelper.getInstance().tipos_ganho_nex.find(tipo_ganho_nex => tipo_ganho_nex.id === this._idTipoGanhoNex)! }

    get id(): number { return this._idTipoGanhoNex; }
    get alterando(): boolean { return this._alterando; }
    abstract get finalizado(): boolean;
    abstract get pvGanhoIndividual(): number;
    abstract get peGanhoIndividual(): number;
    abstract get psGanhoIndividual(): number;

    carregaPontosObrigatorios(pontosObrigatorios: { mensagem: string, operador?: OperadorCondicao; condicoes: { idOpcao: number, regra: RegrasCondicaoGanhoNex; valorCondicao: number; }[] }[]) {
        this.pontosObrigatorios = pontosObrigatorios.map(ponto => {
            return new ValidacoesGanhoNex(
                {
                    operador: ponto.operador,
                    condicoes: ponto.condicoes.map(condicao => {
                        return new CondicaoGanhoNex(
                            condicao.idOpcao,
                            condicao.regra,
                            condicao.valorCondicao,
                        );
                    }),
                },
                ponto.mensagem
            );
        });
    }
}

export class GanhoIndividualNexAtributo extends GanhoIndividualNex {
    public ganhosAtributo: ValoresGanhoETroca;
    public atributos: AtributoEmGanho[];
    public tituloEtapa = 'Ganho de Atributos';

    constructor(valoresGanhoETrocaProps: ValoresGanhoETrocaProps, protected valorMaxAtributo: number = 3) {
        const ganhos = new ValoresGanhoETroca(valoresGanhoETrocaProps.ganhos, valoresGanhoETrocaProps.trocas);
        super(1, ganhos.alterando);
        this.ganhosAtributo = ganhos;
        this.atributos = this._refFicha.atributos?.map(atributoBase => new AtributoEmGanho(SingletonHelper.getInstance().atributos.find(atributo => atributo.id === atributoBase.id)!, atributoBase.valor, valorMaxAtributo))!;
        this.carregaGanhosEstatisticasAtributos();
    }

    obtemOpcaoAValidar(idOpcao: number): number {
        return this.atributos.find(atributo => atributo.refAtributo.id === idOpcao)!.valorAtual
    }

    public get avisoGanhoNex():AvisoGanhoNex[] {
        return [
            { mensagem: `O Valor Máximo de Atributo no momento é ${this.valorMaxAtributo}`, bloqueia: false, icone: '' },
            { mensagem: 'O Valor Mínimo de Atributo é 0', bloqueia: false, icone: '' },

            ...(
                this.ganhosAtributo.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Ganho de ${this.ganhosAtributo.ganhos.valorInicial} Atributos`,
                        bloqueia: true,
                        icone: (this.ganhosAtributo.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                    }]
                    : []
            ),

            ...(
                this.ganhosAtributo.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Troca Opcional de ${this.ganhosAtributo.trocas.valorInicial} Atributo`,
                        bloqueia: false,
                        icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } }) }]
                    : []
            ),
            
            ...this.pontosObrigatorios.map(ponto => ({
                mensagem: ponto.mensagem!,
                bloqueia: true,
                icone: ponto.iconeValidacao
            }))
        ];
    }

    carregaGanhosEstatisticasAtributos() {
        const ganhosEstatisticas = obterGanhosEstatisticas(this._refFicha.detalhes?.idClasse!);

        this.atributos.forEach(atributo => {
            atributo.ganhosEstatisticas = ganhosEstatisticas.find(ganho => ganho.idAtributo === atributo.refAtributo.id)?.ganhos!;
        })
    }

    get finalizado(): boolean { return this.ganhosAtributo.finalizado; }
    get quantidadeDeAtributosReduzidos(): number { return this.atributos.filter(atributo => atributo.menorQueInicialmente).length }
    get pvGanhoIndividual(): number { return this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(1) }, 0); }
    get psGanhoIndividual(): number { return this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(2) }, 0); }
    get peGanhoIndividual(): number { return this.atributos.reduce((cur, acc) => { return cur + acc.ganhoEstatistica(3) }, 0); }

    adicionaPonto(idAtributo: number) {
        const atributo = this.atributos.find(atributo => atributo.refAtributo.id === idAtributo)!;
        
        (atributo.valorAtual < atributo.valorInicial) ? this.ganhosAtributo.realizaTroca() : this.ganhosAtributo.realizaGanho();
        
        atributo.alterarValor(1);

        this.validaCondicoes();
    }

    subtraiPonto(idAtributo: number) {
        const atributo = this.atributos.find(atributo => atributo.refAtributo.id === idAtributo)!;
        
        atributo.alterarValor(-1);
        
        (atributo.valorAtual < atributo.valorInicial) ? this.ganhosAtributo.desrealizaTroca() : this.ganhosAtributo.desrealizaGanho();

        this.validaCondicoes();
    }
}

export class GanhoIndividualNexPericia extends GanhoIndividualNex {
    public ganhosTreinadas: ValoresGanhoETroca;
    public ganhosVeteranas: ValoresGanhoETroca;
    public ganhosExperts: ValoresGanhoETroca;
    public ganhosLivres: ValoresGanhoETroca;
    public pericias: PericiaEmGanho[];
    public tituloEtapa = 'Ganho de Perícias';

    obtemOpcaoAValidar(idOpcao: number): number {
        return this.pericias.find(pericia => pericia.refPericia.id === idOpcao)!.refPatenteAtual.id;
    }

    public get avisoGanhoNex():AvisoGanhoNex[] {
        return [

            ...(
                this.ganhosTreinadas.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Ganho de ${this.ganhosTreinadas.ganhos.valorInicial} Perícias Treinadas`,
                        bloqueia: true,
                        icone: (this.ganhosTreinadas.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                    }]
                    : []
            ),
            ...(
                this.ganhosVeteranas.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Ganho de ${this.ganhosVeteranas.ganhos.valorInicial} Perícias Veteranas`,
                        bloqueia: true,
                        icone: (this.ganhosVeteranas.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                    }]
                    : []
            ),
            ...(
                this.ganhosExperts.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Ganho de ${this.ganhosExperts.ganhos.valorInicial} Perícias Experts`,
                        bloqueia: true,
                        icone: (this.ganhosExperts.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                    }]
                    : []
            ),
            ...(
                this.ganhosLivres.ganhos.valorInicial > 0
                    ? [{
                        mensagem: `Ganho de ${this.ganhosLivres.ganhos.valorInicial} Perícias Livres`,
                        bloqueia: true,
                        icone: (this.ganhosLivres.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } }))
                    }]
                    : []
            ),

            ...(
                this.ganhosTreinadas.trocas.valorInicial > 0
                    ? [{ mensagem: `Troca Opcional de ${this.ganhosTreinadas.trocas.valorInicial} Perícia Treinada`, bloqueia: false, icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } }) }]
                    : []
            ),
            ...(
                this.ganhosVeteranas.trocas.valorInicial > 0
                    ? [{ mensagem: `Troca Opcional de ${this.ganhosVeteranas.trocas.valorInicial} Perícia Veterana`, bloqueia: false, icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } }) }]
                    : []
            ),
            ...(
                this.ganhosExperts.trocas.valorInicial > 0
                    ? [{ mensagem: `Troca Opcional de ${this.ganhosExperts.trocas.valorInicial} Perícia Expert`, bloqueia: false, icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } }) }]
                    : []
            ),
            ...(
                this.ganhosLivres.trocas.valorInicial > 0
                    ? [{ mensagem: `Troca Opcional de ${this.ganhosLivres.trocas.valorInicial} Perícia Livre`, bloqueia: false, icone: React.createElement(CircleIcon, { style: { color: '#D4AF17' } }) }]
                    : []
            ),

            ...this.pontosObrigatorios.map(ponto => ({
                mensagem: ponto.mensagem!,
                bloqueia: true,
                icone: ponto.iconeValidacao
            }))
        ];
    }

    constructor(valoresGanhoETrocaPropsTreinadas: ValoresGanhoETrocaProps, valoresGanhoETrocaPropsVeteranas: ValoresGanhoETrocaProps, valoresGanhoETrocaPropsExperts: ValoresGanhoETrocaProps, valoresGanhoETrocaPropsLivres: ValoresGanhoETrocaProps) {
        const ganhosTreinadas = new ValoresGanhoETroca(valoresGanhoETrocaPropsTreinadas.ganhos, valoresGanhoETrocaPropsTreinadas.trocas);
        const ganhosVeteranas = new ValoresGanhoETroca(valoresGanhoETrocaPropsVeteranas.ganhos, valoresGanhoETrocaPropsVeteranas.trocas);
        const ganhosExperts = new ValoresGanhoETroca(valoresGanhoETrocaPropsExperts.ganhos, valoresGanhoETrocaPropsExperts.trocas);
        const ganhosLivres = new ValoresGanhoETroca(valoresGanhoETrocaPropsLivres.ganhos, valoresGanhoETrocaPropsLivres.trocas);
        super(2, ganhosTreinadas.alterando || ganhosVeteranas.alterando || ganhosExperts.alterando || ganhosLivres.alterando);

        this.ganhosTreinadas = ganhosTreinadas;
        this.ganhosVeteranas = ganhosVeteranas;
        this.ganhosExperts = ganhosExperts;
        this.ganhosLivres = ganhosLivres;

        this.pericias = this._refFicha.periciasPatentes?.map(pericia_patente => new PericiaEmGanho(
            SingletonHelper.getInstance().pericias.find(pericia => pericia.id === pericia_patente.idPericia)!,
            pericia_patente.idPatente
        ))!;
    }

    get finalizado(): boolean {
        return (
            this.ganhosTreinadas.finalizado &&
            this.ganhosVeteranas.finalizado &&
            this.ganhosExperts.finalizado &&
            this.ganhosLivres.finalizado
        );
    }

    temPontosParaEssaPatente(pericia: PericiaEmGanho): boolean {
        switch (pericia.idPatenteAtual) {
            case 1:
                return this.ganhosTreinadas.ganhoTemPontos!;
            case 2:
                return this.ganhosVeteranas.ganhoTemPontos!;
            case 3:
                return this.ganhosExperts.ganhoTemPontos!;
            default:
                return false;
        }
    }

    deparaPericiaPatente(pericia: PericiaEmGanho): ValoresGanhoETroca | undefined {
        switch (pericia.refPatenteAtual.id) {
            case 2:
                return this.ganhosTreinadas;
            case 3:
                return this.ganhosVeteranas;
            case 4:
                return this.ganhosExperts;
        }
    }

    adicionaPonto(idPericia: number) {
        const pericia = this.pericias.find(pericia => pericia.refPericia.id === idPericia)!;
        
        pericia.alterarValor(1);
        
        const valorGanhoeETrocaPatenteAtual = this.deparaPericiaPatente(pericia);
        
        (pericia.refPatenteAtual.id < pericia.refPatenteInicial.id) ? valorGanhoeETrocaPatenteAtual!.realizaTroca() : valorGanhoeETrocaPatenteAtual!.realizaGanho();

        this.validaCondicoes();
    }

    subtraiPonto(idPericia: number) {
        const pericia = this.pericias.find(pericia => pericia.refPericia.id === idPericia)!;
        const valorGanhoeETrocaPatenteAntesSubtrair = this.deparaPericiaPatente(pericia);
        
        pericia.alterarValor(-1);
        
        valorGanhoeETrocaPatenteAntesSubtrair!.desrealizaGanho();

        this.validaCondicoes();
    }

    get pvGanhoIndividual(): number { return 0; }
    get peGanhoIndividual(): number { return 0; }
    get psGanhoIndividual(): number { return 0; }
}

export class GanhoIndividualNexEstatisticaFixa extends GanhoIndividualNex {
    public ganhoPv: number;
    public ganhoPs: number;
    public ganhoPe: number;
    public tituloEtapa = 'Ganho de Estatísticas';
    public avisoGanhoNex = [];

    obtemOpcaoAValidar(idOpcao: number): number {
        return 0;
    }

    constructor(ganhosEstatisticaProps: GanhosEstatisticaProps) {
        super(3, ganhosEstatisticaProps.pv > 0 || ganhosEstatisticaProps.ps > 0 || ganhosEstatisticaProps.pe > 0);
        this.ganhoPv = ganhosEstatisticaProps.pv;
        this.ganhoPs = ganhosEstatisticaProps.ps;
        this.ganhoPe = ganhosEstatisticaProps.pe;
    }

    get finalizado(): boolean { return true; }
    get pvGanhoIndividual(): number { return this.ganhoPv; }
    get psGanhoIndividual(): number { return this.ganhoPs; }
    get peGanhoIndividual(): number { return this.ganhoPe; }
}

export class GanhoIndividualNexEscolhaClasse extends GanhoIndividualNex {
    public idOpcaoEscolhida: number | undefined;
    public tituloEtapa = 'Escolha de Classe';

    constructor(escolha: boolean = false) {
        super(4, escolha);
    }

    public get avisoGanhoNex():AvisoGanhoNex[] {
        return [
            {
                mensagem: `Você precisa escolher sua Classe`,
                bloqueia: true,
                icone: (this.finalizado ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } })),
            },
        ];
    }

    obtemOpcaoAValidar(idOpcao: number): number {
        return 0;
    }

    setIdEscolhido(id: number) { this.idOpcaoEscolhida = id; }

    get finalizado(): boolean { return this.idOpcaoEscolhida !== undefined && this.idOpcaoEscolhida > 1; }
    get pvGanhoIndividual(): number { return 0; }
    get peGanhoIndividual(): number { return 0; }
    get psGanhoIndividual(): number { return 0; }
}

export class GanhoIndividualNexRitual extends GanhoIndividualNex {
    public numeroRituais: number;
    public dadosRituais: ArgsRitual[] = [];
    public tituloEtapa = 'Ganho de Rituais';
    public avisoGanhoNex = [];

    obtemOpcaoAValidar(idOpcao: number): number {
        return 0;
    }

    constructor(ganhoRitualProps: GanhoRitualProps) {
        super(5, ganhoRitualProps.numeroDeRituais > 0);
        this.numeroRituais = ganhoRitualProps.numeroDeRituais;
    }

    get finalizado(): boolean { return this.numeroRituais === this.dadosRituais.length; }
    get pvGanhoIndividual(): number { return 0; }
    get peGanhoIndividual(): number { return 0; }
    get psGanhoIndividual(): number { return 0; }
}

const controladorGanhos = new ControladorGanhos();
export const obterGanhosGerais = (idNivel: number, idClasse: number) => controladorGanhos.obterGanhosGerais(idNivel, idClasse);
export const obterGanhosEstatisticas = (idNivel: number) => controladorGanhos.obterGanhosEstatisticasDoAtributoPorClasse(idNivel);
export const obterGanhosObrigatorio = (idNivel: number, idClasse: number) => controladorGanhos.obterGanhoObrigatorio(idNivel, idClasse);