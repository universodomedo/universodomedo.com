'use client';

import { createContext, useContext, useMemo } from 'react';

import { EventosApi, EventosApiGraphqlV2 } from 'types-nora-api';

import useApi from 'Hooks/useApi';

interface ContextoTesteGraphql__Props {
    respostaSessaoGraphql: string | null;
    respostaSessaoGraphqlBasica: string | null;
    respostaSessaoGraphqlV2Basica: string | null;
    respostaSessaoGraphqlV2Resumo: string | null;
    respostaTesteRest: string | null;
    carregando: boolean;
    erro: string | null;
};

const ContextoTesteGraphql = createContext<ContextoTesteGraphql__Props | undefined>(undefined);

export const useContextoTesteGraphql = (): ContextoTesteGraphql__Props => {
    const context = useContext(ContextoTesteGraphql);
    if (!context) throw new Error('useContextoTesteGraphql precisa estar dentro de um ContextoTesteGraphql');
    return context;
};

export const ContextoTesteGraphql__Provider = ({ children }: { children: React.ReactNode }) => {
    const operacaoSessaoGraphqlV2Basica = useMemo(() => EventosApiGraphqlV2.Sessao.one({ where: { id: 1 }, select: { id: true } }), []);
    const operacaoSessaoGraphqlV2Resumo = useMemo(() => EventosApiGraphqlV2.Sessao.one({ where: { id: 1 }, select: { id: true, detalheData: true, tipoPorExtenso: true, tituloInteligente: { tituloCompleto: true }, dadosArteCapa: { caminhoArquivoArteCapa: true }, usuarioMestre: { username: true } } }), []);

    const sessaoGraphql = useApi(EventosApi.GET.Graphql.sessaoGraphql, { disparoInicial: { idSessao: 1 } });
    const sessaoGraphqlBasica = useApi(EventosApi.GET.Graphql.sessaoGraphqlBasica, { disparoInicial: { idSessao: 1 } });
    const sessaoGraphqlV2Basica = useApi(operacaoSessaoGraphqlV2Basica, { disparoInicial: {} });
    const sessaoGraphqlV2Resumo = useApi(operacaoSessaoGraphqlV2Resumo, { disparoInicial: {} });
    const testeRest = useApi(EventosApi.GET.Rest.testeRest, { disparoInicial: {} });

    return (
        <ContextoTesteGraphql.Provider value={{ respostaSessaoGraphql: sessaoGraphql.data ? `Sessão GraphQL #${sessaoGraphql.data.sessaoGraphql.id} — mestre=${sessaoGraphql.data.sessaoGraphql.usuarioMestre?.username ?? 'sem mestre'} — ${sessaoGraphql.data.sessaoGraphql.tipoPorExtenso} — ${sessaoGraphql.data.sessaoGraphql.tituloInteligente?.tituloCompleto ?? 'Sem título'} — capa=${sessaoGraphql.data.sessaoGraphql.dadosArteCapa?.caminhoArquivoArteCapa ?? 'sem capa'} — ${sessaoGraphql.data.sessaoGraphql.detalheData}` : null, respostaSessaoGraphqlBasica: sessaoGraphqlBasica.data ? `Sessão GraphQL básica #${sessaoGraphqlBasica.data.sessaoGraphql.id}` : null, respostaSessaoGraphqlV2Basica: sessaoGraphqlV2Basica.data ? `Sessão GraphQL V2 básica #${sessaoGraphqlV2Basica.data.sessaoGraphql.id}` : null, respostaSessaoGraphqlV2Resumo: sessaoGraphqlV2Resumo.data ? `Sessão GraphQL V2 #${sessaoGraphqlV2Resumo.data.sessaoGraphql.id} — mestre=${sessaoGraphqlV2Resumo.data.sessaoGraphql.usuarioMestre?.username ?? 'sem mestre'} — ${sessaoGraphqlV2Resumo.data.sessaoGraphql.tipoPorExtenso} — ${sessaoGraphqlV2Resumo.data.sessaoGraphql.tituloInteligente?.tituloCompleto ?? 'Sem título'} — capa=${sessaoGraphqlV2Resumo.data.sessaoGraphql.dadosArteCapa?.caminhoArquivoArteCapa ?? 'sem capa'} — ${sessaoGraphqlV2Resumo.data.sessaoGraphql.detalheData}` : null, respostaTesteRest: testeRest.data?.testeRest ?? null, carregando: sessaoGraphql.carregando || sessaoGraphqlBasica.carregando || sessaoGraphqlV2Basica.carregando || sessaoGraphqlV2Resumo.carregando || testeRest.carregando, erro: sessaoGraphql.erro ?? sessaoGraphqlBasica.erro ?? sessaoGraphqlV2Basica.erro ?? sessaoGraphqlV2Resumo.erro ?? testeRest.erro }}>
            {children}
        </ContextoTesteGraphql.Provider>
    );
};