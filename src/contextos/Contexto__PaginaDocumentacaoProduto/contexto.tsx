'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PAYLOAD__AtualizarDocumentacaoPagina } from 'types-nora-api';

import type { TipoCta } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { atualizaCta, atualizaDocumentacaoPagina, atualizaJornada, atualizaNecessidade, atualizaPersona, atualizaTipoSecao, criaCta, criaDocumentacaoPagina, criaJornada, criaLigacaoPaginas, criaNecessidade, criaPersona, criaTipoSecao, definePosicaoMapaPagina, removeCtaPersona, removeLigacaoPaginas, vinculaCtaPersona } from 'Uteis/ApiConsumer/DocumentacaoProdutoMiddleware';

export type DestinoCta = { fkPaginasNavegacaoId: number | null; fkJornadasId: number | null };

export type RegistroPaginaParaDocumentar = ReturnType<typeof obtemListagemPaginasParaDocumentar>['registros'][number];
export type RegistroDocumentacaoPagina = ReturnType<typeof obtemListagemDocumentacoes>['registros'][number];
export type RegistroPersona = ReturnType<typeof obtemListagemPersonas>['registros'][number];
export type RegistroNecessidade = ReturnType<typeof obtemListagemNecessidades>['registros'][number];
export type RegistroLigacaoPagina = ReturnType<typeof obtemListagemLigacoes>['registros'][number];
export type RegistroPosicaoMapaPagina = ReturnType<typeof obtemListagemPosicoes>['registros'][number];
export type RegistroJornada = ReturnType<typeof obtemListagemJornadas>['registros'][number];
export type RegistroCta = ReturnType<typeof obtemListagemCtas>['registros'][number];
export type RegistroCtaPersona = ReturnType<typeof obtemListagemCtasPersonas>['registros'][number];
export type RegistroTipoSecao = ReturnType<typeof obtemListagemTiposSecao>['registros'][number];

// Campos editoriais derivados do contrato (payload de atualização sem o id) — nunca redeclarados localmente.
export type CamposEditoriaisDocumentacao = Omit<PAYLOAD__AtualizarDocumentacaoPagina, 'id'>;

export interface Contexto__PaginaDocumentacaoProduto__Props {
    listagemPaginas: ReturnType<typeof obtemListagemPaginasParaDocumentar>;
    listagemDocumentacoes: ReturnType<typeof obtemListagemDocumentacoes>;
    listagemPersonas: ReturnType<typeof obtemListagemPersonas>;
    listagemNecessidades: ReturnType<typeof obtemListagemNecessidades>;
    listagemLigacoes: ReturnType<typeof obtemListagemLigacoes>;
    listagemPosicoes: ReturnType<typeof obtemListagemPosicoes>;
    paginaSelecionada: RegistroPaginaParaDocumentar | null;
    documentacaoSelecionada: RegistroDocumentacaoPagina | null;
    editandoDocumentacao: boolean;
    abrirEdicaoDocumentacao: () => void;
    fecharEdicaoDocumentacao: () => void;
    gerindoCatalogo: boolean;
    mapaAberto: boolean;
    estaDocumentada: (idPagina: number) => boolean;
    selecionarPagina: (pagina: RegistroPaginaParaDocumentar) => void;
    voltar: () => void;
    abrirCatalogo: () => void;
    fecharCatalogo: () => void;
    abrirMapa: () => void;
    fecharMapa: () => void;
    listagemJornadas: ReturnType<typeof obtemListagemJornadas>;
    vendoJornadas: boolean;
    abrirJornadas: () => void;
    fecharJornadas: () => void;
    vendoEdicao: boolean;
    abrirEdicao: () => void;
    fecharEdicao: () => void;
    listagemCtas: ReturnType<typeof obtemListagemCtas>;
    listagemCtasPersonas: ReturnType<typeof obtemListagemCtasPersonas>;
    listagemTiposSecao: ReturnType<typeof obtemListagemTiposSecao>;
    gerindoCtas: boolean;
    abrirCtas: () => void;
    fecharCtas: () => void;
    criarCta: (label: string, tipo: TipoCta, destino: DestinoCta, importancia: string | null) => Promise<void>;
    atualizarCta: (id: number, label: string, tipo: TipoCta, destino: DestinoCta, importancia: string | null) => Promise<void>;
    vincularCtaPersona: (fkCtasId: number, fkPersonasId: number) => Promise<void>;
    removerCtaPersona: (idVinculo: number) => Promise<void>;
    criarTipoSecao: (rotulo: string) => Promise<void>;
    atualizarTipoSecao: (id: number, rotulo: string, ativo: boolean) => Promise<void>;
    criarJornada: (fkPersonasId: number, titulo: string, descricao: string | null) => Promise<void>;
    atualizarJornada: (id: number, titulo: string, descricao: string | null) => Promise<void>;
    criarLigacao: (fkPaginasNavegacaoOrigemId: number, fkPaginasNavegacaoDestinoId: number) => Promise<void>;
    removerLigacao: (idLigacao: number) => Promise<void>;
    definirPosicao: (fkPaginasNavegacaoId: number, posicaoX: number, posicaoY: number) => Promise<void>;
    salvarDocumentacao: (campos: CamposEditoriaisDocumentacao) => Promise<void>;
    criarPersona: (nome: string, descricao: string | null) => Promise<void>;
    atualizarPersona: (id: number, nome: string, descricao: string | null, ativo: boolean) => Promise<void>;
    criarNecessidade: (fkPersonasId: number, titulo: string, descricao: string | null) => Promise<void>;
    atualizarNecessidade: (id: number, titulo: string, descricao: string | null) => Promise<void>;
};

const Contexto__PaginaDocumentacaoProduto = createContext<Contexto__PaginaDocumentacaoProduto__Props | undefined>(undefined);

export const useContexto__PaginaDocumentacaoProduto = (): Contexto__PaginaDocumentacaoProduto__Props => {
    const context = useContext(Contexto__PaginaDocumentacaoProduto);
    if (!context) throw new Error('useContexto__PaginaDocumentacaoProduto precisa estar dentro de um Contexto__PaginaDocumentacaoProduto');
    return context;
};

export const Contexto__PaginaDocumentacaoProduto__Provider = ({ children }: { children: React.ReactNode }) => {
    const listagemPaginas = obtemListagemPaginasParaDocumentar();
    const listagemDocumentacoes = obtemListagemDocumentacoes();
    const listagemPersonas = obtemListagemPersonas();
    const listagemNecessidades = obtemListagemNecessidades();
    const listagemLigacoes = obtemListagemLigacoes();
    const listagemPosicoes = obtemListagemPosicoes();
    const [paginaSelecionada, setPaginaSelecionada] = useState<RegistroPaginaParaDocumentar | null>(null);
    const [editandoDocumentacao, setEditandoDocumentacao] = useState<boolean>(false);
    const [gerindoCatalogo, setGerindoCatalogo] = useState<boolean>(false);
    const [mapaAberto, setMapaAberto] = useState<boolean>(false);
    const listagemJornadas = obtemListagemJornadas();
    const [vendoJornadas, setVendoJornadas] = useState<boolean>(false);
    const [vendoEdicao, setVendoEdicao] = useState<boolean>(false);
    const listagemCtas = obtemListagemCtas();
    const listagemCtasPersonas = obtemListagemCtasPersonas();
    const listagemTiposSecao = obtemListagemTiposSecao();
    const [gerindoCtas, setGerindoCtas] = useState<boolean>(false);

    const documentacaoSelecionada = useMemo<RegistroDocumentacaoPagina | null>(() => {
        if (paginaSelecionada === null) return null;
        return listagemDocumentacoes.registros.find(documentacao => documentacao.fkPaginasNavegacaoId === paginaSelecionada.id) ?? null;
    }, [paginaSelecionada, listagemDocumentacoes.registros]);

    const idsPaginasDocumentadas = useMemo<Set<number>>(() => new Set(listagemDocumentacoes.registros.map(documentacao => documentacao.fkPaginasNavegacaoId)), [listagemDocumentacoes.registros]);
    const estaDocumentada = useCallback((idPagina: number) => idsPaginasDocumentadas.has(idPagina), [idsPaginasDocumentadas]);

    // Abrir uma página cai sempre no modo leitura (verbete-documento); editar é ação explícita.
    const selecionarPagina = useCallback((pagina: RegistroPaginaParaDocumentar) => { setPaginaSelecionada(pagina); setEditandoDocumentacao(false); }, []);
    const voltar = useCallback(() => { setPaginaSelecionada(null); setEditandoDocumentacao(false); }, []);
    const abrirEdicaoDocumentacao = useCallback(() => setEditandoDocumentacao(true), []);
    const fecharEdicaoDocumentacao = useCallback(() => setEditandoDocumentacao(false), []);
    const abrirCatalogo = useCallback(() => setGerindoCatalogo(true), []);
    const fecharCatalogo = useCallback(() => setGerindoCatalogo(false), []);
    const abrirMapa = useCallback(() => setMapaAberto(true), []);
    const fecharMapa = useCallback(() => setMapaAberto(false), []);
    const abrirJornadas = useCallback(() => setVendoJornadas(true), []);
    const fecharJornadas = useCallback(() => setVendoJornadas(false), []);
    const abrirEdicao = useCallback(() => setVendoEdicao(true), []);
    const fecharEdicao = useCallback(() => setVendoEdicao(false), []);
    const abrirCtas = useCallback(() => setGerindoCtas(true), []);
    const fecharCtas = useCallback(() => setGerindoCtas(false), []);

    const recarregarCtas = listagemCtas.recarregar;
    const criarCta = useCallback(async (label: string, tipo: TipoCta, destino: DestinoCta, importancia: string | null): Promise<void> => { await criaCta({ label, tipo, fkPaginasNavegacaoId: destino.fkPaginasNavegacaoId, fkJornadasId: destino.fkJornadasId, importancia }); recarregarCtas(); }, [recarregarCtas]);
    const atualizarCta = useCallback(async (id: number, label: string, tipo: TipoCta, destino: DestinoCta, importancia: string | null): Promise<void> => { await atualizaCta({ id, label, tipo, fkPaginasNavegacaoId: destino.fkPaginasNavegacaoId, fkJornadasId: destino.fkJornadasId, importancia }); recarregarCtas(); }, [recarregarCtas]);

    const recarregarCtasPersonas = listagemCtasPersonas.recarregar;
    const vincularCtaPersona = useCallback(async (fkCtasId: number, fkPersonasId: number): Promise<void> => { await vinculaCtaPersona({ fkCtasId, fkPersonasId }); recarregarCtasPersonas(); }, [recarregarCtasPersonas]);
    const removerCtaPersona = useCallback(async (idVinculo: number): Promise<void> => { await removeCtaPersona({ id: idVinculo }); recarregarCtasPersonas(); }, [recarregarCtasPersonas]);

    const recarregarTiposSecao = listagemTiposSecao.recarregar;
    const criarTipoSecao = useCallback(async (rotulo: string): Promise<void> => { await criaTipoSecao({ rotulo }); recarregarTiposSecao(); }, [recarregarTiposSecao]);
    const atualizarTipoSecao = useCallback(async (id: number, rotulo: string, ativo: boolean): Promise<void> => { await atualizaTipoSecao({ id, rotulo, ativo }); recarregarTiposSecao(); }, [recarregarTiposSecao]);

    const recarregarJornadas = listagemJornadas.recarregar;
    const criarJornada = useCallback(async (fkPersonasId: number, titulo: string, descricao: string | null): Promise<void> => { await criaJornada({ fkPersonasId, titulo, descricao }); recarregarJornadas(); }, [recarregarJornadas]);
    const atualizarJornada = useCallback(async (id: number, titulo: string, descricao: string | null): Promise<void> => { await atualizaJornada({ id, titulo, descricao }); recarregarJornadas(); }, [recarregarJornadas]);

    const recarregarLigacoes = listagemLigacoes.recarregar;
    const criarLigacao = useCallback(async (fkPaginasNavegacaoOrigemId: number, fkPaginasNavegacaoDestinoId: number): Promise<void> => { await criaLigacaoPaginas({ fkPaginasNavegacaoOrigemId, fkPaginasNavegacaoDestinoId, descricao: null }); recarregarLigacoes(); }, [recarregarLigacoes]);
    const removerLigacao = useCallback(async (idLigacao: number): Promise<void> => { await removeLigacaoPaginas({ id: idLigacao }); recarregarLigacoes(); }, [recarregarLigacoes]);
    // Persiste a posição arrastada; o cliente mantém o override local (sem recarregar a listagem de posições).
    const definirPosicao = useCallback(async (fkPaginasNavegacaoId: number, posicaoX: number, posicaoY: number): Promise<void> => { await definePosicaoMapaPagina({ fkPaginasNavegacaoId, posicaoX, posicaoY }); }, []);

    const recarregarDocumentacoes = listagemDocumentacoes.recarregar;
    const salvarDocumentacao = useCallback(async (campos: CamposEditoriaisDocumentacao): Promise<void> => {
        if (paginaSelecionada === null) return;
        if (documentacaoSelecionada === null) await criaDocumentacaoPagina({ fkPaginasNavegacaoId: paginaSelecionada.id, ...campos });
        else await atualizaDocumentacaoPagina({ id: documentacaoSelecionada.id, ...campos });
        recarregarDocumentacoes();
    }, [paginaSelecionada, documentacaoSelecionada, recarregarDocumentacoes]);

    const recarregarPersonas = listagemPersonas.recarregar;
    const criarPersona = useCallback(async (nome: string, descricao: string | null): Promise<void> => { await criaPersona({ nome, descricao }); recarregarPersonas(); }, [recarregarPersonas]);
    const atualizarPersona = useCallback(async (id: number, nome: string, descricao: string | null, ativo: boolean): Promise<void> => { await atualizaPersona({ id, nome, descricao, ativo }); recarregarPersonas(); }, [recarregarPersonas]);

    const recarregarNecessidades = listagemNecessidades.recarregar;
    const criarNecessidade = useCallback(async (fkPersonasId: number, titulo: string, descricao: string | null): Promise<void> => { await criaNecessidade({ fkPersonasId, titulo, descricao }); recarregarNecessidades(); }, [recarregarNecessidades]);
    const atualizarNecessidade = useCallback(async (id: number, titulo: string, descricao: string | null): Promise<void> => { await atualizaNecessidade({ id, titulo, descricao }); recarregarNecessidades(); }, [recarregarNecessidades]);

    return (
        <Contexto__PaginaDocumentacaoProduto.Provider value={{ listagemPaginas, listagemDocumentacoes, listagemPersonas, listagemNecessidades, listagemLigacoes, listagemPosicoes, listagemJornadas, listagemCtas, listagemCtasPersonas, listagemTiposSecao, paginaSelecionada, documentacaoSelecionada, editandoDocumentacao, abrirEdicaoDocumentacao, fecharEdicaoDocumentacao, gerindoCatalogo, mapaAberto, vendoJornadas, vendoEdicao, gerindoCtas, estaDocumentada, selecionarPagina, voltar, abrirCatalogo, fecharCatalogo, abrirMapa, fecharMapa, abrirJornadas, fecharJornadas, abrirEdicao, fecharEdicao, abrirCtas, fecharCtas, criarLigacao, removerLigacao, definirPosicao, criarJornada, atualizarJornada, criarCta, atualizarCta, vincularCtaPersona, removerCtaPersona, criarTipoSecao, atualizarTipoSecao, salvarDocumentacao, criarPersona, atualizarPersona, criarNecessidade, atualizarNecessidade }}>
            {children}
        </Contexto__PaginaDocumentacaoProduto.Provider>
    );
};

//

// Listagem das páginas reais da plataforma (fonte: site.paginas_navegacao) — o território a documentar.
function obtemListagemPaginasParaDocumentar() {
    return useNoraGraphQLListagem('PaginaNavegacao', {
        select: ['id', 'label', 'chave', 'template', 'ativo'],
        camposFiltroConsulta: ['label', 'chave', 'ativo'],
        camposFiltroVisualizacao: ['label', 'chave', 'ativo'],
        itensPorPagina: 200,
        carregando: 'Buscando páginas',
        mensagemErro: 'Houve um erro recuperando as páginas',
        mensagemListaVazia: 'Nenhuma página cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma página encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { label: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Todas as documentações existentes — dados de apoio pro estado documentada/sem documentação e pro verbete da página selecionada.
function obtemListagemDocumentacoes() {
    return useNoraGraphQLListagem('DocumentacaoPagina', {
        select: ['id', 'fkPaginasNavegacaoId', 'objetivo', 'informacoesConsumidas', 'informacoesGeradas', 'statusImplementacao', 'composicao', 'composicaoDescricao', 'dataAtualizacao'],
        itensPorPagina: 500,
        carregando: 'Buscando documentações',
        mensagemErro: 'Houve um erro recuperando as documentações',
        mensagemListaVazia: 'Nenhuma documentação registrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma documentação encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Arestas autorais do Mapa de Navegação (ligação página→página).
function obtemListagemLigacoes() {
    return useNoraGraphQLListagem('LigacaoPagina', {
        select: ['id', 'fkPaginasNavegacaoOrigemId', 'fkPaginasNavegacaoDestinoId', 'descricao'],
        itensPorPagina: 500,
        carregando: 'Buscando ligações',
        mensagemErro: 'Houve um erro recuperando as ligações do mapa',
        mensagemListaVazia: 'Nenhuma ligação registrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma ligação encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Posições persistidas dos nós do Mapa de Navegação (página sem linha cai no layout default por área).
function obtemListagemPosicoes() {
    return useNoraGraphQLListagem('PosicaoMapaPagina', {
        select: ['id', 'fkPaginasNavegacaoId', 'posicaoX', 'posicaoY'],
        itensPorPagina: 500,
        carregando: 'Buscando posições',
        mensagemErro: 'Houve um erro recuperando as posições do mapa',
        mensagemListaVazia: 'Nenhuma posição registrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma posição encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Jornadas por persona (o caminho da persona pelas páginas até um objetivo).
function obtemListagemJornadas() {
    return useNoraGraphQLListagem('Jornada', {
        select: ['id', 'titulo', 'descricao', 'fkPersonasId'],
        camposFiltroConsulta: ['titulo'],
        camposFiltroVisualizacao: ['titulo'],
        itensPorPagina: 200,
        carregando: 'Buscando jornadas',
        mensagemErro: 'Houve um erro recuperando as jornadas',
        mensagemListaVazia: 'Nenhuma jornada cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma jornada encontrada com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { titulo: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Catálogo global de CTAs (reutilizáveis entre páginas). Destino (página/jornada) e labels mapeados no front.
function obtemListagemCtas() {
    return useNoraGraphQLListagem('Cta', {
        select: ['id', 'label', 'tipo', 'fkPaginasNavegacaoId', 'fkJornadasId', 'importancia'],
        camposFiltroConsulta: ['label', 'tipo'],
        camposFiltroVisualizacao: ['label', 'tipo'],
        itensPorPagina: 300,
        carregando: 'Buscando CTAs',
        mensagemErro: 'Houve um erro recuperando as CTAs',
        mensagemListaVazia: 'Nenhuma CTA cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma CTA encontrada com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { label: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Públicos (personas) de cada CTA — N por CTA.
function obtemListagemCtasPersonas() {
    return useNoraGraphQLListagem('CtaPersona', {
        select: ['id', 'fkCtasId', 'fkPersonasId'],
        itensPorPagina: 1000,
        carregando: 'Buscando públicos das CTAs',
        mensagemErro: 'Houve um erro recuperando os públicos das CTAs',
        mensagemListaVazia: 'Nenhum público vinculado.',
        mensagemListaVaziaComFiltro: 'Nenhum público encontrado.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

// Catálogo de tipos de seção (hero, carrossel, grid, highlight, etc.).
function obtemListagemTiposSecao() {
    return useNoraGraphQLListagem('TipoSecao', {
        select: ['id', 'rotulo', 'ativo'],
        camposFiltroConsulta: ['rotulo'],
        camposFiltroVisualizacao: ['rotulo'],
        itensPorPagina: 200,
        carregando: 'Buscando tipos de seção',
        mensagemErro: 'Houve um erro recuperando os tipos de seção',
        mensagemListaVazia: 'Nenhum tipo de seção cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum tipo encontrado com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { rotulo: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

function obtemListagemPersonas() {
    return useNoraGraphQLListagem('Persona', {
        select: ['id', 'nome', 'descricao', 'ativo'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 100,
        carregando: 'Buscando personas',
        mensagemErro: 'Houve um erro recuperando as personas',
        mensagemListaVazia: 'Nenhuma persona cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma persona encontrada com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

function obtemListagemNecessidades() {
    return useNoraGraphQLListagem('Necessidade', {
        select: ['id', 'titulo', 'descricao', 'fkPersonasId'],
        camposFiltroConsulta: ['titulo'],
        camposFiltroVisualizacao: ['titulo'],
        itensPorPagina: 200,
        carregando: 'Buscando necessidades',
        mensagemErro: 'Houve um erro recuperando as necessidades',
        mensagemListaVazia: 'Nenhuma necessidade cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma necessidade encontrada com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { titulo: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};