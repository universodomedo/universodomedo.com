'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { editaPaginaNavegacao } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export type RegistroPaginaNavegacao = ReturnType<typeof obtemListagemPaginas>['registros'][number];

export interface Contexto__PaginaAdminGestaoNavegacao__Props {
    listagemPaginas: ReturnType<typeof obtemListagemPaginas>;
    paginaSelecionada: RegistroPaginaNavegacao | null;
    editando: boolean;
    idMusicaAtual: number | null;
    ativoAtual: boolean;
    selecionarPagina: (pagina: RegistroPaginaNavegacao) => void;
    voltar: () => void;
    iniciarEdicao: () => void;
    voltarParaVisao: () => void;
    salvarMusica: (idMusica: number | null) => Promise<void>;
    definirAtivo: (ativo: boolean) => Promise<void>;
};

const Contexto__PaginaAdminGestaoNavegacao = createContext<Contexto__PaginaAdminGestaoNavegacao__Props | undefined>(undefined);

export const useContexto__PaginaAdminGestaoNavegacao = (): Contexto__PaginaAdminGestaoNavegacao__Props => {
    const context = useContext(Contexto__PaginaAdminGestaoNavegacao);
    if (!context) throw new Error('useContexto__PaginaAdminGestaoNavegacao precisa estar dentro de um Contexto__PaginaAdminGestaoNavegacao');
    return context;
};

export const Contexto__PaginaAdminGestaoNavegacao__Provider = ({ children }: { children: React.ReactNode }) => {
    const listagemPaginas = obtemListagemPaginas();
    const [paginaSelecionada, setPaginaSelecionada] = useState<RegistroPaginaNavegacao | null>(null);
    const [editando, setEditando] = useState<boolean>(false);
    const [idMusicaAtual, setIdMusicaAtual] = useState<number | null>(null);
    const [ativoAtual, setAtivoAtual] = useState<boolean>(true);

    const selecionarPagina = useCallback((pagina: RegistroPaginaNavegacao) => { setPaginaSelecionada(pagina); setIdMusicaAtual(pagina.idMusicaPagina); setAtivoAtual(pagina.ativo); setEditando(false); }, []);
    const voltar = useCallback(() => { setPaginaSelecionada(null); setEditando(false); }, []);
    const iniciarEdicao = useCallback(() => setEditando(true), []);
    const voltarParaVisao = useCallback(() => setEditando(false), []);
    const salvarMusica = useCallback(async (idMusica: number | null): Promise<void> => {
        if (paginaSelecionada === null) return;
        await editaPaginaNavegacao(paginaSelecionada.id, { idMusicaPagina: idMusica });
        setIdMusicaAtual(idMusica);
        setEditando(false);
    }, [paginaSelecionada]);
    const definirAtivo = useCallback(async (ativo: boolean): Promise<void> => {
        if (paginaSelecionada === null) return;
        await editaPaginaNavegacao(paginaSelecionada.id, { ativo });
        setAtivoAtual(ativo);
    }, [paginaSelecionada]);

    return (
        <Contexto__PaginaAdminGestaoNavegacao.Provider value={{ listagemPaginas, paginaSelecionada, editando, idMusicaAtual, ativoAtual, selecionarPagina, voltar, iniciarEdicao, voltarParaVisao, salvarMusica, definirAtivo }}>
            {children}
        </Contexto__PaginaAdminGestaoNavegacao.Provider>
    );
};

//

function obtemListagemPaginas() {
    return useNoraGraphQLListagem('PaginaNavegacao', {
        select: ['id', 'label', 'chave', 'template', 'idMusicaPagina', 'ativo'],
        camposFiltroConsulta: ['label', 'chave', 'ativo'],
        camposFiltroVisualizacao: ['label', 'chave', 'ativo'],
        itensPorPagina: 200,
        carregando: 'Buscando páginas',
        mensagemErro: 'Houve um erro recuperando as páginas',
        mensagemListaVazia: 'Nenhuma página cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma página encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where,
            order: { label: 'ASC' },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};