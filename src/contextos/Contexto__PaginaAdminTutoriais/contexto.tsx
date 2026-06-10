'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';

type FluxoPaginaAdminTutoriais = 'LISTAGEM' | 'EDITOR';

export interface Contexto__PaginaAdminTutoriais__Props {
    estadoFluxo: FluxoPaginaAdminTutoriais;
    tutorialEmEdicaoId: number | null;
    listagemTutoriais: ReturnType<typeof useListagemTutoriais>;
    iniciaCriacao: () => void;
    iniciaEdicao: (id: number) => void;
    voltarParaListagem: () => void;
    concluiSalvamento: () => void;
};

const Contexto__PaginaAdminTutoriais = createContext<Contexto__PaginaAdminTutoriais__Props | undefined>(undefined);

export const useContexto__PaginaAdminTutoriais = (): Contexto__PaginaAdminTutoriais__Props => {
    const context = useContext(Contexto__PaginaAdminTutoriais);
    if (!context) throw new Error('useContexto__PaginaAdminTutoriais precisa estar dentro de um Contexto__PaginaAdminTutoriais');
    return context;
};

export const Contexto__PaginaAdminTutoriais__Provider = ({ children }: { children: ReactNode; }) => {
    const listagemTutoriais = useListagemTutoriais();
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoPaginaAdminTutoriais>('LISTAGEM');
    const [tutorialEmEdicaoId, setTutorialEmEdicaoId] = useState<number | null>(null);

    const iniciaCriacao = useCallback(() => { setTutorialEmEdicaoId(null); setEstadoFluxo('EDITOR'); }, []);
    const iniciaEdicao = useCallback((id: number) => { setTutorialEmEdicaoId(id); setEstadoFluxo('EDITOR'); }, []);
    const voltarParaListagem = useCallback(() => { setTutorialEmEdicaoId(null); setEstadoFluxo('LISTAGEM'); }, []);
    const recarregarListagem = listagemTutoriais.recarregar;
    const concluiSalvamento = useCallback(() => { recarregarListagem(); setTutorialEmEdicaoId(null); setEstadoFluxo('LISTAGEM'); }, [recarregarListagem]);

    return (
        <Contexto__PaginaAdminTutoriais.Provider value={{ estadoFluxo, tutorialEmEdicaoId, listagemTutoriais, iniciaCriacao, iniciaEdicao, voltarParaListagem, concluiSalvamento }}>
            {children}
        </Contexto__PaginaAdminTutoriais.Provider>
    );
};

function useListagemTutoriais() {
    return useNoraGraphQLListagem('Tutorial', {
        select: ['id', 'chaveTutorial', 'nome', 'ativo', 'quantidadePassos'],
        camposFiltroConsulta: ['nome', 'chaveTutorial', 'ativo'],
        camposFiltroVisualizacao: ['nome', 'chaveTutorial', 'ativo'],
        itensPorPagina: 12,
        carregando: 'Buscando Tutoriais',
        mensagemErro: 'Houve um erro recuperando os Tutoriais',
        mensagemListaVazia: 'Nenhum tutorial cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum tutorial encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
