'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DetalheSessaoCanonicaParaAssistirDto } from 'types-nora-api';

import SPA__PaginaAssistir__PaginaInicial from 'Conteineres/PaginaAssistir/paginas/SPA__PaginaAssistir__PaginaInicial/SPA__PaginaAssistir__PaginaInicial';
import { obtemUltimaSessoesPostadas } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaAssistir__PaginaInicialProps {
    detalhesUltimasSessoesPostadas: DetalheSessaoCanonicaParaAssistirDto[] | null;
};

const ContextoPaginaAssistir__PaginaInicial = createContext<ContextoPaginaAssistir__PaginaInicialProps | undefined>(undefined);

export const useContextoPaginaAssistir__PaginaInicial = (): ContextoPaginaAssistir__PaginaInicialProps => {
    const context = useContext(ContextoPaginaAssistir__PaginaInicial);
    if (!context) throw new Error('useContextoPaginaAssistir__PaginaInicial precisa estar dentro de um ContextoPaginaAssistir__PaginaInicial');
    return context;
};

export const ContextoPaginaAssistir__PaginaInicialProvider = () => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [detalhesUltimasSessoesPostadas, setDetalhesUltimasSessoesPostadas] = useState<DetalheSessaoCanonicaParaAssistirDto[] | null>(null);

    async function buscaUltimaSessoesPostadas() {
        setCarregando('Buscando Últimas Sessões Postadas');

        try {
            setDetalhesUltimasSessoesPostadas(await obtemUltimaSessoesPostadas());
        } catch {
            setDetalhesUltimasSessoesPostadas(null);
        } finally {
            setCarregando(null);
        }
    }

    useEffect(() => {
        buscaUltimaSessoesPostadas();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoPaginaAssistir__PaginaInicial.Provider value={{ detalhesUltimasSessoesPostadas }}>
            <SPA__PaginaAssistir__PaginaInicial />
        </ContextoPaginaAssistir__PaginaInicial.Provider>
    );
};