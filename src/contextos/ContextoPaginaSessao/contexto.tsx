'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessaoDto } from 'types-nora-api';

import { obtemDadosPublicosSessao } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaSessaoProps {
    sessaoSelecionada: SessaoDto;
};

const ContextoPaginaSessao = createContext<ContextoPaginaSessaoProps | undefined>(undefined);

export const useContextoPaginaSessao = (): ContextoPaginaSessaoProps => {
    const context = useContext(ContextoPaginaSessao);
    if (!context) throw new Error('useContextoPaginaSessao precisa estar dentro de um ContextoPaginaSessao');
    return context;
};

export const ContextoPaginaSessaoProvider = ({ children, idSessao }: { children: React.ReactNode; idSessao: number; }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoDto | null>(null);

    async function buscaSessaoSelecionada(idSessao: number) {
        setCarregando('Buscando Sessão');

        try {
            setSessaoSelecionada(await obtemDadosPublicosSessao(idSessao));
        } catch {
            setSessaoSelecionada(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaSessaoSelecionada(idSessao);
    }, [idSessao]);

    if (carregando) return <div>{carregando}</div>;

    if (!carregando && !sessaoSelecionada) return <div>Erro ao buscar Sessão</div>

    if (!sessaoSelecionada) return;

    return (
        <ContextoPaginaSessao.Provider value={{ sessaoSelecionada }}>
            {children}
        </ContextoPaginaSessao.Provider>
    );
};