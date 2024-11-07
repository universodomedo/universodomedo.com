// #region Imports
// #endregion

export type RLJ_Ficha2 = {
    detalhes?: { nome: string, idClasse: number, idNivel: number },
    estatisticasBuffaveis?: { id: number, valor: number }[],
    estatisticasDanificaveis?: { id: number, valorMaximo: number, valor: number }[],
    atributos?: { id: number, valor: number }[],
    periciasPatentes?: { idPericia: number, idPatente: number }[],
    rituais: dadosRitual[],
    // reducoesDano:
}

export type dadosRitual = {
    nomeRitual: string, idCirculoNivel: number, idElemento: number,
    dadosAcao: {
        nomeAcao: string, idTipoAcao: number, idCateoriaAcao: number, idMecanica: number,
        custos: { custoPE?: { valor: number }, custoExecucao?: { idExecucao: number, valor: number }[], custoComponente?: boolean },
        buff: { idBuff: number, nome: string, valor: number, duracao: { idDuracao: number, valor: number, }, idTipoBuff: number },
        requisitos: number[]
    }[]
};