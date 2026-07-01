'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ConfiguracaoPartida, PartidaResumo } from 'types-nora-api';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Props } from '../Contexto__PaginaGameDesignerConfiguracaoPartida/contexto';
import { remapeiaConfiguracaoPartidaGraphql } from './remapeiaConfiguracaoPartida';
import SPA__PaginaGameDesignerConfiguracaoPartida__Edicao from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Edicao/SPA__PaginaGameDesignerConfiguracaoPartida__Edicao';

export type AbaEdicaoPartida = 'runtime' | 'arteCapa' | 'musica';

// Carga unica do detalhe da Partida: o configuracao (runtime) vem por GraphQL Partida-por-PK; arteCapa e idMusicaConfigurada ja vem no PartidaResumo (estrutura), entao a aba Detalhes os le direto da partida — sem N+1.
const SELECT_CONFIGURACAO_PARTIDA = {
    configuracao: {
        narracaoInicial: true,
        cenario: { nome: true, mapaLogico: { larguraMetros: true, alturaMetros: true } },
        controlaveis: { key: true, referencia: { tipo: true, id: true }, posicaoInicial: { x: true, y: true }, nomeExibicao: true, percepcaoInicial: true },
        naoControlaveis: { key: true, referencia: { tipo: true, id: true }, posicaoInicial: { x: true, y: true }, nomeExibicao: true, percepcaoInicial: true },
        interagiveis: { key: true, nome: true, tipo: true, descricao: true, posicao: { x: true, y: true }, estadoPercepcaoInicial: true },
        descobertasCondicionadas: { key: true, nome: true, descricaoInterna: true, idCapacidadeInata: true, recompensas: { dificuldadeMinima: true, keysSeresPercebidos: true } },
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
};

type PropsProvider = {
    partida: PartidaResumo;
    salvando: boolean;
    salvarConfiguracaoPartida: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['salvarConfiguracaoPartida'];
    voltaParaListagem: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['voltaParaListagem'];
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao');
    return context;
};

export const Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Provider = ({ partida, salvando, salvarConfiguracaoPartida, voltaParaListagem }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: partida.nome, fecharProps: { tipo: 'acao', executar: voltaParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    const [aba, setAba] = useState<AbaEdicaoPartida>('runtime');

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

    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao.Provider value={{ partida, aba, setAba, carregando: consulta.carregando, erro: consulta.erro, configuracaoInicial, salvando, salvarConfiguracao }}>
            <SPA__PaginaGameDesignerConfiguracaoPartida__Edicao />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao.Provider>
    );
};
