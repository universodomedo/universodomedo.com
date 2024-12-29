// #region Imports
import { Acao, Buff, ComportamentoAcao, ComportamentoAtributoPericia, ComportamentoBuffAtivo, ComportamentoBuffPassivo, ComportamentoComponente, ComportamentoEmpunhavel, ComportamentoRequisito, ComportamentoRitual, ComportamentosBuff, ComportamentoUtilizavel, ComportamentoVestivel } from 'Types/classes/index.ts';
// #endregion

export type RLJ_Ficha2 = {
    detalhes?: { nome: string, idClasse: number, idNivel: number },
    estatisticasBuffaveis?: { id: number, valor: number }[],
    estatisticasDanificaveis?: { id: number, valorMaximo: number, valor: number }[],
    atributos?: { id: number, valor: number }[],
    periciasPatentes?: { idPericia: number, idPatente: number }[],
    rituais: dadosRitual[],
    inventario: DadosItem[],
    // reducoesDano:
}

export type DadosItem = {
    idTipoItem: number; nomeItem: { nomePadrao: string, nomeCustomizado?: string }; peso: number; categoria: number;

    dadosComportamentos: DadosComportamentos;

    dadosAcoes?: subDadosAcoes[];
    buffs?: subDadosBuff[];
}

export type DadosComportamentos = {
    dadosComportamentoUtilizavel?: ConstructorParameters<typeof ComportamentoUtilizavel>;
    dadosComportamentoEmpunhavel?: ConstructorParameters<typeof ComportamentoEmpunhavel>;
    dadosComportamentoVestivel?: ConstructorParameters<typeof ComportamentoVestivel>;
    dadosComportamentoComponente?: ConstructorParameters<typeof ComportamentoComponente>;
    dadosComportamentoAcao?: ConstructorParameters<typeof ComportamentoAcao>;
    dadosComportamentoAtributoPericia?: ConstructorParameters<typeof ComportamentoAtributoPericia>;
    dadosComportamentoRitual?: ConstructorParameters<typeof ComportamentoRitual>;
    dadosComportamentoRequisito?: ConstructorParameters<typeof ComportamentoRequisito>;
};

export type DadosComportamentosBuff = {
    dadosComportamentoAtivo?: ConstructorParameters<typeof ComportamentoBuffAtivo>;
    dadosComportamentoPassivo?: ConstructorParameters<typeof ComportamentoBuffPassivo>;
};

export type dadosRitual = {
    nomeRitual: string,
    dadosComportamentos: DadosComportamentos;
    dadosAcoes: subDadosAcoes[]
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
    idBuff: number, nome: string, valor: number,
    dadosComportamentos: DadosComportamentosBuff;
    duracao: { idDuracao: number, valor: number, }, idTipoBuff: number
}

export type DadosCaracteristicasArmas = {
    modificadorPeso?: number,
    modificadorCategoria?: number,
    modificadorDanoMinimo?: number,
    modificadorDanoMaximo?: number,
    acoes?: subDadosAcoes[],
    buffs?: subDadosBuff[],
}

export const ConfiguracoesExibicaoDadosCaracteristicasArmas: { [K in keyof DadosCaracteristicasArmas]: { renderizar: boolean; renderizarValor: (dados: DadosCaracteristicasArmas) => string | null; }; } = {
    modificadorPeso: { renderizar: true, renderizarValor: (dados) => (dados.modificadorPeso ? `Peso: ${dados.modificadorPeso}` : null), },
    modificadorCategoria: { renderizar: true, renderizarValor: (dados) => (dados.modificadorCategoria ? `Categoria: ${dados.modificadorCategoria}` : null), },
    modificadorDanoMinimo: { renderizar: true, renderizarValor: (dados) => (dados.modificadorDanoMinimo ? `Dano Mínimo: ${dados.modificadorDanoMinimo}` : null), },
    modificadorDanoMaximo: { renderizar: true, renderizarValor: (dados) => (dados.modificadorDanoMaximo ? `Dano Máximo: ${dados.modificadorDanoMaximo}` : null), },
    acoes: { renderizar: true, renderizarValor: (dados) => dados.acoes?.map(acao => `Ação: ${acao.nomeAcao}`).join(", ") || null, },
    buffs: { renderizar: true, renderizarValor: (dados) => dados.buffs?.map(buff => `Buff: ${buff.nome}`).join(", ") || null, },
};

export const renderizarObjetoDadosCaracteristicasArmas = (dados: DadosCaracteristicasArmas): string[] => {
    return Object.entries(ConfiguracoesExibicaoDadosCaracteristicasArmas)
        .filter(([, config]) => config.renderizar)
        .map(([, config]) => config.renderizarValor(dados))
        .filter((resultado) => resultado !== null) as string[];
};