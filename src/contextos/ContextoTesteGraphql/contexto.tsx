'use client';

import { createContext, useContext } from 'react';

import { EventosApi } from 'types-nora-api';

import useApi from 'Hooks/useApi';

interface ContextoTesteGraphql__Props {
    respostaSessaoGraphql: string | null;
    respostaSessaoGraphqlBasica: string | null;
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
    const sessaoGraphql = useApi(EventosApi.GET.Graphql.sessaoGraphql, { disparoInicial: { idSessao: 1 } });
    const sessaoGraphqlBasica = useApi(EventosApi.GET.Graphql.sessaoGraphqlBasica, { disparoInicial: { idSessao: 1 } });
    const testeRest = useApi(EventosApi.GET.Rest.testeRest, { disparoInicial: {} });

    return (
        <ContextoTesteGraphql.Provider value={{ respostaSessaoGraphql: sessaoGraphql.data ? `Sessão GraphQL #${sessaoGraphql.data.sessaoGraphql.id} — mestre=${sessaoGraphql.data.sessaoGraphql.usuarioMestre?.username ?? 'sem mestre'} — ${sessaoGraphql.data.sessaoGraphql.tipoPorExtenso} — ${sessaoGraphql.data.sessaoGraphql.tituloInteligente?.tituloCompleto ?? 'Sem título'} — capa=${sessaoGraphql.data.sessaoGraphql.dadosArteCapa?.caminhoArquivoArteCapa ?? 'sem capa'} — ${sessaoGraphql.data.sessaoGraphql.detalheData}` : null, respostaSessaoGraphqlBasica: sessaoGraphqlBasica.data ? `Sessão GraphQL básica #${sessaoGraphqlBasica.data.sessaoGraphql.id}` : null, respostaTesteRest: testeRest.data?.testeRest ?? null, carregando: sessaoGraphql.carregando || sessaoGraphqlBasica.carregando || testeRest.carregando, erro: sessaoGraphql.erro ?? sessaoGraphqlBasica.erro ?? testeRest.erro }}>
            {children}
        </ContextoTesteGraphql.Provider>
    );
};