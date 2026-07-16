'use client';

import { createContext, useContext } from 'react';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__ExcluirObjetivo from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__ExcluirObjetivo/SPA__PaginaColaboradorPainelDoMedo__ExcluirObjetivo';

type ObjetivoItem = Contexto__PaginaColaboradorPainelDoMedo__Props['objetivos']['registros'][number];

interface Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo__Props {
    objetivo: ObjetivoItem;
    contagemCards: number;
    salvando: boolean;
    excluir: () => Promise<void>;
    cancelar: () => void;
};

const Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo = createContext<Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo = (): Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo precisa estar dentro do seu Provider');
    return context;
};

// Operacao de foco unico: excluir o objetivo (o backend so permite sem cards). Sucesso volta para a listagem de objetivos.
export const Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo__Provider = () => {
    const { objetivos, todosCards, operacaoObjetivo, salvando, deletaObjetivo, fecharOperacaoObjetivo, irParaListagem } = useContexto__PaginaColaboradorPainelDoMedo();

    const objetivo = objetivos.registros.find(item => item.id === operacaoObjetivo?.objetivoId) ?? null;

    if (!objetivo) return <p style={{ color: '#7c7565', padding: '1em' }}>Objetivo não encontrado. Use o fechar do cabeçalho para voltar.</p>;

    const contagemCards = todosCards.registros.filter(card => card.fkObjetivosId === objetivo.id).length;
    const excluir = async () => { await deletaObjetivo(objetivo.id); fecharOperacaoObjetivo(); irParaListagem(); };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo.Provider value={{ objetivo, contagemCards, salvando, excluir, cancelar: fecharOperacaoObjetivo }}>
            <SPA__PaginaColaboradorPainelDoMedo__ExcluirObjetivo />
        </Contexto__PaginaColaboradorPainelDoMedo__ExcluirObjetivo.Provider>
    );
};
