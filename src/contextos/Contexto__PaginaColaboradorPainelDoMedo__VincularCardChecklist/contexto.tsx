'use client';

import { createContext, useContext, useMemo, useState } from 'react';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__VincularCardChecklist from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__VincularCardChecklist/SPA__PaginaColaboradorPainelDoMedo__VincularCardChecklist';

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];
type CardLeve = Contexto__PaginaColaboradorPainelDoMedo__Props['todosCards']['registros'][number];

interface Contexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist__Props {
    card: CardItem;
    busca: string;
    setBusca: (busca: string) => void;
    candidatos: readonly CardLeve[];
    salvando: boolean;
    rotuloObjetivoDoCard: (id: number) => string | null;
    vincular: (fkCardsReferenciaId: number) => Promise<void>;
};

const Contexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist = createContext<Contexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist = (): Contexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist precisa estar dentro do seu Provider');
    return context;
};

// Operacao de foco unico: vincular um cartao EXISTENTE (qualquer objetivo) como item de checklist deste card. O item resultante tem check derivado da conclusao do cartao.
export const Contexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist__Provider = () => {
    const { cards, operacaoCard, salvando, todosCards, objetivos, checklist, vinculaCardChecklist, fecharOperacaoCard } = useContexto__PaginaColaboradorPainelDoMedo();

    const card = cards.registros.find(item => item.id === operacaoCard?.cardId) ?? null;
    const [busca, setBusca] = useState<string>('');

    const jaReferenciados = useMemo(() => new Set(checklist.registros.map(item => item.fkCardsReferenciaId).filter((valor): valor is number => valor !== null)), [checklist.registros]);

    const candidatos = useMemo(() => {
        if (!card) return [];
        const termo = busca.trim().toLowerCase();
        if (!termo) return [];
        return todosCards.registros.filter(item => item.id !== card.id && !jaReferenciados.has(item.id) && item.titulo.toLowerCase().includes(termo)).slice(0, 8);
    }, [card, jaReferenciados, todosCards.registros, busca]);

    if (!card) return <p style={{ color: '#7c7565', padding: '1em' }}>Card não encontrado. Use o fechar do cabeçalho para voltar.</p>;

    const rotuloObjetivoDoCard = (id: number) => {
        const objetivoId = todosCards.registros.find(item => item.id === id)?.fkObjetivosId ?? null;
        if (objetivoId === null || objetivoId === card.fkObjetivosId) return null;
        return objetivos.registros.find(objetivo => objetivo.id === objetivoId)?.nome ?? 'outro objetivo';
    };
    const vincular = async (fkCardsReferenciaId: number) => { await vinculaCardChecklist(card.id, fkCardsReferenciaId); fecharOperacaoCard(); };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist.Provider value={{ card, busca, setBusca, candidatos, salvando, rotuloObjetivoDoCard, vincular }}>
            <SPA__PaginaColaboradorPainelDoMedo__VincularCardChecklist />
        </Contexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist.Provider>
    );
};
