'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SessaoDto } from 'types-nora-api';
import { obtemListaProxEpisodioPrevistoPorAventuraEmAndamento } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoSessoesPrevistasProps {
    episodioSeguinte: SessaoDto | null;
    episodiosFuturos: SessaoDto[];
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

    const { episodioSeguinte, episodiosFuturos } = useMemo(() => {
        if (listaEpisodiosPrevistos.length === 0) return { episodioSeguinte: null, episodiosFuturos: [] };

        const ordenados = [...listaEpisodiosPrevistos].sort((a, b) => new Date(a.dataPrevisaoInicio || 0).getTime() - new Date(b.dataPrevisaoInicio || 0).getTime());

        const episodioSeguinte = ordenados[0];
        const episodiosFuturos = ordenados.slice(1);

        return { episodioSeguinte, episodiosFuturos };
    }, [listaEpisodiosPrevistos]);

    useEffect(() => {
        buscaListaEpisodiosPrevistos()
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoSessoesPrevistas.Provider value={{ episodioSeguinte, episodiosFuturos }}>
            {children}
        </ContextoSessoesPrevistas.Provider>
    );
};