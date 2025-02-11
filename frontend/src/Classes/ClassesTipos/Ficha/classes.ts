import { DadosAtributoPersonagem, DadosEstatisticaDanificavelPersonagem, DadosPericiaPatentePersonagem, DadosReducaoDano, DadosRitual } from "Classes/ClassesTipos/index.ts";

export type RLJ_Ficha2 = {
    detalhes: { nome: string, idClasse: number, idNivel: number },
    estatisticasDanificaveis: DadosEstatisticaDanificavelPersonagem[],
    estatisticasBuffaveis: { id: number, valor: number }[],
    atributos: DadosAtributoPersonagem[],
    periciasPatentes: DadosPericiaPatentePersonagem[],
    rituais: DadosRitual[],
    habilidadesEspeciais?: PropsHabilidades[],
    inventario: ArgsItem[],
    reducoesDano: DadosReducaoDano[],
    pendencias: { idNivelEsperado: number },
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
    // custos: subDadosCusto,
    modificadores?: PropsModificador[],
    requisitos: number[]
};

export type DadosComportamentosAcao = {
    dadosComportamentoCustoAcao?: ConstructorParameters<typeof ComportamentoCustoAcao>[0];
    dadosComportamentoDificuldadeAcao?: ConstructorParameters<typeof ComportamentoDificuldadeAcao>[0];
    dadosComportamentoAcao?: ConstructorParameters<typeof ComportamentoAcao>[0];
    dadosComportamentoRequisito?: ConstructorParameters<typeof RequisitoUso>[0][];
    dadosComportamentoConsomeUso?: ConstructorParameters<typeof ComportamentoConsomeUso>;
    dadosComportamentoConsomeMunicao?: ConstructorParameters<typeof ComportamentoConsomeMunicao>;
};

export type DadosAcaoCustomizada = {
    condicaoListaItems: (item: Item) => boolean;
    executarAcaoItem: (item: Item) => void;
}

export type ArgsRitual = {
    // args: ConstructorParameters<typeof DadosGenericosRitual>[0],
    dadosComportamentos: DadosComportamentosRitual;
    dadosAcoes: ArgsAcao[]
};

export type DadosComportamentosRitual = {
    dadosComportamentoRitual?: ConstructorParameters<typeof ComportamentoRitual>[0];
};

export type PropsHabilidades = {
    props: ConstructorParameters<typeof DadosGenericosHabilidade>[0],
}


// --- //






export type subDadosCusto = {
    custoPE?: { valor: number }, custoExecucao?: { idExecucao: number, valor: number }[], custoComponente?: boolean
}

export type PropsModificador = {
    props: ConstructorParameters<typeof Modificador>[0],
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
    modificadores: { renderizar: true, renderizarValor: (dados) => dados.modificadores?.map(modificador => `Modificador: ${modificador.props.nome}`).join(", ") || null, },

    reducaoPatenteSimplificada: { renderizar: false, renderizarValor: (dados) => null }
};

export const renderizarObjetoDadosCaracteristicasArmas = (dados: DadosCaracteristicasArmas): string[] => {
    return Object.entries(ConfiguracoesExibicaoDadosCaracteristicasArmas)
        .filter(([, config]) => config.renderizar)
        .map(([, config]) => config.renderizarValor(dados))
        .filter((resultado) => resultado !== null) as string[];
};