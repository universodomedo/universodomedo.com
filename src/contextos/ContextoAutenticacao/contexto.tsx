'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { verificaLogado } from "Uteis/ApiConsumer/ConsumerMiddleware";

interface ContextoAutenticacaoProps {
    estaAutenticado: boolean;
};

const ContextoAutenticacao = createContext<ContextoAutenticacaoProps | undefined>(undefined);

export const useContextoAutenticacao = (): ContextoAutenticacaoProps => {
    const context = useContext(ContextoAutenticacao);
    if (!context) throw new Error('useContextoAutenticacao precisa estar dentro de um ContextoAutenticacao');
    return context;
};

export const ContextoAutenticacaoProvider = ({ children }: { children: React.ReactNode }) => {
    const [estaAutenticado, setEstaAutenticado] = useState(false);

    const checkAuth = async () => {
        try {
            const response = await verificaLogado();
            console.log({response});
            setEstaAutenticado(response.sucesso);
        } catch (error) {
            setEstaAutenticado(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <ContextoAutenticacao.Provider value={{ estaAutenticado }}>
            {children}
        </ContextoAutenticacao.Provider>
    );
};