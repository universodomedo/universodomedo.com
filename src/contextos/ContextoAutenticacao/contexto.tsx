'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { UsuarioDto } from 'types-nora-api';
import { obtemUsuarioLogado } from "Uteis/ApiConsumer/ConsumerMiddleware";

interface ContextoAutenticacaoProps {
    usuarioLogado: UsuarioDto | null;
    carregando: boolean;
    estaAutenticado: boolean;
};

const ContextoAutenticacao = createContext<ContextoAutenticacaoProps | undefined>(undefined);

export const useContextoAutenticacao = (): ContextoAutenticacaoProps => {
    const context = useContext(ContextoAutenticacao);
    if (!context) throw new Error('useContextoAutenticacao precisa estar dentro de um ContextoAutenticacao');
    return context;
};

export const ContextoAutenticacaoProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioDto | null>(null);
    const [carregando, setCarregando] = useState(true);
    const estaAutenticado = !carregando && !!usuarioLogado;

    const checkAuth = async () => {
        try {
            const response = await obtemUsuarioLogado();
            setUsuarioLogado(response);
        } catch (error) {
            setUsuarioLogado(null);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <ContextoAutenticacao.Provider value={{ usuarioLogado, carregando, estaAutenticado }}>
            {children}
        </ContextoAutenticacao.Provider>
    );
};