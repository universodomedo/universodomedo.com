// #region Imports
import { Acao, Item, Opcao, OpcoesExecucao, Ritual } from 'Types/classes/index.ts';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export abstract class Requisito {
    constructor() { }
    abstract get requisitoCumprido(): boolean;
    abstract get descricaoRequisito(): string;

    public refAcao?: Acao;
    setRefAcao(value: Acao): this { return (this.refAcao = value, this); }
}

export class RequisitoComponente extends Requisito {
    constructor(public precisaEstarEmpunhando: boolean) { super(); }

    public refAcao?: Acao;
    setRefAcao(value: Acao): this { this.refAcao = value; return this; }

    get requisitoCumprido(): boolean {
        return (
            getPersonagemFromContext().inventario.items.some(item =>
                item.comportamentos.ehComponente && this.refAcao!.refPai instanceof Ritual &&
                item.comportamentos.comportamentoComponente.refElemento.id === this.refAcao!.refPai.comportamentos.comportamentoRitual.refElemento.id && 
                item.comportamentos.comportamentoComponente.refNivelComponente.id === this.refAcao!.refPai.comportamentos.comportamentoRitual.refNivelComponente.id
                && (this.precisaEstarEmpunhando && item.itemEstaEmpunhado)
            )
        )
    }

    get descricaoRequisito(): string {
        return !this.precisaEstarEmpunhando
            ? 'Necessário ter o Componente'
            : 'Necessário empunhar o Componente';
    }
}

export class RequisitoItemEmpunhado extends Requisito {
    constructor() { super(); }
    get requisitoCumprido(): boolean { return (this.refAcao!.refPai instanceof Item && this.refAcao!.refPai.itemEstaEmpunhado); }
    get descricaoRequisito(): string { return 'Necessário empunhar o Item da Ação'; }
}

// export class RequisitoItemGuardado extends Requisito {

// }

export class RequisitoExtremidadeDisponivel extends Requisito {
    constructor(public numeroExtremidades: number = 1) { super(); }
    get requisitoCumprido(): boolean { return getPersonagemFromContext().estatisticasBuffaveis.extremidades.some(extremidade => !extremidade.refItem); }
    get descricaoRequisito(): string { return 'Nessário Extremidade Disponível'; }
}

export class RequisitoAlgumItemGuardado extends Requisito {
    constructor() { super(); }
    get requisitoCumprido(): boolean { return getPersonagemFromContext().inventario.items.some(item => !item.itemEstaEmpunhado); }
    get descricaoRequisito(): string { return 'Necessário ter Item no Inventário'; }
}

export class RequisitoAlgumItemEmpunhado extends Requisito {
    constructor() { super(); }
    get requisitoCumprido(): boolean { return getPersonagemFromContext().inventario.items.some(item => item.itemEstaEmpunhado); }
    get descricaoRequisito(): string { return 'Necessário Empunhar algum Item'; }
}

export class RequisitoPodeSeLocomover extends Requisito {
    get requisitoCumprido(): boolean { return true; }
    get descricaoRequisito(): string { return 'Necessário Livre para se Locomover'; }
}

export class RequisitoAlgumItemEmpunhadoParaVestir extends Requisito {
    get requisitoCumprido(): boolean { return getPersonagemFromContext().inventario.items.some(item => item.itemPodeSerVestido); }
    get descricaoRequisito(): string { return 'Necessário Empunhar Item para Vestir'; }
}

export class RequisitoAlgumItemVestido extends Requisito {
    get requisitoCumprido(): boolean { return getPersonagemFromContext().inventario.items.some(item => item.itemEstaVestido); }
    get descricaoRequisito(): string { return 'Necessário ter Item Vestido'; }
}

export class TipoRequisito {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}

type RequisitoOption = { key: string; displayName: string; obterOpcoes: (acao: Acao) => Opcao[] };

export class RequisitoConfig {
    private static requisitoMap: Map<number, { 
        requisitoClass: new (...args: any[]) => Requisito, 
        requisitoParams: any[],
        opcoesExecucao: RequisitoOption[] 
    }> = new Map([
        [1, {
            requisitoClass: RequisitoComponente,
            requisitoParams: [true],
            opcoesExecucao: [
                {
                    key: 'idItemComponente',
                    displayName: 'Componente',
                    obterOpcoes: (acao: Acao) => {
                        return getPersonagemFromContext().inventario.items.filter(item =>
                            item.itemEstaEmpunhado && acao.refPai instanceof Ritual &&
                            item.comportamentos.ehComponente &&
                            item.comportamentos.comportamentoComponente.refElemento.id === acao.refPai.comportamentos.comportamentoRitual.refElemento.id &&
                            item.comportamentos.comportamentoComponente.refNivelComponente.id === acao.refPai.comportamentos.comportamentoRitual.refNivelComponente.id
                        ).reduce((acc: { key: number; value: string }[], cur) => {
                            acc.push({ key: cur.id, value: cur.nomeExibicao });
                            return acc;
                        }, []);
                        // return getPersonagemFromContext().inventario.items.filter(item => item.refExtremidade && item instanceof ItemComponente && item.detalhesComponente.refElemento.id === acaoRitual.refPai.refElemento.id && item.detalhesComponente.refNivelComponente.id === acaoRitual.refPai.refCirculoNivelRitual.idCirculo).reduce((acc: { key: number; value: string }[], cur) => {
                        //     acc.push({ key: cur.id, value: cur.nomeExibicaoOption });
                        //     return acc;
                        // }, []);
                    }
                }
            ]
        }],
        [2, {
            requisitoClass: RequisitoItemEmpunhado,
            requisitoParams: [],
            opcoesExecucao: [
                {
                    key: 'alvo',
                    displayName: 'Alvo da Ação',
                    obterOpcoes: (): Opcao[] => {
                        return [{ key: 1, value: 'Alguem bem atrás de você' }];
                    }
                }
            ]
        }],
        [3, {
            requisitoClass: RequisitoExtremidadeDisponivel,
            requisitoParams: [],
            opcoesExecucao: [],
        }],
        [4, {
            requisitoClass: RequisitoAlgumItemGuardado,
            requisitoParams: [],
            opcoesExecucao: [
                {
                    key: 'idItem',
                    displayName: 'Item Alvo',
                    obterOpcoes: (): Opcao[] => {
                        return getPersonagemFromContext().inventario.items.filter(item => item.itemEstaGuardado).reduce((acc: { key: number; value: string }[], cur) => {
                            acc.push({ key: cur.id, value: cur.nomeExibicao });
                            return acc;
                        }, [])
                    }
                }
            ]
        }],
        [5, {
            requisitoClass: RequisitoAlgumItemEmpunhado,
            requisitoParams: [],
            opcoesExecucao: [
                {
                    key: 'idItem',
                    displayName: 'Item Alvo',
                    obterOpcoes: (): Opcao[] => {
                        return getPersonagemFromContext().inventario.items.filter(item => item.itemEstaEmpunhado).reduce((acc: { key: number; value: string }[], cur) => {
                            acc.push({ key: cur.id, value: cur.nomeExibicao });
                            return acc;
                        }, [])
                    },
                }
            ]
        }],
        [6, {
            requisitoClass: RequisitoAlgumItemEmpunhadoParaVestir,
            requisitoParams: [],
            opcoesExecucao: [
                {
                    key: 'idItem',
                    displayName: 'Item Alvo',
                    obterOpcoes: (): Opcao[] => {
                        return getPersonagemFromContext().inventario.items.filter(item => item.itemPodeSerVestido && !item.itemEstaVestido).reduce((acc: { key: number; value: string }[], cur) => {
                            acc.push({ key: cur.id, value: cur.nomeExibicao });
                            return acc;
                        }, [])
                    },
                },
            ]
        }],
        [7, {
            requisitoClass: RequisitoAlgumItemVestido,
            requisitoParams: [],
            opcoesExecucao: [
                {
                    key: 'idItem',
                    displayName: 'Item Alvo',
                    obterOpcoes: (): Opcao[] => {
                        return getPersonagemFromContext().inventario.items.filter(item => item.itemEstaVestido).reduce((acc: { key: number; value: string }[], cur) => {
                            acc.push({ key: cur.id, value: cur.nomeExibicao });
                            return acc;
                        }, [])
                    },
                },
            ]
        }]
    ]);

    // Método para construir requisito e opções, incluindo `setRefAcao` e parâmetros adicionais
    static construirRequisitoEOpcoesPorId(id: number, acao: Acao) {
        const config = this.requisitoMap.get(id);
        if (!config) return null;

        // Cria o requisito com os parâmetros e chama `setRefAcao`
        const requisito = new config.requisitoClass(...config.requisitoParams).setRefAcao(acao);
        const opcoesExecucao = config.opcoesExecucao.map(opcao => 
            new OpcoesExecucao(opcao.key, opcao.displayName, () => opcao.obterOpcoes(acao))
        );

        return { requisito, opcoesExecucao };
    }
}