'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { EstruturaDesafios, EventosApiRest, type DesafioResumo, type GrupoTipoDesafio, type TipoDesafio } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import type { ListagemCompostaListagem } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';

export interface Contexto__PaginaGameDesignerDesafios__Props {
    estrutura: EstruturaDesafios | null;
    carregando: boolean;
    salvando: boolean;
    erro: string | null;
    tipoSelecionado: TipoDesafio | null;
    listagemTipos: ListagemCompostaListagem<GrupoTipoDesafio>;
    recarregar: () => Promise<void>;
    selecionaTipo: (tipo: TipoDesafio) => void;
    voltaParaTipos: () => void;
    alternarAtivoDesafio: (desafio: DesafioResumo, ativo: boolean) => Promise<void>;
};

const Contexto__PaginaGameDesignerDesafios = createContext<Contexto__PaginaGameDesignerDesafios__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerDesafios = (): Contexto__PaginaGameDesignerDesafios__Props => {
    const context = useContext(Contexto__PaginaGameDesignerDesafios);
    if (!context) throw new Error('useContexto__PaginaGameDesignerDesafios precisa estar dentro de um Contexto__PaginaGameDesignerDesafios');
    return context;
};

export const Contexto__PaginaGameDesignerDesafios__Provider = ({ children }: { children: ReactNode; }) => {
    const [estrutura, setEstrutura] = useState<EstruturaDesafios | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [tipoSelecionado, setTipoSelecionado] = useState<TipoDesafio | null>(null);

    const carregarEstrutura = useCallback(async () => {
        setCarregando(true);
        setErro(null);

        try {
            const resposta = await NoraApi.RestGET(EventosApiRest.GET.Desafios.estrutura, {}, { mensagemErro: 'Não foi possível carregar os Desafios.' });
            setEstrutura(resposta);
        } catch {
            setErro('Não foi possível carregar os Desafios.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => { void carregarEstrutura(); }, [carregarEstrutura]);

    const executaComEstrutura = useCallback(async (acao: () => Promise<EstruturaDesafios>, mensagemErro: string) => {
        setSalvando(true);
        setErro(null);

        try {
            const resposta = await acao();
            setEstrutura(resposta);
        } catch {
            setErro(mensagemErro);
            await carregarEstrutura();
        } finally {
            setSalvando(false);
        }
    }, [carregarEstrutura]);

    const selecionaTipo = useCallback((tipo: TipoDesafio) => setTipoSelecionado(tipo), []);
    const voltaParaTipos = useCallback(() => setTipoSelecionado(null), []);

    const alternarAtivoDesafio = useCallback(async (desafio: DesafioResumo, ativo: boolean) => {
        await executaComEstrutura(() => NoraApi.RestPOST(EventosApiRest.POST.Desafios.alternarDesafio, { id: desafio.id, ativo }, { mensagemErro: 'Não foi possível alternar o Desafio.' }), 'Não foi possível alternar o Desafio.');
    }, [executaComEstrutura]);

    const listagemTipos: ListagemCompostaListagem<GrupoTipoDesafio> = { registros: estrutura?.grupos ?? [], carregando: carregando ? 'Carregando Desafios' : null, erro, mensagemListaVazia: 'Nenhum tipo de Desafio.' };

    return (
        <Contexto__PaginaGameDesignerDesafios.Provider value={{ estrutura, carregando, salvando, erro, tipoSelecionado, listagemTipos, recarregar: carregarEstrutura, selecionaTipo, voltaParaTipos, alternarAtivoDesafio }}>
            {children}
        </Contexto__PaginaGameDesignerDesafios.Provider>
    );
};