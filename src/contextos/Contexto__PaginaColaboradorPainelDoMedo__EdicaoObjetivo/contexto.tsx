'use client';

import { createContext, useContext, useState } from 'react';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SPA__PaginaColaboradorPainelDoMedo__EdicaoObjetivo from 'Conteineres/PaginaColaboradorPainelDoMedo/paginas/SPA__PaginaColaboradorPainelDoMedo__EdicaoObjetivo/SPA__PaginaColaboradorPainelDoMedo__EdicaoObjetivo';

type ObjetivoItem = Contexto__PaginaColaboradorPainelDoMedo__Props['objetivos']['registros'][number];

interface Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo__Props {
    objetivo: ObjetivoItem;
    nome: string;
    setNome: (nome: string) => void;
    salvando: boolean;
    salvar: () => Promise<void>;
};

const Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo = createContext<Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo__Props | undefined>(undefined);

export const useContexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo = (): Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo__Props => {
    const context = useContext(Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo);
    if (!context) throw new Error('useContexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo precisa estar dentro do seu Provider');
    return context;
};

// Operacao de foco unico: editar o nome do objetivo. Layout (subtitulo/fecharProps) dirigido pelo contexto geral.
export const Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo__Provider = () => {
    const { objetivos, operacaoObjetivo, salvando, atualizaObjetivo, fecharOperacaoObjetivo } = useContexto__PaginaColaboradorPainelDoMedo();

    const objetivo = objetivos.registros.find(item => item.id === operacaoObjetivo?.objetivoId) ?? null;
    const [nome, setNome] = useState<string>(objetivo?.nome ?? '');

    if (!objetivo) return <p style={{ color: '#7c7565', padding: '1em' }}>Objetivo não encontrado. Use o fechar do cabeçalho para voltar.</p>;

    const salvar = async () => {
        if (!nome.trim()) return;
        await atualizaObjetivo(objetivo.id, nome);
        fecharOperacaoObjetivo();
    };

    return (
        <Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo.Provider value={{ objetivo, nome, setNome, salvando, salvar }}>
            <SPA__PaginaColaboradorPainelDoMedo__EdicaoObjetivo />
        </Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo.Provider>
    );
};
