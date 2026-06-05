import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

export function useListagemCapacidadesFuncionais() {
    return useNoraGraphQLListagem('CapacidadeFuncional', {
        select: ['id', 'key', 'nome', 'ativa', { estruturaResumo: ['naturezasFuncionaisTexto', 'quantidadeParametrosAceitos', 'quantidadeParametrosFuncionais', 'quantidadeRequisitosEstruturais', 'quantidadeCondicoesFuncionais', 'quantidadeOperacoesFuncionais', 'quantidadeEfeitosPassivos', 'quantidadeEstadosBloqueiosPublicos'] }] as const,
        camposFiltroConsulta: ['key', 'nome', 'ativa'],
        camposFiltroVisualizacao: ['key', 'nome', 'ativa'],
        itensPorPagina: 12,
        carregando: 'Buscando Capacidades Funcionais',
        mensagemErro: 'Houve um erro recuperando as Capacidades Funcionais',
        mensagemListaVazia: 'Nenhuma capacidade funcional cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma capacidade funcional encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

export type RegistroCapacidadeFuncional = ReturnType<typeof useListagemCapacidadesFuncionais>['registros'][number];
