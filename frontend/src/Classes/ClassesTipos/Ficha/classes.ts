import { DadosAtributoPersonagem, DadosEstatisticaDanificavelPersonagem, DadosInventario, DadosPericiaPatentePersonagem, DadosReducaoDano, DadosRitual } from "Classes/ClassesTipos/index.ts";

export type RLJ_Ficha2 = {
    detalhes: { nome: string, idClasse: number, idNivel: number },
    estatisticasDanificaveis: DadosEstatisticaDanificavelPersonagem[],
    estatisticasBuffaveis: { id: number, valor: number }[],
    atributos: DadosAtributoPersonagem[],
    periciasPatentes: DadosPericiaPatentePersonagem[],
    rituais: DadosRitual[],
    // habilidadesEspeciais?: PropsHabilidades[],
    inventario: DadosInventario,
    reducoesDano: DadosReducaoDano[],
    pendencias: { idNivelEsperado: number },
    dadosPersonagemEmExecucao: dadosPersonagemEmExecucao;
};

export type dadosPersonagemEmExecucao = {
    listaCodigoUnicoItensEquipados: string[];
};

// export type DadosCaracteristicasArmas = {
//     modificadorPeso?: number,
//     modificadorCategoria?: number,
//     modificadorDanoMinimo?: number,
//     modificadorDanoMaximo?: number,
//     acoes?: ArgsAcao[],
//     modificadores?: PropsModificador[],
//     // temporario mas tlvz fique assim pra sempre, sim
//     reducaoPatenteSimplificada?: boolean,
// }

// export const ConfiguracoesExibicaoDadosCaracteristicasArmas: { [K in keyof DadosCaracteristicasArmas]: { renderizar: boolean; renderizarValor: (dados: DadosCaracteristicasArmas) => string | null; }; } = {
//     modificadorPeso: { renderizar: true, renderizarValor: (dados) => (dados.modificadorPeso ? `Peso: ${dados.modificadorPeso}` : null), },
//     modificadorCategoria: { renderizar: true, renderizarValor: (dados) => (dados.modificadorCategoria ? `Categoria: ${dados.modificadorCategoria}` : null), },
//     modificadorDanoMinimo: { renderizar: true, renderizarValor: (dados) => (dados.modificadorDanoMinimo ? `Dano Mínimo: ${dados.modificadorDanoMinimo}` : null), },
//     modificadorDanoMaximo: { renderizar: true, renderizarValor: (dados) => (dados.modificadorDanoMaximo ? `Dano Máximo: ${dados.modificadorDanoMaximo}` : null), },
//     acoes: { renderizar: true, renderizarValor: (dados) => dados.acoes?.map(acao => `Ação: ${acao.args.nome}`).join(", ") || null, },
//     modificadores: { renderizar: true, renderizarValor: (dados) => dados.modificadores?.map(modificador => `Modificador: ${modificador.props.nome}`).join(", ") || null, },

//     reducaoPatenteSimplificada: { renderizar: false, renderizarValor: (dados) => null }
// };

// export const renderizarObjetoDadosCaracteristicasArmas = (dados: DadosCaracteristicasArmas): string[] => {
//     return Object.entries(ConfiguracoesExibicaoDadosCaracteristicasArmas)
//         .filter(([, config]) => config.renderizar)
//         .map(([, config]) => config.renderizarValor(dados))
//         .filter((resultado) => resultado !== null) as string[];
// };