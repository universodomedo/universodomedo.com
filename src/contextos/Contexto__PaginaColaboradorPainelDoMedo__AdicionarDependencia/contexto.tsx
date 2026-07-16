'use client';

import { createContext, useContext, useMemo, useState } from 'react';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__AdicionarDependencia from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__AdicionarDependencia/SPA__PaginaColaboradorPainelDoMedo__AdicionarDependencia';

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];
type CardLeve = Contexto__PaginaColaboradorPainelDoMedo__Props['todosCards']['registros'][number];

interface Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia__Props {
    card: CardItem;
    busca: string;
    setBusca: (busca: string) => void;
    candidatos: readonly CardLeve[];
    salvando: boolean;
    rotuloObjetivoDoCard: (id: number) => string | null;
    adicionar: (fkCardsRequisitoId: number) => Promise<void>;
    cancelar: () => void;
};

const Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia = createContext<Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia = (): Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia precisa estar dentro do seu Provider');
    return context;
};

// Operacao de foco unico: adicionar uma dependencia (card requisito) ao card. Busca global (qualquer objetivo).
export const Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia__Provider = () => {
    const { cards, operacaoCard, salvando, dependenciasCards, todosCards, objetivos, criaDependenciaCard, fecharOperacaoCard } = useContexto__PaginaColaboradorPainelDoMedo();

    const card = cards.registros.find(item => item.id === operacaoCard?.cardId) ?? null;
    const [busca, setBusca] = useState<string>('');

    const jaRequisitos = useMemo(() => new Set(card ? dependenciasCards.registros.filter(dep => dep.fkCardsDependenteId === card.id).map(dep => dep.fkCardsRequisitoId) : []), [card, dependenciasCards.registros]);

    const candidatos = useMemo(() => {
        if (!card) return [];
        const termo = busca.trim().toLowerCase();
        if (!termo) return [];
        return todosCards.registros.filter(item => item.id !== card.id && !jaRequisitos.has(item.id) && item.titulo.toLowerCase().includes(termo)).slice(0, 8);
    }, [card, jaRequisitos, todosCards.registros, busca]);

    if (!card) return <p style={{ color: '#7c7565', padding: '1em' }}>Card não encontrado. Use o fechar do cabeçalho para voltar.</p>;

    const rotuloObjetivoDoCard = (id: number) => {
        const objetivoId = todosCards.registros.find(item => item.id === id)?.fkObjetivosId ?? null;
        if (objetivoId === null || objetivoId === card.fkObjetivosId) return null;
        return objetivos.registros.find(objetivo => objetivo.id === objetivoId)?.nome ?? 'outro objetivo';
    };
    const adicionar = async (fkCardsRequisitoId: number) => { await criaDependenciaCard(card.id, fkCardsRequisitoId, null, true); fecharOperacaoCard(); };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia.Provider value={{ card, busca, setBusca, candidatos, salvando, rotuloObjetivoDoCard, adicionar, cancelar: fecharOperacaoCard }}>
            <SPA__PaginaColaboradorPainelDoMedo__AdicionarDependencia />
        </Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia.Provider>
    );
};
