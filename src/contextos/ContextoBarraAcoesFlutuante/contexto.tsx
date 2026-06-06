'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface AcaoBarra {
    id: string;
    rotulo: string;
    icone: ReactNode;
    visivel: boolean | (() => boolean);
    onClick: () => void;
    atributoAlvo?: string;
    destacado?: boolean;
};

interface ContextoBarraAcoesFlutuanteProps {
    acoes: AcaoBarra[];
    registrarAcao: (acao: AcaoBarra) => void;
    removerAcao: (id: string) => void;
    expandido: boolean;
    definirExpandido: (valor: boolean) => void;
};

const ContextoBarraAcoesFlutuante = createContext<ContextoBarraAcoesFlutuanteProps | undefined>(undefined);

export const useContextoBarraAcoesFlutuante = (): ContextoBarraAcoesFlutuanteProps => {
    const context = useContext(ContextoBarraAcoesFlutuante);
    if (!context) throw new Error('useContextoBarraAcoesFlutuante precisa estar dentro de ContextoBarraAcoesFlutuante__Provider');
    return context;
};

interface ContextoBarraAcoesFlutuante__ProviderProps {
    children: ReactNode;
    acoesIniciais?: AcaoBarra[];
};

export const ContextoBarraAcoesFlutuante__Provider = ({ children, acoesIniciais = [] }: ContextoBarraAcoesFlutuante__ProviderProps) => {
    const [acoes, setAcoes] = useState<AcaoBarra[]>(acoesIniciais);
    const [expandido, setExpandido] = useState(false);

    const registrarAcao = useCallback((acao: AcaoBarra) => {
        setAcoes(prev => {
            const jaExiste = prev.some(a => a.id === acao.id);
            if (jaExiste) return prev.map(a => a.id === acao.id ? acao : a);
            return [...prev, acao];
        });
    }, []);

    const removerAcao = useCallback((id: string) => {
        setAcoes(prev => prev.filter(a => a.id !== id));
    }, []);

    const definirExpandido = useCallback((valor: boolean) => { setExpandido(valor); }, []);

    return (
        <ContextoBarraAcoesFlutuante.Provider value={{ acoes, registrarAcao, removerAcao, expandido, definirExpandido }}>
            {children}
        </ContextoBarraAcoesFlutuante.Provider>
    );
};
