'use client';

import { createContext, useContext, useMemo } from 'react';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__AplicarEtiqueta from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__AplicarEtiqueta/SPA__PaginaColaboradorPainelDoMedo__AplicarEtiqueta';

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];
type EtiquetaDisponivel = { id: number; nome: string; cor: string; corBorda: string };

interface Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta__Props {
    card: CardItem;
    disponiveis: readonly EtiquetaDisponivel[];
    salvando: boolean;
    aplicar: (etiquetaId: number) => Promise<void>;
    irParaCriar: () => void;
    cancelar: () => void;
};

const Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta = createContext<Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta = (): Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta precisa estar dentro do seu Provider');
    return context;
};

// Operacao de foco unico: aplicar uma etiqueta do catalogo ao card. "Criar nova etiqueta" navega para a operacao criar-etiqueta (que volta para ca).
export const Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta__Provider = () => {
    const { cards, operacaoCard, salvando, etiquetas, etiquetasCards, aplicaEtiquetaCard, abrirOperacaoCard, fecharOperacaoCard } = useContexto__PaginaColaboradorPainelDoMedo();

    const card = cards.registros.find(item => item.id === operacaoCard?.cardId) ?? null;

    const disponiveis = useMemo<EtiquetaDisponivel[]>(() => {
        if (!card) return [];
        const aplicadas = new Set(etiquetasCards.registros.filter(v => v.fkCardsId === card.id).map(v => v.fkEtiquetasId));
        return etiquetas.registros.filter(e => !aplicadas.has(e.id)).map(e => ({ id: e.id, nome: e.nome, cor: e.cor, corBorda: e.corBorda }));
    }, [card, etiquetas.registros, etiquetasCards.registros]);

    if (!card) return <p style={{ color: '#7c7565', padding: '1em' }}>Card não encontrado. Use o fechar do cabeçalho para voltar.</p>;

    const aplicar = async (etiquetaId: number) => { await aplicaEtiquetaCard(card.id, etiquetaId); fecharOperacaoCard(); };
    const irParaCriar = () => abrirOperacaoCard('criar-etiqueta', card.id);

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta.Provider value={{ card, disponiveis, salvando, aplicar, irParaCriar, cancelar: fecharOperacaoCard }}>
            <SPA__PaginaColaboradorPainelDoMedo__AplicarEtiqueta />
        </Contexto__PaginaColaboradorPainelDoMedo__AplicarEtiqueta.Provider>
    );
};
