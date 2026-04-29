'use client';

import { createContext, useContext, useMemo } from 'react';

import { EventosApi, EventosApiGraphqlV2, GraphqlOrderDirecao } from 'types-nora-api';

import useApi from 'Hooks/useApi';

interface ContextoTesteGraphql__Props {
    respostaSessaoGraphql: string | null;
    respostaSessoesGraphql: string | null;
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

function exibeData(valor: Date | string | null | undefined): string {
    if (!valor) return 'null';
    return `${valor}`;
};

export const ContextoTesteGraphql__Provider = ({ children }: { children: React.ReactNode }) => {
    const sessaoGraphql = useApi(EventosApiGraphqlV2.obtem.Sessao.um, { disparoInicial: { select: { id: true, dataCriacao: true, dataPrevisaoInicio: true, dataInicio: true, duracaoEmSegundos: true, dataQueEncerrou: true, estadoAtual: true, detalheData: true, tipo: true, tipoPorExtenso: true, tituloInteligente: { tituloCompleto: true }, dadosArteCapa: { caminhoArquivoArteCapa: true }, usuarioMestre: { username: true }, linkSessaoYoutube: true, linkSessaoSpotify: true } } });
    const sessoesGraphql = useApi(EventosApiGraphqlV2.obtem.Sessao.varios, { disparoInicial: { parametros: { where: { dataInicio: { ne: null }, duracaoEmSegundos: { ne: null } }, order: { dataPrevisaoInicio: 'DESC' }, limit: 3, offset: 0 }, select: { id: true, detalheData: true, tipoPorExtenso: true, tituloInteligente: { tituloCompleto: true }, usuarioMestre: { username: true } } } });
    const testeRest = useApi(EventosApi.GET.Rest.testeRest, { disparoInicial: {} });

    return (
        <ContextoTesteGraphql.Provider value={{ respostaSessaoGraphql: sessaoGraphql.data?.sessaoGraphql ? `Sessão GraphQL #${sessaoGraphql.data.sessaoGraphql.id} — mestre=${sessaoGraphql.data.sessaoGraphql.usuarioMestre?.username ?? 'sem mestre'} — estado=${sessaoGraphql.data.sessaoGraphql.estadoAtual} — tipo=${sessaoGraphql.data.sessaoGraphql.tipo}/${sessaoGraphql.data.sessaoGraphql.tipoPorExtenso} — ${sessaoGraphql.data.sessaoGraphql.tituloInteligente?.tituloCompleto ?? 'Sem título'} — capa=${sessaoGraphql.data.sessaoGraphql.dadosArteCapa?.caminhoArquivoArteCapa ?? 'sem capa'} — youtube=${sessaoGraphql.data.sessaoGraphql.linkSessaoYoutube ?? 'null'} — spotify=${sessaoGraphql.data.sessaoGraphql.linkSessaoSpotify ?? 'null'} — criada=${exibeData(sessaoGraphql.data.sessaoGraphql.dataCriacao)} — prevista=${exibeData(sessaoGraphql.data.sessaoGraphql.dataPrevisaoInicio)} — inicio=${exibeData(sessaoGraphql.data.sessaoGraphql.dataInicio)} — duracao=${sessaoGraphql.data.sessaoGraphql.duracaoEmSegundos ?? 'null'} — encerrou=${exibeData(sessaoGraphql.data.sessaoGraphql.dataQueEncerrou)} — ${sessaoGraphql.data.sessaoGraphql.detalheData}` : null, respostaSessoesGraphql: sessoesGraphql.data ? sessoesGraphql.data.sessoesGraphql.map(sessao => `#${sessao.id} ${sessao.usuarioMestre?.username ?? 'sem mestre'} — ${sessao.tipoPorExtenso} — ${sessao.tituloInteligente?.tituloCompleto ?? 'Sem título'} — ${sessao.detalheData}`).join(' | ') : null, respostaTesteRest: testeRest.data?.testeRest ?? null, carregando: sessaoGraphql.carregando || sessoesGraphql.carregando || testeRest.carregando, erro: sessaoGraphql.erro ?? sessoesGraphql.erro ?? testeRest.erro }}>
            {children}
        </ContextoTesteGraphql.Provider>
    );
};