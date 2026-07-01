'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { EventosApiRest, type ConfiguracaoPartida, type EstruturaPartidas, type PartidaResumo, type PAYLOAD__CriarPartida, type PAYLOAD__DeletarPartida, type PAYLOAD__SalvarPartida } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';

type FluxoConfiguracaoPartida = 'LISTAGEM' | 'CADASTRO';

export type ListagemPartidas = {
    readonly registros: readonly PartidaResumo[];
    readonly carregando: string | null;
    readonly erro: string | null;
    readonly mensagemListaVazia: string;
};

export interface Contexto__PaginaGameDesignerConfiguracaoPartida__Props {
    estrutura: EstruturaPartidas | null;
    listagemPartidas: ListagemPartidas;
    salvando: boolean;
    estadoFluxo: FluxoConfiguracaoPartida;
    idPartidaEmEdicao: number | null;
    partidaEmEdicao: PartidaResumo | null;
    iniciaCadastro: () => void;
    selecionaPartida: (idPartida: number) => void;
    voltaParaListagem: () => void;
    concluiCadastro: () => void;
    criarPartida: (payload: PAYLOAD__CriarPartida) => Promise<void>;
    salvarPartida: (payload: PAYLOAD__SalvarPartida) => Promise<void>;
    deletarPartida: (payload: PAYLOAD__DeletarPartida) => Promise<void>;
    salvarConfiguracaoPartida: (idPartida: number, configuracao: ConfiguracaoPartida) => Promise<void>;
};

const Contexto__PaginaGameDesignerConfiguracaoPartida = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida');
    return context;
};

export const Contexto__PaginaGameDesignerConfiguracaoPartida__Provider = ({ children }: { children: ReactNode; }) => {
    const [estrutura, setEstrutura] = useState<EstruturaPartidas | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoConfiguracaoPartida>('LISTAGEM');
    const [idPartidaEmEdicao, setIdPartidaEmEdicao] = useState<number | null>(null);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro(null);

        try {
            const resposta = await NoraApi.RestGET(EventosApiRest.GET.Partidas.estruturaConfiguracao, {}, { mensagemErro: 'Não foi possível carregar as Partidas.' });
            setEstrutura(resposta);
        } catch {
            setErro('Não foi possível carregar as Partidas.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => { void carregar(); }, [carregar]);

    const executarSalvando = useCallback(async (acao: () => Promise<EstruturaPartidas>, mensagemErro: string) => {
        setSalvando(true);
        setErro(null);

        try {
            const resposta = await acao();
            setEstrutura(resposta);
        } catch {
            setErro(mensagemErro);
        } finally {
            setSalvando(false);
        }
    }, []);

    const criarPartida = useCallback(async (payload: PAYLOAD__CriarPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.criarPartida, payload, { mensagemErro: 'Não foi possível criar a Partida.' }), 'Não foi possível criar a Partida.');
    }, [executarSalvando]);

    const salvarPartida = useCallback(async (payload: PAYLOAD__SalvarPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.salvarPartida, payload, { mensagemErro: 'Não foi possível salvar a Partida.' }), 'Não foi possível salvar a Partida.');
    }, [executarSalvando]);

    const deletarPartida = useCallback(async (payload: PAYLOAD__DeletarPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.deletarPartida, payload, { mensagemErro: 'Não foi possível deletar a Partida.' }), 'Não foi possível deletar a Partida.');
        setIdPartidaEmEdicao(null);
        setEstadoFluxo('LISTAGEM');
    }, [executarSalvando]);

    // Salva a configuracao runtime e ja reflete na estrutura (badge "Configurada" da grade). Nao navega: as abas (Runtime/Detalhes) seguem abertas sobre a mesma Partida.
    const salvarConfiguracaoPartida = useCallback(async (idPartida: number, configuracao: ConfiguracaoPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.salvarConfiguracao, { id: idPartida, configuracao }, { mensagemErro: 'Não foi possível salvar a configuração da Partida.' }), 'Não foi possível salvar a configuração da Partida.');
    }, [executarSalvando]);

    const iniciaCadastro = useCallback(() => setEstadoFluxo('CADASTRO'), []);
    const selecionaPartida = useCallback((idPartida: number) => setIdPartidaEmEdicao(idPartida), []);
    const voltaParaListagem = useCallback(() => {
        setIdPartidaEmEdicao(null);
        setEstadoFluxo('LISTAGEM');
    }, []);
    const concluiCadastro = useCallback(() => {
        setIdPartidaEmEdicao(null);
        setEstadoFluxo('LISTAGEM');
    }, []);

    const partidaEmEdicao = useMemo(() => obtemPartida(estrutura, idPartidaEmEdicao), [estrutura, idPartidaEmEdicao]);
    const listagemPartidas = useMemo<ListagemPartidas>(() => montaListagemPartidas(estrutura, carregando, erro), [estrutura, carregando, erro]);

    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida.Provider value={{ estrutura, listagemPartidas, salvando, estadoFluxo, idPartidaEmEdicao, partidaEmEdicao, iniciaCadastro, selecionaPartida, voltaParaListagem, concluiCadastro, criarPartida, salvarPartida, deletarPartida, salvarConfiguracaoPartida }}>
            {children}
        </Contexto__PaginaGameDesignerConfiguracaoPartida.Provider>
    );
};

function obtemPartida(estrutura: EstruturaPartidas | null, idPartida: number | null): PartidaResumo | null {
    if (!estrutura || idPartida === null) return null;

    return estrutura.partidas.find(partida => partida.id === idPartida) ?? null;
};

function montaListagemPartidas(estrutura: EstruturaPartidas | null, carregando: boolean, erro: string | null): ListagemPartidas {
    return { registros: estrutura?.partidas ?? [], carregando: carregando ? 'Carregando Partidas' : null, erro, mensagemListaVazia: 'Nenhuma Partida cadastrada ainda.' };
};
