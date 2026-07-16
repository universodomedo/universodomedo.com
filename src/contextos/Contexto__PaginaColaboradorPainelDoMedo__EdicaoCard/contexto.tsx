'use client';

import { createContext, useContext, useState } from 'react';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__EdicaoCard from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__EdicaoCard/SPA__PaginaColaboradorPainelDoMedo__EdicaoCard';

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];

interface Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard__Props {
    card: CardItem;
    titulo: string;
    setTitulo: (titulo: string) => void;
    salvando: boolean;
    salvar: () => Promise<void>;
    cancelar: () => void;
};

const Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard = createContext<Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__EdicaoCard = (): Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__EdicaoCard precisa estar dentro de um Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard');
    return context;
};

// Layout contextual (subtitulo/fecharProps) e dirigido pelo contexto geral (dono unico); este subfluxo so apresenta.
export const Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard__Provider = () => {
    const { cards, operacaoCard, salvando, atualizaCard, fecharOperacaoCard } = useContexto__PaginaColaboradorPainelDoMedo();

    const card = cards.registros.find(item => item.id === operacaoCard?.cardId) ?? null;
    const [titulo, setTitulo] = useState<string>(card?.titulo ?? '');

    if (!card) {
        return <p style={{ color: '#7c7565', padding: '1em' }}>Card não encontrado. Use o fechar do cabeçalho para voltar.</p>;
    }

    // Edicao restrita ao titulo: o prazo atual do card e preservado no salvar.
    const salvar = async () => {
        if (!titulo.trim()) return;
        await atualizaCard(card.id, titulo, card.prazo ? new Date(card.prazo).toISOString() : null);
        fecharOperacaoCard();
    };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard.Provider value={{ card, titulo, setTitulo, salvando, salvar, cancelar: fecharOperacaoCard }}>
            <SPA__PaginaColaboradorPainelDoMedo__EdicaoCard />
        </Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard.Provider>
    );
};
