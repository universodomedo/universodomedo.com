import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

export type RegistroAcaoInata = ReturnType<typeof useListagemAcoesInatas>['registros'][number];
export type RegistroCapacidadeInata = ReturnType<typeof useListagemCapacidadesInatas>['registros'][number];
export type RegistroTipoSer = ReturnType<typeof useListagemTiposSeres>['registros'][number];

export function useListagemAcoesInatas() {
    return useNoraGraphQLListagem('AcaoInata', {
        select: ['id', 'nome', 'chave', 'descricao', 'categoria', 'parametros', 'ativo'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 12,
        carregando: 'Buscando Ações Inatas',
        mensagemErro: 'Houve um erro recuperando as Ações Inatas',
        mensagemListaVazia: 'Nenhuma ação inata cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma ação inata encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

export function useListagemCapacidadesInatas() {
    return useNoraGraphQLListagem('CapacidadeInata', {
        select: ['id', 'nome', 'chave', 'descricao', 'origemCorporal', 'quantidade', 'observacoes', 'acoes', 'ativo'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 12,
        carregando: 'Buscando Capacidades Inatas',
        mensagemErro: 'Houve um erro recuperando as Capacidades Inatas',
        mensagemListaVazia: 'Nenhuma capacidade inata cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma capacidade inata encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

export function useListagemTiposSeres() {
    return useNoraGraphQLListagem('TipoSer', {
        select: ['id', 'nome', 'chave', 'descricao', 'tamanho', 'pesoKg', 'limiteCargaKg', 'raciocinio', 'comunicacao', 'capacidades', 'ativo'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 12,
        carregando: 'Buscando Tipos de Ser',
        mensagemErro: 'Houve um erro recuperando os Tipos de Ser',
        mensagemListaVazia: 'Nenhum tipo de ser cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum tipo de ser encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};