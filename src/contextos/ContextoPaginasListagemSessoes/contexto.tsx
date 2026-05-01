'use client';

import { createContext, useContext, useState } from 'react';
import { GraphqlOrderDirecao, GraphqlTypesSessao } from 'types-nora-api';

import useNoraGraphQLConsulta from 'Hooks/useNoraGraphQLConsulta';
import { useSincronizarQueryParamSPA } from 'Hooks/useSincronizarQueryParamSPA';
import { QUERY_PARAMS } from 'Constantes/parametros_query';

const SELECT_LISTAGEM_SESSOES = GraphqlTypesSessao.select('id', 'dataCriacao', 'detalheData', 'tipoPorExtenso', 'usuarioMestre');

export type SessoesListagemContexto = GraphqlTypesSessao.Lista<typeof SELECT_LISTAGEM_SESSOES>;

export interface ContextoPaginasListagemSessoesProps {
    sessoes: SessoesListagemContexto;
    idSessaoSelecionada: number | null;
    setIdSessaoSelecionada: (idSessao: number) => void;
    deselecionaSessao: () => void;
};

const ContextoPaginasListagemSessoes = createContext<ContextoPaginasListagemSessoesProps | undefined>(undefined);

export const useContextoPaginasListagemSessoes = (): ContextoPaginasListagemSessoesProps => {
    const context = useContext(ContextoPaginasListagemSessoes);
    if (!context) throw new Error('useContextoPaginasListagemSessoes precisa estar dentro de um ContextoPaginasListagemSessoes');
    return context;
};

export const ContextoPaginasListagemSessoesProvider = ({ children, idSessaoInicial }: { children: React.ReactNode; idSessaoInicial: number | null; }) => {
    const consultaListagemSessoes = useNoraGraphQLConsulta(obtem => obtem.Sessao.varios({
        parametros: { order: { dataCriacao: GraphqlOrderDirecao.DESC } },
        select: SELECT_LISTAGEM_SESSOES,
    }), { valorInicial: [], carregando: 'Buscando Sessões', mensagemErro: 'Houve um erro recuperando as Sessões à serem listadas', extrair: resposta => [...resposta.sessoesGraphql] });

    const [idSessaoSelecionada, setIdSessaoSelecionada] = useState<number | null>(idSessaoInicial ?? null);

    function deselecionaSessao() { setIdSessaoSelecionada(null); };

    useSincronizarQueryParamSPA(QUERY_PARAMS.SESSAO, idSessaoSelecionada);

    if (consultaListagemSessoes.carregando) return <div>{consultaListagemSessoes.carregando}</div>;

    return (
        <ContextoPaginasListagemSessoes.Provider value={{ sessoes: consultaListagemSessoes.data, idSessaoSelecionada, setIdSessaoSelecionada, deselecionaSessao }}>
            {children}
        </ContextoPaginasListagemSessoes.Provider>
    );
};