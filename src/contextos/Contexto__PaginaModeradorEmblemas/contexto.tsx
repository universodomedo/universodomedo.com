'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

interface Contexto__PaginaModeradorEmblemas__Props {
    listagemEmblemas: ReturnType<typeof obtemListagemEmblemas>;
    setIdEmblemaSelecionada: (idEmblemaSelecionada: number | null) => void;
    deselecionaEmblema: () => void;
    emblemaSelecionado: ReturnType<typeof obtemListagemEmblemas>['registros'][number] | null
};

const Contexto__PaginaModeradorEmblemas = createContext<Contexto__PaginaModeradorEmblemas__Props | undefined>(undefined);

export const useContexto__PaginaModeradorEmblemas = (): Contexto__PaginaModeradorEmblemas__Props => {
    const context = useContext(Contexto__PaginaModeradorEmblemas);
    if (!context) throw new Error('useContexto__PaginaModeradorEmblemas precisa estar dentro de um Contexto__PaginaModeradorEmblemas');
    return context;
};

export const Contexto__PaginaModeradorEmblemas__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemEmblemas = obtemListagemEmblemas();
    const [idEmblemaSelecionada, setIdEmblemaSelecionada] = useState<number | null>(null);

    const emblemaSelecionado = idEmblemaSelecionada ? listagemEmblemas.registros.find(emblema => emblema.id === idEmblemaSelecionada) ?? null : null;

    const deselecionaEmblema = useCallback(() => { setIdEmblemaSelecionada(null); }, []);

    return (
        <Contexto__PaginaModeradorEmblemas.Provider value={{ listagemEmblemas, setIdEmblemaSelecionada, deselecionaEmblema, emblemaSelecionado }}>
            {children}
        </Contexto__PaginaModeradorEmblemas.Provider>
    );
};

//

function obtemListagemEmblemas() {
    return useNoraGraphQLListagem('Emblema', {
        select: ['id', 'nome', 'nomeVisual', 'arquivosVisualizacao', 'temArquivoPendente'],
        itensPorPagina: 12,
        carregando: 'Buscando Emblemas',
        mensagemErro: 'Houve um erro recuperando suas Emblemas',
        mensagemListaVazia: 'Nenhum emblma encontrado.',
        mensagemListaVaziaComFiltro: 'Nenhum emblma encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where,
            order: { id: 'DESC' },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};