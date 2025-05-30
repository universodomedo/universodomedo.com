'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessaoDto } from 'types-nora-api';
import { obtemListaProxEpisodioPrevistoPorAventuraEmAndamento } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoSessoesPrevistasProps {
    listaEpisodiosPrevistos: SessaoDto[];
};

const ContextoSessoesPrevistas = createContext<ContextoSessoesPrevistasProps | undefined>(undefined);

export const useContextoSessoesPrevistas = (): ContextoSessoesPrevistasProps => {
    const context = useContext(ContextoSessoesPrevistas);
    if (!context) throw new Error('useContextoSessoesPrevistas precisa estar dentro de um ContextoSessoesPrevistas');
    return context;
};

export const ContextoSessoesPrevistasProvider = ({ children }: { children: React.ReactNode }) => {
    const [listaEpisodiosPrevistos, setListaEpisodiosPrevistos] = useState<SessaoDto[]>([]);
    const [carregando, setCarregando] = useState<string | null>('');

    async function buscaListaEpisodiosPrevistos() {
        setCarregando('Buscando Sessões');

        try {
            setListaEpisodiosPrevistos(await obtemListaProxEpisodioPrevistoPorAventuraEmAndamento());
        } catch {
            setListaEpisodiosPrevistos([]);
        } finally {
            setCarregando(null);
        }
    }

    useEffect(() => {
        buscaListaEpisodiosPrevistos()
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoSessoesPrevistas.Provider value={{ listaEpisodiosPrevistos }}>
            {children}
        </ContextoSessoesPrevistas.Provider>
    );
};