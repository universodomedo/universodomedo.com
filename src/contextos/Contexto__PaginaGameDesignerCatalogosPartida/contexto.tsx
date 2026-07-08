'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { EventosApiRest, type CatalogoPartidaResumo, type EstruturaPartidas, type PartidaResumo, type PAYLOAD__AdicionarPartidaCatalogo, type PAYLOAD__AdicionarRequisitoCatalogo, type PAYLOAD__AdicionarRequisitoSubcatalogo, type PAYLOAD__AlternarExibicaoPartida, type PAYLOAD__CriarSubcatalogoPartida, type PAYLOAD__DefinirSubcatalogoPartidaCatalogo, type PAYLOAD__DeletarCatalogoPartida, type PAYLOAD__DeletarSubcatalogoPartida, type PAYLOAD__RemoverPartidaCatalogo, type PAYLOAD__RemoverRequisitoAcessoCatalogo, type PAYLOAD__RemoverRequisitoAcessoSubcatalogo, type PAYLOAD__ReordenarPartidasCatalogo, type PAYLOAD__SalvarCatalogoPartida, type PAYLOAD__SalvarSubcatalogoPartida, type TipoCatalogoPartida } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';

type FluxoCatalogosPartida = 'LISTAGEM' | 'CADASTRO';

export type ListagemCatalogos = {
    readonly registros: readonly CatalogoPartidaResumo[];
    readonly carregando: string | null;
    readonly erro: string | null;
    readonly mensagemListaVazia: string;
};

export interface Contexto__PaginaGameDesignerCatalogosPartida__Props {
    listagemCatalogos: ListagemCatalogos;
    partidas: readonly PartidaResumo[];
    salvando: boolean;
    estadoFluxo: FluxoCatalogosPartida;
    idCatalogoEmEdicao: number | null;
    catalogoEmEdicao: CatalogoPartidaResumo | null;
    iniciaCadastro: () => void;
    selecionaCatalogo: (idCatalogo: number) => void;
    voltaParaListagem: () => void;
    concluiCadastro: () => void;
    criarCatalogo: (nome: string, tipo: TipoCatalogoPartida) => Promise<void>;
    salvarCatalogo: (payload: PAYLOAD__SalvarCatalogoPartida) => Promise<void>;
    deletarCatalogo: (payload: PAYLOAD__DeletarCatalogoPartida) => Promise<void>;
    adicionarPartida: (payload: PAYLOAD__AdicionarPartidaCatalogo) => Promise<void>;
    removerPartida: (payload: PAYLOAD__RemoverPartidaCatalogo) => Promise<void>;
    alternarExibicao: (payload: PAYLOAD__AlternarExibicaoPartida) => Promise<void>;
    reordenarPartidas: (payload: PAYLOAD__ReordenarPartidasCatalogo) => Promise<void>;
    adicionarRequisitoCatalogo: (payload: PAYLOAD__AdicionarRequisitoCatalogo) => Promise<void>;
    removerRequisitoAcesso: (payload: PAYLOAD__RemoverRequisitoAcessoCatalogo) => Promise<void>;
    adicionarRequisitoSubcatalogo: (payload: PAYLOAD__AdicionarRequisitoSubcatalogo) => Promise<void>;
    removerRequisitoAcessoSubcatalogo: (payload: PAYLOAD__RemoverRequisitoAcessoSubcatalogo) => Promise<void>;
    criarSubcatalogo: (payload: PAYLOAD__CriarSubcatalogoPartida) => Promise<void>;
    salvarSubcatalogo: (payload: PAYLOAD__SalvarSubcatalogoPartida) => Promise<void>;
    deletarSubcatalogo: (payload: PAYLOAD__DeletarSubcatalogoPartida) => Promise<void>;
    definirSubcatalogoPartida: (payload: PAYLOAD__DefinirSubcatalogoPartidaCatalogo) => Promise<void>;
};

const Contexto__PaginaGameDesignerCatalogosPartida = createContext<Contexto__PaginaGameDesignerCatalogosPartida__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCatalogosPartida = (): Contexto__PaginaGameDesignerCatalogosPartida__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCatalogosPartida);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCatalogosPartida precisa estar dentro de um Contexto__PaginaGameDesignerCatalogosPartida');
    return context;
};

export const Contexto__PaginaGameDesignerCatalogosPartida__Provider = ({ children }: { children: ReactNode; }) => {
    const [estrutura, setEstrutura] = useState<EstruturaPartidas | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [estadoFluxo, setEstadoFluxo] = useState<FluxoCatalogosPartida>('LISTAGEM');
    const [idCatalogoEmEdicao, setIdCatalogoEmEdicao] = useState<number | null>(null);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro(null);

        try {
            const resposta = await NoraApi.RestGET(EventosApiRest.GET.Partidas.estruturaConfiguracao, {}, { mensagemErro: 'Não foi possível carregar os Catálogos.' });
            setEstrutura(resposta);
        } catch {
            setErro('Não foi possível carregar os Catálogos.');
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

    const criarCatalogo = useCallback(async (nome: string, tipo: TipoCatalogoPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.criarCatalogo, { nome, tipo }, { mensagemErro: 'Não foi possível criar o catálogo.' }), 'Não foi possível criar o catálogo.');
    }, [executarSalvando]);

    const salvarCatalogo = useCallback(async (payload: PAYLOAD__SalvarCatalogoPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.salvarCatalogo, payload, { mensagemErro: 'Não foi possível salvar o catálogo.' }), 'Não foi possível salvar o catálogo.');
    }, [executarSalvando]);

    const deletarCatalogo = useCallback(async (payload: PAYLOAD__DeletarCatalogoPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.deletarCatalogo, payload, { mensagemErro: 'Não foi possível deletar o catálogo.' }), 'Não foi possível deletar o catálogo.');
        setIdCatalogoEmEdicao(null);
        setEstadoFluxo('LISTAGEM');
    }, [executarSalvando]);

    const adicionarPartida = useCallback(async (payload: PAYLOAD__AdicionarPartidaCatalogo) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.adicionarPartidaCatalogo, payload, { mensagemErro: 'Não foi possível adicionar a Partida ao catálogo.' }), 'Não foi possível adicionar a Partida ao catálogo.');
    }, [executarSalvando]);

    const removerPartida = useCallback(async (payload: PAYLOAD__RemoverPartidaCatalogo) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.removerPartidaCatalogo, payload, { mensagemErro: 'Não foi possível remover a Partida do catálogo.' }), 'Não foi possível remover a Partida do catálogo.');
    }, [executarSalvando]);

    const alternarExibicao = useCallback(async (payload: PAYLOAD__AlternarExibicaoPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.alternarExibicaoPartida, payload, { mensagemErro: 'Não foi possível alterar a exibição da Partida.' }), 'Não foi possível alterar a exibição da Partida.');
    }, [executarSalvando]);

    const reordenarPartidas = useCallback(async (payload: PAYLOAD__ReordenarPartidasCatalogo) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.reordenarPartidasCatalogo, payload, { mensagemErro: 'Não foi possível reordenar as Partidas.' }), 'Não foi possível reordenar as Partidas.');
    }, [executarSalvando]);

    const adicionarRequisitoCatalogo = useCallback(async (payload: PAYLOAD__AdicionarRequisitoCatalogo) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.adicionarRequisitoCatalogo, payload, { mensagemErro: 'Não foi possível adicionar o requisito ao catálogo.' }), 'Não foi possível adicionar o requisito ao catálogo.');
    }, [executarSalvando]);

    const removerRequisitoAcesso = useCallback(async (payload: PAYLOAD__RemoverRequisitoAcessoCatalogo) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.removerRequisitoAcessoCatalogo, payload, { mensagemErro: 'Não foi possível remover o requisito do catálogo.' }), 'Não foi possível remover o requisito do catálogo.');
    }, [executarSalvando]);

    const adicionarRequisitoSubcatalogo = useCallback(async (payload: PAYLOAD__AdicionarRequisitoSubcatalogo) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.adicionarRequisitoSubcatalogo, payload, { mensagemErro: 'Não foi possível adicionar o requisito ao subcatálogo.' }), 'Não foi possível adicionar o requisito ao subcatálogo.');
    }, [executarSalvando]);

    const removerRequisitoAcessoSubcatalogo = useCallback(async (payload: PAYLOAD__RemoverRequisitoAcessoSubcatalogo) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.removerRequisitoAcessoSubcatalogo, payload, { mensagemErro: 'Não foi possível remover o requisito do subcatálogo.' }), 'Não foi possível remover o requisito do subcatálogo.');
    }, [executarSalvando]);

    const criarSubcatalogo = useCallback(async (payload: PAYLOAD__CriarSubcatalogoPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.criarSubcatalogo, payload, { mensagemErro: 'Não foi possível criar o subcatálogo.' }), 'Não foi possível criar o subcatálogo.');
    }, [executarSalvando]);

    const salvarSubcatalogo = useCallback(async (payload: PAYLOAD__SalvarSubcatalogoPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.salvarSubcatalogo, payload, { mensagemErro: 'Não foi possível salvar o subcatálogo.' }), 'Não foi possível salvar o subcatálogo.');
    }, [executarSalvando]);

    const deletarSubcatalogo = useCallback(async (payload: PAYLOAD__DeletarSubcatalogoPartida) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.deletarSubcatalogo, payload, { mensagemErro: 'Não foi possível deletar o subcatálogo.' }), 'Não foi possível deletar o subcatálogo.');
    }, [executarSalvando]);

    const definirSubcatalogoPartida = useCallback(async (payload: PAYLOAD__DefinirSubcatalogoPartidaCatalogo) => {
        await executarSalvando(() => NoraApi.RestPOST(EventosApiRest.POST.Partidas.definirSubcatalogoPartida, payload, { mensagemErro: 'Não foi possível mover a Partida de subcatálogo.' }), 'Não foi possível mover a Partida de subcatálogo.');
    }, [executarSalvando]);

    const iniciaCadastro = useCallback(() => setEstadoFluxo('CADASTRO'), []);
    const selecionaCatalogo = useCallback((idCatalogo: number) => setIdCatalogoEmEdicao(idCatalogo), []);
    const voltaParaListagem = useCallback(() => {
        setIdCatalogoEmEdicao(null);
        setEstadoFluxo('LISTAGEM');
    }, []);
    const concluiCadastro = useCallback(() => {
        setIdCatalogoEmEdicao(null);
        setEstadoFluxo('LISTAGEM');
    }, []);

    const catalogoEmEdicao = useMemo(() => obtemCatalogo(estrutura, idCatalogoEmEdicao), [estrutura, idCatalogoEmEdicao]);
    const partidas = useMemo<readonly PartidaResumo[]>(() => estrutura?.partidas ?? [], [estrutura]);
    const listagemCatalogos = useMemo<ListagemCatalogos>(() => montaListagemCatalogos(estrutura, carregando, erro), [estrutura, carregando, erro]);

    return (
        <Contexto__PaginaGameDesignerCatalogosPartida.Provider value={{ listagemCatalogos, partidas, salvando, estadoFluxo, idCatalogoEmEdicao, catalogoEmEdicao, iniciaCadastro, selecionaCatalogo, voltaParaListagem, concluiCadastro, criarCatalogo, salvarCatalogo, deletarCatalogo, adicionarPartida, removerPartida, alternarExibicao, reordenarPartidas, adicionarRequisitoCatalogo, removerRequisitoAcesso, adicionarRequisitoSubcatalogo, removerRequisitoAcessoSubcatalogo, criarSubcatalogo, salvarSubcatalogo, deletarSubcatalogo, definirSubcatalogoPartida }}>
            {children}
        </Contexto__PaginaGameDesignerCatalogosPartida.Provider>
    );
};

function obtemCatalogo(estrutura: EstruturaPartidas | null, idCatalogo: number | null): CatalogoPartidaResumo | null {
    if (!estrutura || idCatalogo === null) return null;

    return estrutura.catalogos.find(catalogo => catalogo.id === idCatalogo) ?? null;
};

function montaListagemCatalogos(estrutura: EstruturaPartidas | null, carregando: boolean, erro: string | null): ListagemCatalogos {
    return { registros: estrutura?.catalogos ?? [], carregando: carregando ? 'Carregando Catálogos' : null, erro, mensagemListaVazia: 'Nenhum catálogo cadastrado ainda.' };
};
