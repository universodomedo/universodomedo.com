'use client';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';

const SELECT_EDICAO = ['id', 'chaveTutorial', 'nome', 'ativo', { composicaoVisual: [{ passos: [{ blocos: ['tipo', 'markdown', 'idArquivoTipadoArte', { area: ['x', 'y', 'largura', 'altura'] }] }, 'textoBotaoVoltar', 'textoBotaoAvancar', 'textoBotaoConcluir', 'textoBotaoFechar'] }, 'larguraPercentual'] }] as const;

// Etapa 8: carga do Tutorial existente (edição) por GraphQL — 1 registro por PK, com a composição completa + largura.
export function useCargaTutorial(tutorialEmEdicaoId: number | null) {
    return useNoraGraphQLRegistro('Tutorial', { props: { id: tutorialEmEdicaoId ?? 0 }, pk: tutorialEmEdicaoId ?? 0, select: SELECT_EDICAO, carregando: 'Carregando Tutorial', mensagemErro: 'Houve um erro carregando o Tutorial', carregamento: 'BLOQUEIA_INTERFACE', executarAoMontar: tutorialEmEdicaoId !== null });
};
