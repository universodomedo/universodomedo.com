'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessaoDto } from 'types-nora-api';

import { obtemSessaoGeral } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaAdminSessaoProps {
    sessao: SessaoDto;
};

const ContextoPaginaAdminSessao = createContext<ContextoPaginaAdminSessaoProps | undefined>(undefined);

export const useContextoPaginaAdminSessao = (): ContextoPaginaAdminSessaoProps => {
    const context = useContext(ContextoPaginaAdminSessao);
    if (!context) throw new Error('useContextoPaginaAdminSessao precisa estar dentro de um ContextoPaginaAdminSessao');
    return context;
};

export const ContextoPaginaAdminSessaoProvider = ({ children, idSessao }: { children: React.ReactNode; idSessao: number; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [sessao, setSessao] = useState<SessaoDto | null>(null);

    async function buscaSessaoGeral() {
        setCarregando('Buscando Sessão');

        try {
            setSessao(await obtemSessaoGeral(idSessao));
        } catch {
            setSessao(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaSessaoGeral();
    }, []);

    if (carregando) return <h2>{carregando}</h2>;
    
    if (!sessao) return <h2>Sessão não encontrada</h2>;

    return (
        <ContextoPaginaAdminSessao.Provider value={{ sessao }}>
            {children}
        </ContextoPaginaAdminSessao.Provider>
    );
};