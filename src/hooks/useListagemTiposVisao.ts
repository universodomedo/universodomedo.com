import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

// Listagem do catálogo Tipos de Visão (Obstruível / Inobstruível …), consumida pelo editor de Estrutura para popular o seletor de Tipo de Visão da capacidade de Percepção Visual.
export function useListagemTiposVisao() {
    return useNoraGraphQLListagem('TipoVisao', {
        select: ['id', 'nome'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 100,
        carregando: 'Buscando Tipos de Visão',
        mensagemErro: 'Houve um erro recuperando os Tipos de Visão',
        mensagemListaVazia: 'Nenhum Tipo de Visão cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum Tipo de Visão encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
