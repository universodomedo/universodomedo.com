'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { GraphqlTypesGrupoAventura } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

interface Contexto__PaginaMestreAventuras__Props {
    listagemGruposAventuras: ReturnType<typeof obtemListagemGruposAventuras>;
    idGrupoAventuraSelecionada: number | null;
    setIdGrupoAventuraSelecionada: (idGrupoAventuraSelecionada: number | null) => void;
    deselecionaGrupoAventura: () => void;
};

const Contexto__PaginaMestreAventuras = createContext<Contexto__PaginaMestreAventuras__Props | undefined>(undefined);

export const useContexto__PaginaMestreAventuras = (): Contexto__PaginaMestreAventuras__Props => {
    const context = useContext(Contexto__PaginaMestreAventuras);
    if (!context) throw new Error('useContexto__PaginaMestreAventuras precisa estar dentro de um Contexto__PaginaMestreAventuras');
    return context;
};

export const Contexto__PaginaMestreAventuras__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemGruposAventuras = obtemListagemGruposAventuras();
    const [idGrupoAventuraSelecionada, setIdGrupoAventuraSelecionada] = useState<number | null>(null);

    const deselecionaGrupoAventura = useCallback(() => { setIdGrupoAventuraSelecionada(null); }, []);

    const value = useMemo<Contexto__PaginaMestreAventuras__Props>(() => ({
        listagemGruposAventuras,
        idGrupoAventuraSelecionada,
        setIdGrupoAventuraSelecionada,
        deselecionaGrupoAventura,
    }), [deselecionaGrupoAventura, idGrupoAventuraSelecionada, listagemGruposAventuras]);

    return (
        <Contexto__PaginaMestreAventuras.Provider value={value}>
            {children}
        </Contexto__PaginaMestreAventuras.Provider>
    );
};

//

function obtemListagemGruposAventuras() {
    return useNoraGraphQLListagem('GrupoAventura', {
        select: ['id', 'nome', 'nomeUnicoGrupoAventura', 'dadosArteCapa', 'detalhesSessoes'],
        itensPorPagina: 12,
        carregando: 'Buscando Aventuras',
        mensagemErro: 'Houve um erro recuperando suas Aventuras',
        mensagemListaVazia: 'Nenhuma aventura encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma aventura encontrada com os filtros atuais.',
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