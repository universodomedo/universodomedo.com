'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { GraphqlOrderDirecao, GraphqlTypesSessao } from 'types-nora-api';

import { NoraApiCarregamento } from 'Api/NoraApiRequisicoesStore';
import { FiltrosConsultaProvider, useContextoFiltrosConsulta } from 'Contextos/Contexto__FiltrosConsulta/contexto';
import { FiltrosVisualizacaoProvider, useContextoFiltrosVisualizacao } from 'Contextos/Contexto__Filtros/contexto';
import useNoraGraphQLConsulta from 'Hooks/useNoraGraphQLConsulta';
import { filtraCamposFiltroVisualizacaoPorSelect } from 'Hooks/useNoraGraphQLFiltroVisualizacao';
import { NoraGraphQLFiltroConsultaWhere } from 'Hooks/useNoraGraphQLFiltroConsulta';
import { useSincronizarQueryParamSPA } from 'Hooks/useSincronizarQueryParamSPA';
import { QUERY_PARAMS } from 'Constantes/parametros_query';

const SELECT_LISTAGEM_SESSOES = GraphqlTypesSessao.select('id', 'dataCriacao', 'detalheData', 'tipoPorExtenso', 'usuarioMestre');

const CAMPOS_FILTRO_VISUALIZACAO_LISTAGEM_SESSOES = filtraCamposFiltroVisualizacaoPorSelect(SELECT_LISTAGEM_SESSOES, GraphqlTypesSessao.CamposFiltroVisualizacao);

export type SessaoListagemContextoRegistro = GraphqlTypesSessao.Item<typeof SELECT_LISTAGEM_SESSOES>;

export type ListaSessoesListagemContexto = readonly SessaoListagemContextoRegistro[];

export interface ContextoPaginasListagemSessoesProps {
    sessoes: ListaSessoesListagemContexto;
    sessoesSemFiltroVisualizacao: ListaSessoesListagemContexto;
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

function montaParametrosConsultaListagemSessoes(where: NoraGraphQLFiltroConsultaWhere | null): GraphqlTypesSessao.ObtemVariosParametros {
    return {
        where: where as GraphqlTypesSessao.ObtemVariosParametros['where'],
        order: { dataCriacao: GraphqlOrderDirecao.DESC },
    };
};

export const ContextoPaginasListagemSessoesProvider = ({ children, idSessaoInicial }: { children: React.ReactNode; idSessaoInicial: number | null; }) => {
    return (
        <FiltrosConsultaProvider campos={GraphqlTypesSessao.CamposFiltroConsulta}>
            {/* <ContextoPaginasListagemSessoesProviderComConsulta idSessaoInicial={idSessaoInicial}> */}
                {children}
            {/* </ContextoPaginasListagemSessoesProviderComConsulta> */}
        </FiltrosConsultaProvider>
    );
};

function ContextoPaginasListagemSessoesProviderComConsulta({ children, idSessaoInicial }: { children: React.ReactNode; idSessaoInicial: number | null; }) {
    const { where, versaoAplicacao } = useContextoFiltrosConsulta<object>();
    const versaoAplicacaoAnteriorRef = useRef(versaoAplicacao);

    // const consultaListagemSessoes = useNoraGraphQLConsulta(obtem => obtem.Sessao.varios({
    //     parametros: montaParametrosConsultaListagemSessoes(where),
    //     select: SELECT_LISTAGEM_SESSOES,
    // }), { valorInicial: [], carregando: 'Buscando Sessões', mensagemErro: 'Houve um erro recuperando as Sessões à serem listadas', carregamento: NoraApiCarregamento.BLOQUEIA_INTERFACE });

    // const recarregarListagemSessoes = consultaListagemSessoes.recarregar;

    // useEffect(() => {
    //     if (versaoAplicacaoAnteriorRef.current === versaoAplicacao) return;

    //     versaoAplicacaoAnteriorRef.current = versaoAplicacao;
    //     recarregarListagemSessoes().catch(() => undefined);
    // }, [recarregarListagemSessoes, versaoAplicacao]);

    return (
        // <FiltrosVisualizacaoProvider registros={consultaListagemSessoes.data} campos={CAMPOS_FILTRO_VISUALIZACAO_LISTAGEM_SESSOES}>
            // <ContextoPaginasListagemSessoesProviderInterno idSessaoInicial={idSessaoInicial} carregando={consultaListagemSessoes.carregando}>
                {children}
            // </ContextoPaginasListagemSessoesProviderInterno>
        // </FiltrosVisualizacaoProvider>
    );
};

function ContextoPaginasListagemSessoesProviderInterno({ children, idSessaoInicial, carregando }: { children: React.ReactNode; idSessaoInicial: number | null; carregando: string | null; }) {
    const resultadoFiltroVisualizacao = useContextoFiltrosVisualizacao<SessaoListagemContextoRegistro>();
    const [idSessaoSelecionada, setIdSessaoSelecionada] = useState<number | null>(idSessaoInicial ?? null);

    function deselecionaSessao() { setIdSessaoSelecionada(null); };

    useSincronizarQueryParamSPA(QUERY_PARAMS.SESSAO, idSessaoSelecionada);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoPaginasListagemSessoes.Provider value={{
            sessoes: resultadoFiltroVisualizacao.registrosFiltrados,
            sessoesSemFiltroVisualizacao: resultadoFiltroVisualizacao.registrosOriginais,
            idSessaoSelecionada,
            setIdSessaoSelecionada,
            deselecionaSessao,
        }}>
            {children}
        </ContextoPaginasListagemSessoes.Provider>
    );
};