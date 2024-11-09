// #region Imports
import { DetalhesItemArma, Item, NomeItem } from 'Types/classes/index.ts';
// #endregion

export type RLJ_Ficha2 = {
    detalhes?: { nome: string, idClasse: number, idNivel: number },
    estatisticasBuffaveis?: { id: number, valor: number }[],
    estatisticasDanificaveis?: { id: number, valorMaximo: number, valor: number }[],
    atributos?: { id: number, valor: number }[],
    periciasPatentes?: { idPericia: number, idPatente: number }[],
    rituais: dadosRitual[],
    inventario: dadosItens[],
    // reducoesDano:
}

export type dadosRitual = {
    nomeRitual: string, idCirculoNivel: number, idElemento: number,
    dadosAcoes: subDadosAcoes[]
};

export type dadosItens = {
    idTipoItem: number, nomeItem: { nomePadrao: string, nomeCustomizado?: string }, peso: number, categoria: number, precisaEstarEmpunhando?: boolean,
    detalhesArma?: subDadosDetalhesArmas, detalhesEquipamentos?: subDadosDetalhesEquipamentos, detalhesConsumiveis?: subDadosDetalhesConsumiveis, detalhesComponente?: subDadosDetalhesComponentes,
    dadosAcoes?: subDadosAcoes[]
    buffs?: subDadosBuff[],
};

export type subDadosAcoes = {
    nomeAcao: string, idTipoAcao: number, idCateoriaAcao: number, idMecanica: number,
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
    dano: number, variancia: number, numeroExtremidadesUtilizadas: number, idAtributoUtilizado: number, idPericiaUtilizada: number
}

export type subDadosDetalhesEquipamentos = {}

export type subDadosDetalhesConsumiveis = {}

export type subDadosDetalhesComponentes = {
    idElemento: number, idNivelComponente: number, usosMaximos: number, usos: number
}