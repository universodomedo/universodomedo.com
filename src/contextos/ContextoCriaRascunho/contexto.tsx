'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useContextoRascunhosMestre } from 'Contextos/ContextoRascunhosMestre/contexto';
import { me_salvarRascunho } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoCriaRascunhoProps {
    titulo: string;
    setTitulo: (v: string) => void;
    idEstiloSessaoSelecionado: number;
    setIdEstiloSessaoSelecionado: (v: number) => void;
    podeCriar: boolean;
    handleCriar: () => void;
};

const ContextoCriaRascunho = createContext<ContextoCriaRascunhoProps | undefined>(undefined);

export const useContextoCriaRascunho = (): ContextoCriaRascunhoProps => {
    const context = useContext(ContextoCriaRascunho);
    if (!context) throw new Error('useContextoCriaRascunho precisa estar dentro de um ContextoCriaRascunho');
    return context;
};

export const ContextoCriaRascunhoProvider = ({ children }: { children: React.ReactNode }) => {
    const { estilosSessaoMestrada } = useContextoRascunhosMestre();
    const [titulo, setTitulo] = useState('');
    const [idEstiloSessaoSelecionado, setIdEstiloSessaoSelecionado] = useState<number>(estilosSessaoMestrada.length === 1 ? estilosSessaoMestrada[0].id : 0);

    const podeCriar: boolean = (titulo !== '' && idEstiloSessaoSelecionado > 0);

    async function handleCriar() {
        // quando Sessão Única, pega o tipo de Sessão Única. Quando Aventura, direto Aventura
        const respostaCriacaoRascunho = await me_salvarRascunho(titulo, idEstiloSessaoSelecionado);

        if (!respostaCriacaoRascunho) {
            alert('Erro ao criar rascunho');
        } else {
            window.location.reload();
        }
    };
    
    return (
        <ContextoCriaRascunho.Provider value={{ titulo, setTitulo, idEstiloSessaoSelecionado, setIdEstiloSessaoSelecionado, podeCriar, handleCriar }}>
            {children}
        </ContextoCriaRascunho.Provider>
    );
};