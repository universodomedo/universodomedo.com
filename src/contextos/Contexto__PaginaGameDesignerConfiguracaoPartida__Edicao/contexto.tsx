'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { EventosApiRest, type ConfiguracaoPartida, type PartidaResumo } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Props } from '../Contexto__PaginaGameDesignerConfiguracaoPartida/contexto';
import { remapeiaConfiguracaoPartidaGraphql } from './remapeiaConfiguracaoPartida';
import SPA__PaginaGameDesignerConfiguracaoPartida__Edicao from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Edicao/SPA__PaginaGameDesignerConfiguracaoPartida__Edicao';

export type AbaEdicaoPartida = 'visao' | 'runtime' | 'arteCapa' | 'musica';

const ROTULO_EDITOR: Record<Exclude<AbaEdicaoPartida, 'visao'>, string> = { runtime: 'Runtime', arteCapa: 'Arte de Capa', musica: 'Música de Fundo' };

// Carga unica do detalhe da Partida: o configuracao (runtime) vem por GraphQL Partida-por-PK; arteCapa e idMusicaConfigurada ja vem no PartidaResumo (estrutura), entao a aba Detalhes os le direto da partida — sem N+1.
const SELECT_CONFIGURACAO_PARTIDA = {
    configuracao: {
        narracaoInicial: true,
        cenario: { nome: true, mapaLogico: { larguraMetros: true, alturaMetros: true } },
        controlaveis: { key: true, referencia: { tipo: true, id: true }, posicaoInicial: { x: true, y: true }, nomeExibicao: true, percepcaoInicial: true },
        naoControlaveis: { key: true, referencia: { tipo: true, id: true }, posicaoInicial: { x: true, y: true }, nomeExibicao: true, percepcaoInicial: true },
        interagiveis: { key: true, nome: true, tipo: true, descricao: true, posicao: { x: true, y: true }, estadoPercepcaoInicial: true, durabilidadeMaxima: true },
        descobertasCondicionadas: { key: true, nome: true, descricaoInterna: true, idCapacidadeInata: true, recompensas: { dificuldadeMinima: true, keysSeresPercebidos: true, keysInteragiveisPercebidos: true } },
        temporal: { momentoInicialMs: true },
        condicaoVitoria: { tipo: true, keySerEmSala: true, idEstatisticaDanificavel: true, tempoAlvoMs: true, distanciaMaximaMetros: true },
    },
} as const;

interface Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Props {
    partida: PartidaResumo;
    aba: AbaEdicaoPartida;
    setAba: (aba: AbaEdicaoPartida) => void;
    carregando: string | null;
    erro: string | null;
    configuracaoInicial: ConfiguracaoPartida | null;
    salvando: boolean;
    salvarConfiguracao: (configuracao: ConfiguracaoPartida) => Promise<void>;
    idMusicaConfigurada: number | null;
    definirMusicaConfigurada: (idMusica: number | null) => Promise<void>;
    alternarDesabilitada: (desabilitada: boolean) => Promise<void>;
};

type PropsProvider = {
    partida: PartidaResumo;
    salvando: boolean;
    salvarConfiguracaoPartida: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['salvarConfiguracaoPartida'];
    alternarDesabilitadaPartida: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['alternarDesabilitadaPartida'];
    voltaParaListagem: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['voltaParaListagem'];
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao');
    return context;
};

export const Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Provider = ({ partida, salvando, salvarConfiguracaoPartida, alternarDesabilitadaPartida, voltaParaListagem }: PropsProvider) => {
    const [aba, setAba] = useState<AbaEdicaoPartida>('visao');

    // Navegação contextual (o X do cabeçalho) segue o modo: na visão volta pra Listagem; dentro de um editor volta um nível, pros Dados de Exibição. O subtítulo detalha o alvo + o editor — sem barra/título próprios no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: aba === 'visao' ? partida.nome : `${partida.nome} · ${ROTULO_EDITOR[aba]}`,
        fecharProps: aba === 'visao'
            ? { tipo: 'acao', executar: voltaParaListagem, tituloTooltip: 'Voltar para Listagem' }
            : { tipo: 'acao', executar: () => setAba('visao'), tituloTooltip: 'Voltar para Dados de Exibição' },
    });

    const consulta = useNoraGraphQLRegistro('Partida', {
        props: { idPartida: partida.id },
        pk: partida.id,
        select: SELECT_CONFIGURACAO_PARTIDA,
        carregando: 'Carregando configuração da Partida',
        mensagemErro: 'Não foi possível carregar a configuração da Partida.',
    });

    const configuracaoInicial = useMemo<ConfiguracaoPartida | null>(() => {
        const configuracao = consulta.data?.configuracao;
        return configuracao ? remapeiaConfiguracaoPartidaGraphql(configuracao) : null;
    }, [consulta.data]);
    const salvarConfiguracao = useCallback((configuracao: ConfiguracaoPartida) => salvarConfiguracaoPartida(partida.id, configuracao), [salvarConfiguracaoPartida, partida.id]);
    const alternarDesabilitada = useCallback((desabilitada: boolean) => alternarDesabilitadaPartida({ idPartida: partida.id, desabilitada }), [alternarDesabilitadaPartida, partida.id]);

    // Música de fundo editável a partir do estado do PartidaResumo; ao salvar (REST) atualiza o estado local pra a visão refletir sem recarregar.
    const [idMusicaConfigurada, setIdMusicaConfigurada] = useState<number | null>(partida.idMusicaConfigurada);
    const definirMusicaConfigurada = useCallback(async (idMusica: number | null): Promise<void> => {
        await NoraApi.RestPOST(EventosApiRest.POST.Partidas.salvarMusicaFundo, { id: partida.id, idMusicaConfigurada: idMusica }, { mensagemErro: 'Não foi possível salvar a Música de Fundo.' });
        setIdMusicaConfigurada(idMusica);
    }, [partida.id]);

    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao.Provider value={{ partida, aba, setAba, carregando: consulta.carregando, erro: consulta.erro, configuracaoInicial, salvando, salvarConfiguracao, idMusicaConfigurada, definirMusicaConfigurada, alternarDesabilitada }}>
            <SPA__PaginaGameDesignerConfiguracaoPartida__Edicao />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao.Provider>
    );
};
