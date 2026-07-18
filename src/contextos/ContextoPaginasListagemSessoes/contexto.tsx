'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useSincronizarQueryParamSPA } from 'Hooks/useSincronizarQueryParamSPA';
import { QUERY_PARAMS } from 'Constantes/parametros_query';

export type ListagemSessoesResultado = ReturnType<typeof obtemListagemSessoes>;

export type SessaoListagemContextoRegistro = ListagemSessoesResultado['registros'][number];

export interface ContextoPaginasListagemSessoesProps {
    listagemSessoes: ListagemSessoesResultado;
    idSessaoSelecionada: number | null;
    setIdSessaoSelecionada: (idSessao: number | null) => void;
    deselecionaSessao: () => void;
};

const ContextoPaginasListagemSessoes = createContext<ContextoPaginasListagemSessoesProps | undefined>(undefined);

export const useContextoPaginasListagemSessoes = (): ContextoPaginasListagemSessoesProps => {
    const context = useContext(ContextoPaginasListagemSessoes);
    if (!context) throw new Error('useContextoPaginasListagemSessoes precisa estar dentro de um ContextoPaginasListagemSessoes');
    return context;
};

export const ContextoPaginasListagemSessoesProvider = ({ children, idSessaoInicial }: { children: ReactNode; idSessaoInicial: number | null; }) => {
    const listagemSessoes = obtemListagemSessoes();
    const [idSessaoSelecionada, setIdSessaoSelecionada] = useState<number | null>(idSessaoInicial ?? null);

    const deselecionaSessao = useCallback(() => { setIdSessaoSelecionada(null); }, []);

    useSincronizarQueryParamSPA(QUERY_PARAMS.SESSAO, idSessaoSelecionada);

    return (
        <ContextoPaginasListagemSessoes.Provider value={{ listagemSessoes, idSessaoSelecionada, setIdSessaoSelecionada, deselecionaSessao }}>
            {children}
        </ContextoPaginasListagemSessoes.Provider>
    );
};

//

function obtemListagemSessoes() {
    return useNoraGraphQLListagem('Sessao', {
        select: ['id', 'dataCriacao', 'dataInicio', 'estadoAtual', 'detalheData', 'tituloInteligente', 'dadosArteCapa', 'usuarioMestre'],
        itensPorPagina: 24,
        carregando: 'Buscando Sessões',
        mensagemErro: 'Houve um erro recuperando as Sessões à serem listadas',
        mensagemListaVazia: 'Nenhuma sessão encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma sessão encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where,
            order: { dataCriacao: 'DESC' },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
