'use client';

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';

import { Eventos_Emite } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useRecebeEmitWs } from 'Hooks/useEventoWs';
import { criaObjetivo as apiCriaObjetivo, criaColuna as apiCriaColuna, criaCard as apiCriaCard, criaComentario as apiCriaComentario, atualizaCard as apiAtualizaCard, reordenaCards as apiReordenaCards, criaDependenciaCard as apiCriaDependencia, atualizaDependenciaCard as apiAtualizaDependencia, deletaDependenciaCard as apiDeletaDependencia, definePosicaoFluxogramaCard as apiDefinePosicao } from 'Uteis/ApiConsumer/PainelDoMedoMiddleware';

export interface Contexto__PaginaColaboradorPainelDoMedo__Props {
    objetivos: ReturnType<typeof obtemObjetivos>;
    statusCards: ReturnType<typeof obtemStatusCards>;
    objetivoAtualId: number | null;
    setObjetivoAtualId: (id: number | null) => void;
    colunas: ReturnType<typeof obtemColunas>;
    cards: ReturnType<typeof obtemCards>;
    comentarios: ReturnType<typeof obtemComentarios>;
    cardAbertoId: number | null;
    abrirCard: (id: number) => void;
    fecharCard: () => void;
    salvando: boolean;
    criaObjetivo: (nome: string) => Promise<void>;
    criaColuna: (nome: string) => Promise<void>;
    criaCard: (fkColunasId: number, titulo: string) => Promise<void>;
    atualizaCard: (id: number, titulo: string, fkTiposStatusCardId: number, prazo: string | null) => Promise<void>;
    criaComentario: (texto: string) => Promise<void>;
    reordenaCards: (fkColunasId: number, idsOrdenados: number[]) => Promise<void>;
    view: 'quadro' | 'fluxograma';
    setView: (view: 'quadro' | 'fluxograma') => void;
    dependenciasCards: ReturnType<typeof obtemDependenciasCards>;
    posicoesFluxograma: ReturnType<typeof obtemPosicoesFluxograma>;
    todosCards: ReturnType<typeof obtemTodosCards>;
    criaDependenciaCard: (fkCardsDependenteId: number, fkCardsRequisitoId: number, descricao: string | null, bloqueante: boolean) => Promise<void>;
    atualizaDependenciaCard: (id: number, descricao: string | null, bloqueante: boolean) => Promise<void>;
    deletaDependenciaCard: (id: number) => Promise<void>;
    definePosicaoFluxogramaCard: (fkCardsId: number, posicaoX: number, posicaoY: number) => Promise<void>;
};

const Contexto__PaginaColaboradorPainelDoMedo = createContext<Contexto__PaginaColaboradorPainelDoMedo__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo = (): Contexto__PaginaColaboradorPainelDoMedo__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo precisa estar dentro de um Contexto__PaginaColaboradorPainelDoMedo');
    return context;
};

export const Contexto__PaginaColaboradorPainelDoMedo__Provider = ({ children }: { children: ReactNode }) => {
    const objetivos = obtemObjetivos();
    const statusCards = obtemStatusCards();
    const colunas = obtemColunas();
    const [view, setView] = useState<'quadro' | 'fluxograma'>('quadro');
    const [objetivoAtualId, setObjetivoAtualId] = useState<number | null>(null);
    const [cardAbertoId, setCardAbertoId] = useState<number | null>(null);
    const [salvando, setSalvando] = useState<boolean>(false);
    const cards = obtemCards(objetivoAtualId);
    const comentarios = obtemComentarios(cardAbertoId);
    const dependenciasCards = obtemDependenciasCards();
    const posicoesFluxograma = obtemPosicoesFluxograma();
    const todosCards = obtemTodosCards();

    useEffect(() => {
        if (objetivoAtualId === null && objetivos.registros.length > 0) setObjetivoAtualId(objetivos.registros[0].id);
    }, [objetivoAtualId, objetivos.registros]);

    useEffect(() => {
        if (objetivoAtualId !== null) cards.recarregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objetivoAtualId]);

    useEffect(() => {
        if (cardAbertoId !== null) comentarios.recarregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardAbertoId]);

    useRecebeEmitWs(Eventos_Emite.PainelDoMedo.eventos.painelAtualizado, {
        onSuccess: () => {
            objetivos.recarregar();
            colunas.recarregar();
            cards.recarregar();
            dependenciasCards.recarregar();
            posicoesFluxograma.recarregar();
            todosCards.recarregar();
            if (cardAbertoId !== null) comentarios.recarregar();
        },
    });

    const abrirCard = (id: number) => setCardAbertoId(id);
    const fecharCard = () => setCardAbertoId(null);

    const criaObjetivo = async (nome: string) => {
        if (!nome.trim() || salvando) return;
        setSalvando(true);
        try { await apiCriaObjetivo({ nome: nome.trim() }); objetivos.recarregar(); } finally { setSalvando(false); }
    };

    const criaColuna = async (nome: string) => {
        if (!nome.trim() || salvando) return;
        setSalvando(true);
        try { await apiCriaColuna({ nome: nome.trim() }); colunas.recarregar(); } finally { setSalvando(false); }
    };

    const criaCard = async (fkColunasId: number, titulo: string) => {
        const statusPadrao = statusCards.registros[0];
        if (!titulo.trim() || objetivoAtualId === null || !statusPadrao || salvando) return;
        setSalvando(true);
        try { await apiCriaCard({ fkObjetivosId: objetivoAtualId, fkColunasId, fkTiposStatusCardId: statusPadrao.id, titulo: titulo.trim() }); cards.recarregar(); } finally { setSalvando(false); }
    };

    const atualizaCard = async (id: number, titulo: string, fkTiposStatusCardId: number, prazo: string | null) => {
        if (!titulo.trim() || salvando) return;
        setSalvando(true);
        try { await apiAtualizaCard({ id, titulo: titulo.trim(), fkTiposStatusCardId, prazo }); cards.recarregar(); } finally { setSalvando(false); }
    };

    const criaComentario = async (texto: string) => {
        if (!texto.trim() || cardAbertoId === null || salvando) return;
        setSalvando(true);
        try { await apiCriaComentario({ fkCardsId: cardAbertoId, texto: texto.trim() }); comentarios.recarregar(); } finally { setSalvando(false); }
    };

    const reordenaCards = async (fkColunasId: number, idsOrdenados: number[]) => {
        if (idsOrdenados.length < 1 || salvando) return;
        setSalvando(true);
        try { await apiReordenaCards({ fkColunasId, idsOrdenados }); cards.recarregar(); } finally { setSalvando(false); }
    };

    const criaDependenciaCard = async (fkCardsDependenteId: number, fkCardsRequisitoId: number, descricao: string | null, bloqueante: boolean) => {
        if (fkCardsDependenteId === fkCardsRequisitoId || salvando) return;
        setSalvando(true);
        try { await apiCriaDependencia({ fkCardsDependenteId, fkCardsRequisitoId, descricao, bloqueante }); dependenciasCards.recarregar(); } finally { setSalvando(false); }
    };

    const atualizaDependenciaCard = async (id: number, descricao: string | null, bloqueante: boolean) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiAtualizaDependencia({ id, descricao, bloqueante }); dependenciasCards.recarregar(); } finally { setSalvando(false); }
    };

    const deletaDependenciaCard = async (id: number) => {
        if (salvando) return;
        setSalvando(true);
        try { await apiDeletaDependencia({ id }); dependenciasCards.recarregar(); } finally { setSalvando(false); }
    };

    const definePosicaoFluxogramaCard = async (fkCardsId: number, posicaoX: number, posicaoY: number) => {
        try { await apiDefinePosicao({ fkCardsId, posicaoX, posicaoY }); posicoesFluxograma.recarregar(); } catch { /* posicao sera reconciliada no proximo refetch */ }
    };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo.Provider value={{ objetivos, statusCards, objetivoAtualId, setObjetivoAtualId, colunas, cards, comentarios, cardAbertoId, abrirCard, fecharCard, salvando, criaObjetivo, criaColuna, criaCard, atualizaCard, criaComentario, reordenaCards, view, setView, dependenciasCards, posicoesFluxograma, todosCards, criaDependenciaCard, atualizaDependenciaCard, deletaDependenciaCard, definePosicaoFluxogramaCard }}>
            {children}
        </Contexto__PaginaColaboradorPainelDoMedo.Provider>
    );
};

//

function obtemObjetivos() {
    return useNoraGraphQLListagem('Objetivo', {
        select: ['id', 'nome'],
        itensPorPagina: 50,
        carregando: 'Carregando objetivos',
        mensagemErro: 'Houve um erro recuperando os objetivos',
        mensagemListaVazia: 'Nenhum objetivo ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum objetivo com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemStatusCards() {
    return useNoraGraphQLListagem('TipoStatusCard', {
        select: ['id', 'nome', 'cor', 'ordem'],
        itensPorPagina: 50,
        carregando: 'Carregando status',
        mensagemErro: 'Houve um erro recuperando os status',
        mensagemListaVazia: 'Nenhum status cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum status com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemColunas() {
    return useNoraGraphQLListagem('Coluna', {
        select: ['id', 'nome', 'ordem'],
        itensPorPagina: 50,
        carregando: 'Carregando colunas',
        mensagemErro: 'Houve um erro recuperando as colunas',
        mensagemListaVazia: 'Nenhuma coluna ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma coluna com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemCards(objetivoId: number | null) {
    const whereFixo = useMemo(() => ({ fkObjetivosId: objetivoId ?? -1 }), [objetivoId]);
    return useNoraGraphQLListagem('Card', {
        select: ['id', 'fkColunasId', 'fkTiposStatusCardId', 'titulo', 'prazo', 'ordem'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Carregando cards',
        mensagemErro: 'Houve um erro recuperando os cards',
        mensagemListaVazia: 'Nenhum card ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum card com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { ordem: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemComentarios(cardId: number | null) {
    const whereFixo = useMemo(() => ({ fkCardsId: cardId ?? -1 }), [cardId]);
    return useNoraGraphQLListagem('Comentario', {
        select: ['id', 'fkCardsId', 'texto', 'fkUsuariosCriacaoId', { usuarioCriacao: ['id', 'username'] }, 'dataCriacao'],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Carregando comentários',
        mensagemErro: 'Houve um erro recuperando os comentários',
        mensagemListaVazia: 'Nenhum comentário ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum comentário com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemDependenciasCards() {
    return useNoraGraphQLListagem('DependenciaCard', {
        select: ['id', 'fkCardsDependenteId', 'fkCardsRequisitoId', 'descricao', 'bloqueante'],
        itensPorPagina: 100,
        carregando: 'Carregando dependências',
        mensagemErro: 'Houve um erro recuperando as dependências',
        mensagemListaVazia: 'Nenhuma dependência ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma dependência com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemPosicoesFluxograma() {
    return useNoraGraphQLListagem('PosicaoFluxogramaCard', {
        select: ['id', 'fkCardsId', 'posicaoX', 'posicaoY'],
        itensPorPagina: 100,
        carregando: 'Carregando posições',
        mensagemErro: 'Houve um erro recuperando as posições',
        mensagemListaVazia: 'Nenhuma posição ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma posição com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};

function obtemTodosCards() {
    return useNoraGraphQLListagem('Card', {
        select: ['id', 'titulo', 'fkObjetivosId', 'fkColunasId', 'fkTiposStatusCardId'],
        itensPorPagina: 100,
        carregando: 'Carregando cards',
        mensagemErro: 'Houve um erro recuperando os cards',
        mensagemListaVazia: 'Nenhum card ainda.',
        mensagemListaVaziaComFiltro: 'Nenhum card com os filtros atuais.',
        montaParametrosConsulta: params => ({ where: params.where, order: { fkObjetivosId: 'ASC', id: 'ASC' }, limit: params.limit, offset: params.offset }),
    });
};
