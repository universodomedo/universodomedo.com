'use client';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

// Etapa 8: resolve em LOTE (uma consulta) os caminhos públicos das artes usadas pela composição. Operação ObtemVarios tipada de ArquivoTipadoArte com where id ∈ ids.
export function useArtesDaComposicaoTutorial(idsArte: readonly number[]): Map<number, string> {
    const listagem = useNoraGraphQLListagem('ArquivoTipadoArte', {
        select: ['id', 'dadosArteCapa'],
        itensPorPagina: 200,
        carregando: 'Buscando artes do Tutorial',
        mensagemErro: 'Houve um erro recuperando as artes do Tutorial',
        mensagemListaVazia: 'Nenhuma arte selecionada.',
        mensagemListaVaziaComFiltro: 'Nenhuma arte encontrada.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: () => ({ where: { id: { in: [...idsArte] } }, order: { id: 'DESC' }, limit: Math.max(idsArte.length, 1), offset: 0 }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    return new Map(listagem.registros.map(arte => [arte.id, arte.dadosArteCapa.caminhoArquivoArteCapa]));
};
