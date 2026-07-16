'use client';

import { createContext, useContext, useState } from 'react';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist/SPA__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist';

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];

interface Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist__Props {
    card: CardItem;
    texto: string;
    setTexto: (texto: string) => void;
    salvando: boolean;
    adicionar: () => Promise<void>;
    cancelar: () => void;
};

const Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist = createContext<Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist = (): Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist precisa estar dentro do seu Provider');
    return context;
};

// Operacao de foco unico: adicionar um item ao checklist do card.
export const Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist__Provider = () => {
    const { cards, operacaoCard, salvando, criaItemChecklist, fecharOperacaoCard } = useContexto__PaginaColaboradorPainelDoMedo();

    const card = cards.registros.find(item => item.id === operacaoCard?.cardId) ?? null;
    const [texto, setTexto] = useState<string>('');

    if (!card) return <p style={{ color: '#7c7565', padding: '1em' }}>Card não encontrado. Use o fechar do cabeçalho para voltar.</p>;

    const adicionar = async () => { if (!texto.trim()) return; await criaItemChecklist(texto); fecharOperacaoCard(); };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist.Provider value={{ card, texto, setTexto, salvando, adicionar, cancelar: fecharOperacaoCard }}>
            <SPA__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist />
        </Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist.Provider>
    );
};
