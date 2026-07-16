'use client';

import { createContext, useContext, useState } from 'react';

import type { MotivoTranca } from 'types-nora-api';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__TrancarCartao from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__TrancarCartao/SPA__PaginaColaboradorPainelDoMedo__TrancarCartao';

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];

interface Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao__Props {
    card: CardItem;
    totalEvidencias: number;
    motivo: MotivoTranca | null;
    setMotivo: (motivo: MotivoTranca | null) => void;
    salvando: boolean;
    trancar: () => Promise<void>;
    cancelar: () => void;
};

const Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao = createContext<Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__TrancarCartao = (): Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__TrancarCartao precisa estar dentro do seu Provider');
    return context;
};

// Operacao de foco unico: trancar o cartao com um motivo (Concluido/Interrompido). Trancado = nenhuma alteracao no cartao, nem pelo criador; destrancar fica na propria ficha (clique unico).
export const Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao__Provider = () => {
    const { cards, operacaoCard, salvando, trancaCard, anexosCard, fecharOperacaoCard } = useContexto__PaginaColaboradorPainelDoMedo();

    const card = cards.registros.find(item => item.id === operacaoCard?.cardId) ?? null;
    const [motivo, setMotivo] = useState<MotivoTranca | null>(null);

    if (!card) return <p style={{ color: '#7c7565', padding: '1em' }}>Card não encontrado. Use o fechar do cabeçalho para voltar.</p>;

    const trancar = async () => { if (motivo === null) return; await trancaCard(card.id, motivo); fecharOperacaoCard(); };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao.Provider value={{ card, totalEvidencias: anexosCard.length, motivo, setMotivo, salvando, trancar, cancelar: fecharOperacaoCard }}>
            <SPA__PaginaColaboradorPainelDoMedo__TrancarCartao />
        </Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao.Provider>
    );
};
