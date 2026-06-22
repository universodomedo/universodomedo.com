'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { EstruturaMissoesJogaveis, EventosApiRest, type CatalogoMissaoJogavelResumo, type ConfiguracaoRuntimeMissaoJogavel, type MissaoJogavelResumo, type PAYLOAD__CriarCatalogoMissaoJogavel, type PAYLOAD__CriarMissaoJogavel, type PAYLOAD__SalvarCatalogoMissaoJogavel, type PAYLOAD__SalvarMissaoConfiguracaoRuntime, type PAYLOAD__SalvarMissaoJogavel } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';

type EditorCatalogoMissao = {
    readonly id: number | null;
    readonly nome: string;
};

type EditorMissao = {
    readonly id: number | null;
    readonly fkCatalogosMissaoId: number;
    readonly nome: string;
    readonly descricao: string;
};

type EditorRuntimeMissao = {
    readonly idMissao: number;
    readonly nomeMissao: string;
    readonly textoConfiguracao: string;
};

export interface Contexto__PaginaGameDesignerMissoesJogaveis__Props {
    estrutura: EstruturaMissoesJogaveis | null;
    carregando: boolean;
    salvando: boolean;
    erro: string | null;
    idsCatalogosAbertos: readonly number[];
    editorCatalogo: EditorCatalogoMissao | null;
    editorMissao: EditorMissao | null;
    editorRuntimeMissao: EditorRuntimeMissao | null;
    recarregar: () => Promise<void>;
    alternarCatalogoAberto: (idCatalogo: number) => void;
    abrirCriacaoCatalogo: () => void;
    abrirEdicaoCatalogo: (catalogo: CatalogoMissaoJogavelResumo) => void;
    alterarEditorCatalogoNome: (nome: string) => void;
    cancelarEditorCatalogo: () => void;
    salvarEditorCatalogo: () => Promise<void>;
    abrirCriacaoMissao: (catalogo: CatalogoMissaoJogavelResumo) => void;
    abrirEdicaoMissao: (catalogo: CatalogoMissaoJogavelResumo, missao: MissaoJogavelResumo) => void;
    alterarEditorMissao: (valores: EditorMissao) => void;
    cancelarEditorMissao: () => void;
    salvarEditorMissao: () => Promise<void>;
    abrirEditorRuntimeMissao: (missao: MissaoJogavelResumo) => Promise<void>;
    alterarEditorRuntimeMissaoTexto: (texto: string) => void;
    cancelarEditorRuntimeMissao: () => void;
    salvarEditorRuntimeMissao: () => Promise<void>;
    sincronizarMissoesFuncionaisIniciais: () => Promise<void>;
    alternarAtivoCatalogo: (catalogo: CatalogoMissaoJogavelResumo, ativo: boolean) => Promise<void>;
    alternarAtivoMissao: (missao: MissaoJogavelResumo, ativo: boolean) => Promise<void>;
    reordenarCatalogos: (idOrigem: number, idDestino: number) => Promise<void>;
    reordenarMissoesCatalogo: (catalogo: CatalogoMissaoJogavelResumo, idOrigem: number, idDestino: number) => Promise<void>;
};

const Contexto__PaginaGameDesignerMissoesJogaveis = createContext<Contexto__PaginaGameDesignerMissoesJogaveis__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerMissoesJogaveis = (): Contexto__PaginaGameDesignerMissoesJogaveis__Props => {
    const context = useContext(Contexto__PaginaGameDesignerMissoesJogaveis);
    if (!context) throw new Error('useContexto__PaginaGameDesignerMissoesJogaveis precisa estar dentro de um Contexto__PaginaGameDesignerMissoesJogaveis');
    return context;
};

export const Contexto__PaginaGameDesignerMissoesJogaveis__Provider = ({ children }: { children: ReactNode; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Estrutura de Missões Jogáveis', fecharProps: undefined });

    const [estrutura, setEstrutura] = useState<EstruturaMissoesJogaveis | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [idsCatalogosAbertos, setIdsCatalogosAbertos] = useState<readonly number[]>([]);
    const [editorCatalogo, setEditorCatalogo] = useState<EditorCatalogoMissao | null>(null);
    const [editorMissao, setEditorMissao] = useState<EditorMissao | null>(null);
    const [editorRuntimeMissao, setEditorRuntimeMissao] = useState<EditorRuntimeMissao | null>(null);

    const carregarEstrutura = useCallback(async () => {
        setCarregando(true);
        setErro(null);

        try {
            const resposta = await NoraApi.RestGET(EventosApiRest.GET.MissoesJogaveis.estrutura, {}, { mensagemErro: 'Não foi possível carregar as Missões Jogáveis.' });
            setEstrutura(resposta);
            setIdsCatalogosAbertos(idsAtuais => idsAtuais.length > 0 ? idsAtuais : resposta.catalogos.map(catalogo => catalogo.id));
        } catch {
            setErro('Não foi possível carregar as Missões Jogáveis.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => { void carregarEstrutura(); }, [carregarEstrutura]);

    const executaComEstrutura = useCallback(async (acao: () => Promise<EstruturaMissoesJogaveis>, mensagemErro: string) => {
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

    const alternarCatalogoAberto = useCallback((idCatalogo: number) => {
        setIdsCatalogosAbertos(idsAtuais => idsAtuais.includes(idCatalogo) ? idsAtuais.filter(id => id !== idCatalogo) : [...idsAtuais, idCatalogo]);
    }, []);

    const abrirCriacaoCatalogo = useCallback(() => { setEditorCatalogo({ id: null, nome: '' }); setEditorMissao(null); setEditorRuntimeMissao(null); }, []);
    const abrirEdicaoCatalogo = useCallback((catalogo: CatalogoMissaoJogavelResumo) => { setEditorCatalogo({ id: catalogo.id, nome: catalogo.nome }); setEditorMissao(null); setEditorRuntimeMissao(null); }, []);
    const alterarEditorCatalogoNome = useCallback((nome: string) => { setEditorCatalogo(editorAtual => editorAtual ? { ...editorAtual, nome } : null); }, []);
    const cancelarEditorCatalogo = useCallback(() => setEditorCatalogo(null), []);

    const salvarEditorCatalogo = useCallback(async () => {
        if (!editorCatalogo || editorCatalogo.nome.trim().length === 0) return;

        if (editorCatalogo.id === null) {
            const payload: PAYLOAD__CriarCatalogoMissaoJogavel = { nome: editorCatalogo.nome };
            await executaComEstrutura(() => NoraApi.RestPOST(EventosApiRest.POST.MissoesJogaveis.criarCatalogo, payload, { mensagemErro: 'Não foi possível criar o Catálogo de Missão.' }), 'Não foi possível criar o Catálogo de Missão.');
        } else {
            const payload: PAYLOAD__SalvarCatalogoMissaoJogavel = { id: editorCatalogo.id, nome: editorCatalogo.nome };
            await executaComEstrutura(() => NoraApi.RestPOST(EventosApiRest.POST.MissoesJogaveis.salvarCatalogo, payload, { mensagemErro: 'Não foi possível salvar o Catálogo de Missão.' }), 'Não foi possível salvar o Catálogo de Missão.');
        }

        setEditorCatalogo(null);
    }, [editorCatalogo, executaComEstrutura]);

    const abrirCriacaoMissao = useCallback((catalogo: CatalogoMissaoJogavelResumo) => { setEditorMissao({ id: null, fkCatalogosMissaoId: catalogo.id, nome: '', descricao: '' }); setEditorCatalogo(null); setEditorRuntimeMissao(null); setIdsCatalogosAbertos(idsAtuais => idsAtuais.includes(catalogo.id) ? idsAtuais : [...idsAtuais, catalogo.id]); }, []);
    const abrirEdicaoMissao = useCallback((catalogo: CatalogoMissaoJogavelResumo, missao: MissaoJogavelResumo) => { setEditorMissao({ id: missao.id, fkCatalogosMissaoId: catalogo.id, nome: missao.nome, descricao: missao.descricao }); setEditorCatalogo(null); setEditorRuntimeMissao(null); }, []);
    const alterarEditorMissao = useCallback((valores: EditorMissao) => setEditorMissao(valores), []);
    const cancelarEditorMissao = useCallback(() => setEditorMissao(null), []);

    const salvarEditorMissao = useCallback(async () => {
        if (!editorMissao || editorMissao.nome.trim().length === 0 || editorMissao.descricao.trim().length === 0) return;

        if (editorMissao.id === null) {
            const payload: PAYLOAD__CriarMissaoJogavel = { fkCatalogosMissaoId: editorMissao.fkCatalogosMissaoId, nome: editorMissao.nome, descricao: editorMissao.descricao };
            await executaComEstrutura(() => NoraApi.RestPOST(EventosApiRest.POST.MissoesJogaveis.criarMissao, payload, { mensagemErro: 'Não foi possível criar a Missão.' }), 'Não foi possível criar a Missão.');
        } else {
            const payload: PAYLOAD__SalvarMissaoJogavel = { id: editorMissao.id, fkCatalogosMissaoId: editorMissao.fkCatalogosMissaoId, nome: editorMissao.nome, descricao: editorMissao.descricao };
            await executaComEstrutura(() => NoraApi.RestPOST(EventosApiRest.POST.MissoesJogaveis.salvarMissao, payload, { mensagemErro: 'Não foi possível salvar a Missão.' }), 'Não foi possível salvar a Missão.');
        }

        setEditorMissao(null);
    }, [editorMissao, executaComEstrutura]);

    const abrirEditorRuntimeMissao = useCallback(async (missao: MissaoJogavelResumo) => {
        setSalvando(true);
        setErro(null);

        try {
            const resposta = await NoraApi.RestGET(EventosApiRest.GET.MissoesConfiguracoesRuntime.obter, { idMissao: missao.id }, { mensagemErro: 'Não foi possível carregar a configuração runtime da Missão.' });
            if (!resposta) {
                setErro('Missão ainda não possui configuração runtime.');
                setEditorRuntimeMissao(null);
                return;
            }

            setEditorCatalogo(null);
            setEditorMissao(null);
            setEditorRuntimeMissao({ idMissao: missao.id, nomeMissao: missao.nome, textoConfiguracao: JSON.stringify(resposta.configuracao, null, 4) });
        } catch {
            setErro('Não foi possível carregar a configuração runtime da Missão.');
        } finally {
            setSalvando(false);
        }
    }, []);

    const alterarEditorRuntimeMissaoTexto = useCallback((texto: string) => { setEditorRuntimeMissao(editorAtual => editorAtual ? { ...editorAtual, textoConfiguracao: texto } : null); }, []);
    const cancelarEditorRuntimeMissao = useCallback(() => setEditorRuntimeMissao(null), []);

    const salvarEditorRuntimeMissao = useCallback(async () => {
        if (!editorRuntimeMissao) return;

        let configuracao: ConfiguracaoRuntimeMissaoJogavel;

        try {
            configuracao = JSON.parse(editorRuntimeMissao.textoConfiguracao) as ConfiguracaoRuntimeMissaoJogavel;
        } catch {
            setErro('JSON da configuração runtime está inválido.');
            return;
        }

        setSalvando(true);
        setErro(null);

        try {
            const payload: PAYLOAD__SalvarMissaoConfiguracaoRuntime = { fkMissoesId: editorRuntimeMissao.idMissao, configuracao };
            await NoraApi.RestPOST(EventosApiRest.POST.MissoesConfiguracoesRuntime.salvar, payload, { mensagemErro: 'Não foi possível salvar a configuração runtime da Missão.' });
            setEditorRuntimeMissao(null);
            await carregarEstrutura();
        } catch {
            setErro('Não foi possível salvar a configuração runtime da Missão.');
        } finally {
            setSalvando(false);
        }
    }, [editorRuntimeMissao, carregarEstrutura]);

    const alternarAtivoCatalogo = useCallback(async (catalogo: CatalogoMissaoJogavelResumo, ativo: boolean) => {
        await executaComEstrutura(() => NoraApi.RestPOST(EventosApiRest.POST.MissoesJogaveis.alternarCatalogo, { id: catalogo.id, ativo }, { mensagemErro: 'Não foi possível alternar o Catálogo de Missão.' }), 'Não foi possível alternar o Catálogo de Missão.');
    }, [executaComEstrutura]);

    const alternarAtivoMissao = useCallback(async (missao: MissaoJogavelResumo, ativo: boolean) => {
        if (ativo && !missao.runtimeConfigurado) {
            setErro('Missão precisa ter configuração runtime antes de ser ativada.');
            return;
        }

        await executaComEstrutura(() => NoraApi.RestPOST(EventosApiRest.POST.MissoesJogaveis.alternarMissao, { id: missao.id, ativo }, { mensagemErro: 'Não foi possível alternar a Missão.' }), 'Não foi possível alternar a Missão.');
    }, [executaComEstrutura]);

    const sincronizarMissoesFuncionaisIniciais = useCallback(async () => {
        setSalvando(true);
        setErro(null);

        try {
            await NoraApi.RestPOST(EventosApiRest.POST.MissoesConfiguracoesRuntime.sincronizarMissoesFuncionaisIniciais, {}, { mensagemErro: 'Não foi possível sincronizar as Missões Funcionais iniciais.' });
            await carregarEstrutura();
        } catch {
            setErro('Não foi possível sincronizar as Missões Funcionais iniciais.');
        } finally {
            setSalvando(false);
        }
    }, [carregarEstrutura]);

    const reordenarCatalogos = useCallback(async (idOrigem: number, idDestino: number) => {
        if (!estrutura || idOrigem === idDestino) return;

        const idsOrdenados = moveId(estrutura.catalogos.map(catalogo => catalogo.id), idOrigem, idDestino);
        await executaComEstrutura(() => NoraApi.RestPOST(EventosApiRest.POST.MissoesJogaveis.reordenarCatalogos, { idsCatalogosMissao: idsOrdenados }, { mensagemErro: 'Não foi possível reordenar Catálogos de Missão.' }), 'Não foi possível reordenar Catálogos de Missão.');
    }, [estrutura, executaComEstrutura]);

    const reordenarMissoesCatalogo = useCallback(async (catalogo: CatalogoMissaoJogavelResumo, idOrigem: number, idDestino: number) => {
        if (idOrigem === idDestino) return;

        const idsOrdenados = moveId(catalogo.missoes.map(missao => missao.id), idOrigem, idDestino);
        await executaComEstrutura(() => NoraApi.RestPOST(EventosApiRest.POST.MissoesJogaveis.reordenarMissoesCatalogo, { fkCatalogosMissaoId: catalogo.id, idsMissoes: idsOrdenados }, { mensagemErro: 'Não foi possível reordenar Missões.' }), 'Não foi possível reordenar Missões.');
    }, [executaComEstrutura]);

    return (
        <Contexto__PaginaGameDesignerMissoesJogaveis.Provider value={{ estrutura, carregando, salvando, erro, idsCatalogosAbertos, editorCatalogo, editorMissao, editorRuntimeMissao, recarregar: carregarEstrutura, alternarCatalogoAberto, abrirCriacaoCatalogo, abrirEdicaoCatalogo, alterarEditorCatalogoNome, cancelarEditorCatalogo, salvarEditorCatalogo, abrirCriacaoMissao, abrirEdicaoMissao, alterarEditorMissao, cancelarEditorMissao, salvarEditorMissao, abrirEditorRuntimeMissao, alterarEditorRuntimeMissaoTexto, cancelarEditorRuntimeMissao, salvarEditorRuntimeMissao, sincronizarMissoesFuncionaisIniciais, alternarAtivoCatalogo, alternarAtivoMissao, reordenarCatalogos, reordenarMissoesCatalogo }}>
            {children}
        </Contexto__PaginaGameDesignerMissoesJogaveis.Provider>
    );
};

function moveId(ids: readonly number[], idOrigem: number, idDestino: number): number[] {
    const lista = [...ids];
    const indiceOrigem = lista.indexOf(idOrigem);
    const indiceDestino = lista.indexOf(idDestino);
    if (indiceOrigem < 0 || indiceDestino < 0) return lista;

    const removidos = lista.splice(indiceOrigem, 1);
    const idRemovido = removidos[0];
    lista.splice(indiceDestino, 0, idRemovido);

    return lista;
};
