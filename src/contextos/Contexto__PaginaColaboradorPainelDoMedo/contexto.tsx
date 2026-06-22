'use client';

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { criaObjetivo as apiCriaObjetivo, criaColuna as apiCriaColuna, criaCard as apiCriaCard } from 'Uteis/ApiConsumer/PainelDoMedoMiddleware';

export interface Contexto__PaginaColaboradorPainelDoMedo__Props {
    objetivos: ReturnType<typeof obtemObjetivos>;
    statusCards: ReturnType<typeof obtemStatusCards>;
    objetivoAtualId: number | null;
    setObjetivoAtualId: (id: number | null) => void;
    colunas: ReturnType<typeof obtemColunas>;
    cards: ReturnType<typeof obtemCards>;
    salvando: boolean;
    criaObjetivo: (nome: string) => Promise<void>;
    criaColuna: (nome: string) => Promise<void>;
    criaCard: (fkColunasId: number, titulo: string) => Promise<void>;
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
    const [objetivoAtualId, setObjetivoAtualId] = useState<number | null>(null);
    const [salvando, setSalvando] = useState<boolean>(false);
    const cards = obtemCards(objetivoAtualId);

    useEffect(() => {
        if (objetivoAtualId === null && objetivos.registros.length > 0) setObjetivoAtualId(objetivos.registros[0].id);
    }, [objetivoAtualId, objetivos.registros]);

    useEffect(() => {
        if (objetivoAtualId !== null) cards.recarregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objetivoAtualId]);

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

    return (
        <Contexto__PaginaColaboradorPainelDoMedo.Provider value={{ objetivos, statusCards, objetivoAtualId, setObjetivoAtualId, colunas, cards, salvando, criaObjetivo, criaColuna, criaCard }}>
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
