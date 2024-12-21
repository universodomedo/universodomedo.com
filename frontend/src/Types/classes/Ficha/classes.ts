// #region Imports
import { DetalhesItem } from 'Types/classes/index.ts';
// #endregion

export type RLJ_Ficha2 = {
    detalhes?: { nome: string, idClasse: number, idNivel: number },
    estatisticasBuffaveis?: { id: number, valor: number }[],
    estatisticasDanificaveis?: { id: number, valorMaximo: number, valor: number }[],
    atributos?: { id: number, valor: number }[],
    periciasPatentes?: { idPericia: number, idPatente: number }[],
    rituais: dadosRitual[],
    inventario: dadosItem[],
    // reducoesDano:
}

export type dadosRitual = {
    nomeRitual: string, idCirculoNivel: number, idElemento: number,
    dadosAcoes: subDadosAcoes[]
};

export type dadosItem = {
    idTipoItem: number, nomeItem: { nomePadrao: string, nomeCustomizado?: string }, peso: number, categoria: number,
    detalhesItem?: DetalhesItem,
    detalhesArma?: subDadosDetalhesArmas, detalhesEquipamentos?: subDadosDetalhesEquipamentos, detalhesConsumiveis?: subDadosDetalhesConsumiveis, detalhesComponente?: subDadosDetalhesComponentes,
    dadosAcoes?: subDadosAcoes[]
    buffs?: subDadosBuff[],
};

export type subDadosAcoes = {
    nomeAcao: string, idTipoAcao: number, idCategoriaAcao: number, idMecanica: number,
    custos: subDadosCusto,
    buffs?: subDadosBuff[],
    requisitos: number[]
}

export type subDadosCusto = {
    custoPE?: { valor: number }, custoExecucao?: { idExecucao: number, valor: number }[], custoComponente?: boolean
}

export type subDadosBuff = {
    idBuff: number, nome: string, valor: number, duracao: { idDuracao: number, valor: number, }, idTipoBuff: number
}

export type subDadosDetalhesArmas = {
    danoMin: number, danoMax: number, numeroExtremidadesUtilizadas: number, idAtributoUtilizado: number, idPericiaUtilizada: number,
    // variancia: number,
}

export type subDadosDetalhesEquipamentos = {}

export type subDadosDetalhesConsumiveis = {
    usosMaximos: number, usos: number
}

export type subDadosDetalhesComponentes = {
    idElemento: number, idNivelComponente: number, usosMaximos: number, usos: number
}