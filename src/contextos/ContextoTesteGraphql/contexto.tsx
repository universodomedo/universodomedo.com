'use client';

import { createContext, useContext, useState } from 'react';

import { EventosApi, EventosApiGraphqlV2 } from 'types-nora-api';

import useApi from 'Hooks/useApi';

interface ContextoTesteGraphql__Props {
    respostaSessaoGraphql: string | null;
    respostaSessoesGraphql: string | null;
    respostaSessoesGraphqlOr: string | null;
    respostaSessoesGraphqlOffset: string | null;
    respostaSessoesGraphqlOperadores: string | null;
    respostaSessoesGraphqlRange: string | null;
    respostaErroEsperadoGraphql: string | null;
    respostaTesteRest: string | null;
    carregando: boolean;
    erro: string | null;
    testaErroEsperadoGraphql: () => Promise<void>;
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
    const [respostaErroEsperadoGraphql, setRespostaErroEsperadoGraphql] = useState<string | null>(null);

    const sessaoGraphql = useApi(EventosApiGraphqlV2.obtem.Sessao.um, { disparoInicial: { select: { id: true, dataCriacao: true, dataPrevisaoInicio: true, dataInicio: true, duracaoEmSegundos: true, dataQueEncerrou: true, estadoAtual: true, detalheData: true, tipo: true, tipoPorExtenso: true, tituloInteligente: true, dadosArteCapa: true, usuarioMestre: true, linkSessaoYoutube: true, linkSessaoSpotify: true } } });
    const sessoesGraphql = useApi(EventosApiGraphqlV2.obtem.Sessao.varios, { disparoInicial: { parametros: { where: { dataInicio: { ne: null }, duracaoEmSegundos: { ne: null } }, order: { dataPrevisaoInicio: 'DESC' }, limit: 3, offset: 0 }, select: { id: true, detalheData: true, tipoPorExtenso: true, tituloInteligente: true, usuarioMestre: true } } });
    const sessoesGraphqlOr = useApi(EventosApiGraphqlV2.obtem.Sessao.varios, { disparoInicial: { parametros: { where: [{ id: { eq: 450 } }, { id: { eq: 447 } }], order: { dataPrevisaoInicio: 'DESC' }, limit: 5 }, select: { id: true, detalheData: true, tipoPorExtenso: true, tituloInteligente: true, usuarioMestre: true } } });
    const sessoesGraphqlOffset = useApi(EventosApiGraphqlV2.obtem.Sessao.varios, { disparoInicial: { parametros: { where: { dataInicio: { ne: null }, duracaoEmSegundos: { ne: null } }, order: { dataPrevisaoInicio: 'DESC' }, limit: 2, offset: 1 }, select: { id: true, detalheData: true, tipoPorExtenso: true, tituloInteligente: true, usuarioMestre: true } } });
    const sessoesGraphqlOperadores = useApi(EventosApiGraphqlV2.obtem.Sessao.varios, { disparoInicial: { parametros: { where: { id: { in: [450, 447, 446] }, dataInicio: { isNull: false }, duracaoEmSegundos: { isNull: false } }, order: { dataPrevisaoInicio: 'DESC' }, limit: 5 }, select: { id: true, detalheData: true, tipoPorExtenso: true, tituloInteligente: true, usuarioMestre: true } } });
    const sessoesGraphqlRange = useApi(EventosApiGraphqlV2.obtem.Sessao.varios, { disparoInicial: { parametros: { where: { id: { gte: 446, lte: 450 } }, order: { id: 'DESC' }, limit: 5 }, select: { id: true, detalheData: true, tipoPorExtenso: true, tituloInteligente: true, usuarioMestre: true } } });
    const testeRest = useApi(EventosApi.GET.Rest.testeRest, { disparoInicial: {} });

    const operacaoErroEsperadoGraphql = EventosApiGraphqlV2.obtem.Sessao.varios({ parametros: { where: { detalheData: { eq: 'Ocorreu em 07/04/2025 20:00' } }, limit: 1 }, select: { id: true } });
    const testeErroEsperadoGraphql = useApi(operacaoErroEsperadoGraphql);

    async function testaErroEsperadoGraphql(): Promise<void> {
        setRespostaErroEsperadoGraphql('Executando teste negativo controlado...');

        await testeErroEsperadoGraphql.executar({}, {
            onSuccess: () => setRespostaErroEsperadoGraphql('FALHA DO TESTE: o backend aceitou filtro por campo derivado detalheData. Isso precisa ser bloqueado.'),
            onError: erroCapturado => setRespostaErroEsperadoGraphql(`OK: erro esperado capturado — ${erroCapturado}`),
        }).catch(() => undefined);
    };

    return (
        <ContextoTesteGraphql.Provider value={{ respostaSessaoGraphql: sessaoGraphql.data?.sessaoGraphql ? `Sessão GraphQL #${sessaoGraphql.data.sessaoGraphql.id} — mestre=${sessaoGraphql.data.sessaoGraphql.usuarioMestre?.username ?? 'sem mestre'} — estado=${sessaoGraphql.data.sessaoGraphql.estadoAtual} — tipo=${sessaoGraphql.data.sessaoGraphql.tipo}/${sessaoGraphql.data.sessaoGraphql.tipoPorExtenso} — ${sessaoGraphql.data.sessaoGraphql.tituloInteligente?.tituloCompleto ?? 'Sem título'} — capa=${sessaoGraphql.data.sessaoGraphql.dadosArteCapa?.caminhoArquivoArteCapa ?? 'sem capa'} — youtube=${sessaoGraphql.data.sessaoGraphql.linkSessaoYoutube ?? 'null'} — spotify=${sessaoGraphql.data.sessaoGraphql.linkSessaoSpotify ?? 'null'} — criada=${exibeData(sessaoGraphql.data.sessaoGraphql.dataCriacao)} — prevista=${exibeData(sessaoGraphql.data.sessaoGraphql.dataPrevisaoInicio)} — inicio=${exibeData(sessaoGraphql.data.sessaoGraphql.dataInicio)} — duracao=${sessaoGraphql.data.sessaoGraphql.duracaoEmSegundos ?? 'null'} — encerrou=${exibeData(sessaoGraphql.data.sessaoGraphql.dataQueEncerrou)} — ${sessaoGraphql.data.sessaoGraphql.detalheData}` : null, respostaSessoesGraphql: sessoesGraphql.data ? sessoesGraphql.data.sessoesGraphql.map(sessao => `#${sessao.id} ${sessao.usuarioMestre?.username ?? 'sem mestre'} — ${sessao.tipoPorExtenso} — ${sessao.tituloInteligente?.tituloCompleto ?? 'Sem título'} — ${sessao.detalheData}`).join(' | ') : null, respostaSessoesGraphqlOr: sessoesGraphqlOr.data ? sessoesGraphqlOr.data.sessoesGraphql.map(sessao => `#${sessao.id} ${sessao.usuarioMestre?.username ?? 'sem mestre'} — ${sessao.tipoPorExtenso} — ${sessao.tituloInteligente?.tituloCompleto ?? 'Sem título'} — ${sessao.detalheData}`).join(' | ') : null, respostaSessoesGraphqlOffset: sessoesGraphqlOffset.data ? sessoesGraphqlOffset.data.sessoesGraphql.map(sessao => `#${sessao.id} ${sessao.usuarioMestre?.username ?? 'sem mestre'} — ${sessao.tipoPorExtenso} — ${sessao.tituloInteligente?.tituloCompleto ?? 'Sem título'} — ${sessao.detalheData}`).join(' | ') : null, respostaSessoesGraphqlOperadores: sessoesGraphqlOperadores.data ? sessoesGraphqlOperadores.data.sessoesGraphql.map(sessao => `#${sessao.id} ${sessao.usuarioMestre?.username ?? 'sem mestre'} — ${sessao.tipoPorExtenso} — ${sessao.tituloInteligente?.tituloCompleto ?? 'Sem título'} — ${sessao.detalheData}`).join(' | ') : null, respostaSessoesGraphqlRange: sessoesGraphqlRange.data ? sessoesGraphqlRange.data.sessoesGraphql.map(sessao => `#${sessao.id} ${sessao.usuarioMestre?.username ?? 'sem mestre'} — ${sessao.tipoPorExtenso} — ${sessao.tituloInteligente?.tituloCompleto ?? 'Sem título'} — ${sessao.detalheData}`).join(' | ') : null, respostaErroEsperadoGraphql, respostaTesteRest: testeRest.data?.testeRest ?? null, carregando: sessaoGraphql.carregando || sessoesGraphql.carregando || sessoesGraphqlOr.carregando || sessoesGraphqlOffset.carregando || sessoesGraphqlOperadores.carregando || sessoesGraphqlRange.carregando || testeRest.carregando, erro: sessaoGraphql.erro ?? sessoesGraphql.erro ?? sessoesGraphqlOr.erro ?? sessoesGraphqlOffset.erro ?? sessoesGraphqlOperadores.erro ?? sessoesGraphqlRange.erro ?? testeRest.erro, testaErroEsperadoGraphql }}>
            {children}
        </ContextoTesteGraphql.Provider>
    );
};