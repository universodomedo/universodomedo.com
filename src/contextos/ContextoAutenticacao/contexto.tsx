'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { UsuarioDto } from 'types-nora-api';
import { verificaLogado, obtemUsuarioLogado } from "Uteis/ApiConsumer/ConsumerMiddleware";

interface ContextoAutenticacaoProps {
    estaAutenticado: boolean;
    usuarioLogado: UsuarioDto | undefined;
    carregando: boolean;
};

const ContextoAutenticacao = createContext<ContextoAutenticacaoProps | undefined>(undefined);

export const useContextoAutenticacao = (): ContextoAutenticacaoProps => {
    const context = useContext(ContextoAutenticacao);
    if (!context) throw new Error('useContextoAutenticacao precisa estar dentro de um ContextoAutenticacao');
    return context;
};

export const ContextoAutenticacaoProvider = ({ children }: { children: React.ReactNode }) => {
    const [estaAutenticado, setEstaAutenticado] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioDto | undefined>(undefined);
    const [carregando, setCarregando] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await verificaLogado();
            setEstaAutenticado(response.sucesso);
        } catch (error) {
            setEstaAutenticado(false);
        }
    };

    const atualizaRefUsuarioLogado = async () => {
        try {
            const response = await obtemUsuarioLogado();
            if (response.sucesso) {
                setUsuarioLogado(response.dados);
            } else {
                setUsuarioLogado(undefined);
            }
        } catch (error) {
            setUsuarioLogado(undefined);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (estaAutenticado) {
            atualizaRefUsuarioLogado();
        }
    }, [estaAutenticado]);

    return (
        <ContextoAutenticacao.Provider value={{ estaAutenticado, usuarioLogado, carregando }}>
            {children}
        </ContextoAutenticacao.Provider>
    );
};