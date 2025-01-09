// #region Imports
import { Acao, ComportamentoAcao, ComportamentoBuffAtivo, ComportamentoBuffPassivo, ComportamentoComponente, ComportamentoConsomeMunicao, ComportamentoConsomeUso, ComportamentoEmpunhavel, ComportamentoMunicao, ComportamentoRequisito, ComportamentoRitual, ComportamentosBuff, ComportamentoUsoAcao, ComportamentoUtilizavel, ComportamentoVestivel, DadosGenericosAcao, DadosGenericosItem, DadosGenericosRitual, Modificador, RequisitoMunicao, RequisitoUso } from 'Types/classes/index.ts';
// #endregion

export type RLJ_Ficha2 = {
    detalhes?: { nome: string, idClasse: number, idNivel: number },
    estatisticasBuffaveis?: { id: number, valor: number }[],
    estatisticasDanificaveis?: { id: number, valorMaximo: number, valor: number }[],
    atributos?: { id: number, valor: number }[],
    periciasPatentes?: { idPericia: number, idPatente: number }[],
    rituais?: ArgsRitual[],
    inventario?: ArgsItem[],
    // reducoesDano:
}

export type ArgsItem = {
    args: ConstructorParameters<typeof DadosGenericosItem>[0],
    dadosComportamentos: DadosComportamentosItem;

    dadosAcoes?: ArgsAcao[];
    modificadores?: PropsModificador[];
};

export type DadosComportamentosItem = {
    dadosComportamentoEmpunhavel?: ConstructorParameters<typeof ComportamentoEmpunhavel>;
    dadosComportamentoVestivel?: ConstructorParameters<typeof ComportamentoVestivel>;
    dadosComportamentoComponente?: ConstructorParameters<typeof ComportamentoComponente>;
    dadosComportamentoUtilizavel?: ConstructorParameters<typeof ComportamentoUtilizavel>;
    dadosComportamentoMunicao?: ConstructorParameters<typeof RequisitoMunicao>[];
};

export type ArgsAcao = {
    args: ConstructorParameters<typeof DadosGenericosAcao>[0],
    dadosComportamentos: DadosComportamentosAcao;
    custos: subDadosCusto,
    modificadores?: PropsModificador[],
    requisitos: number[]
};

export type DadosComportamentosAcao = {
    dadosComportamentoAcao?: ConstructorParameters<typeof ComportamentoAcao>;
    dadosComportamentoRequisito?: ConstructorParameters<typeof RequisitoUso>[];
    dadosComportamentoConsomeUso?: ConstructorParameters<typeof ComportamentoConsomeUso>;
    dadosComportamentoConsomeMunicao?: ConstructorParameters<typeof ComportamentoConsomeMunicao>;
    dadosComportamentoUsoAcao?: ConstructorParameters<typeof ComportamentoUsoAcao>;
};

export type ArgsRitual = {
    args: ConstructorParameters<typeof DadosGenericosRitual>[0],
    dadosComportamentos: DadosComportamentosRitual;
    dadosAcoes: ArgsAcao[]
};

export type DadosComportamentosRitual = {
    dadosComportamentoRitual?: ConstructorParameters<typeof ComportamentoRitual>;
};


// --- //














export type DadosComportamentosBuff = {
    dadosComportamentoAtivo?: ConstructorParameters<typeof ComportamentoBuffAtivo>;
    dadosComportamentoPassivo?: ConstructorParameters<typeof ComportamentoBuffPassivo>;
};



export type subDadosCusto = {
    custoPE?: { valor: number }, custoExecucao?: { idExecucao: number, valor: number }[], custoComponente?: boolean
}

export type PropsModificador = {
    props: ConstructorParameters<typeof Modificador>[0]
    // idBuff: number, nome: string, valor: number,
    // dadosComportamentos: DadosComportamentosBuff;
    // duracao: { idDuracao: number, valor: number, }, idTipoBuff: number
}

export type DadosCaracteristicasArmas = {
    modificadorPeso?: number,
    modificadorCategoria?: number,
    modificadorDanoMinimo?: number,
    modificadorDanoMaximo?: number,
    acoes?: ArgsAcao[],
    modificadores?: PropsModificador[],
    // temporario mas tlvz fique assim pra sempre, sim
    reducaoPatenteSimplificada?: boolean,
}

export const ConfiguracoesExibicaoDadosCaracteristicasArmas: { [K in keyof DadosCaracteristicasArmas]: { renderizar: boolean; renderizarValor: (dados: DadosCaracteristicasArmas) => string | null; }; } = {
    modificadorPeso: { renderizar: true, renderizarValor: (dados) => (dados.modificadorPeso ? `Peso: ${dados.modificadorPeso}` : null), },
    modificadorCategoria: { renderizar: true, renderizarValor: (dados) => (dados.modificadorCategoria ? `Categoria: ${dados.modificadorCategoria}` : null), },
    modificadorDanoMinimo: { renderizar: true, renderizarValor: (dados) => (dados.modificadorDanoMinimo ? `Dano Mínimo: ${dados.modificadorDanoMinimo}` : null), },
    modificadorDanoMaximo: { renderizar: true, renderizarValor: (dados) => (dados.modificadorDanoMaximo ? `Dano Máximo: ${dados.modificadorDanoMaximo}` : null), },
    acoes: { renderizar: true, renderizarValor: (dados) => dados.acoes?.map(acao => `Ação: ${acao.args.nome}`).join(", ") || null, },
    modificadores: { renderizar: true, renderizarValor: (dados) => dados.modificadores?.map(modificador => `Efeito: ${modificador.props.nome}`).join(", ") || null, },

    reducaoPatenteSimplificada: { renderizar: false, renderizarValor: (dados) => null }
};

export const renderizarObjetoDadosCaracteristicasArmas = (dados: DadosCaracteristicasArmas): string[] => {
    return Object.entries(ConfiguracoesExibicaoDadosCaracteristicasArmas)
        .filter(([, config]) => config.renderizar)
        .map(([, config]) => config.renderizarValor(dados))
        .filter((resultado) => resultado !== null) as string[];
};