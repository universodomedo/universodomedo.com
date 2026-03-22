'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SessaoCompletaDto, SessaoEmVisualizacaoDto } from 'types-nora-api';

import { obtemListaSessoesPrevistas } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import SPA__PaginaAoVivo__EmEspera from 'Conteineres/PaginaAoVivo/paginas/SPA__PaginaAoVivo__EmEspera/SPA__PaginaAoVivo__EmEspera';

interface ContextoPaginaAoVivo__EmEsperaProps {
    episodioSeguinte: SessaoEmVisualizacaoDto | null;
    episodiosFuturos: SessaoEmVisualizacaoDto[];
};

const ContextoPaginaAoVivo__EmEspera = createContext<ContextoPaginaAoVivo__EmEsperaProps | undefined>(undefined);

export const useContextoPaginaAoVivo__EmEspera = (): ContextoPaginaAoVivo__EmEsperaProps => {
    const context = useContext(ContextoPaginaAoVivo__EmEspera);
    if (!context) throw new Error('useContextoPaginaAoVivo__EmEspera precisa estar dentro de um ContextoPaginaAoVivo__EmEspera');
    return context;
};

export const ContextoPaginaAoVivo__EmEsperaProvider = () => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [listaEpisodiosPrevistos, setListaEpisodiosPrevistos] = useState<SessaoEmVisualizacaoDto[]>([]);

    async function buscaListaEpisodiosPrevistos() {
        setCarregando('Buscando Sessões');

        try {
            setListaEpisodiosPrevistos(await obtemListaSessoesPrevistas());
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
        <ContextoPaginaAoVivo__EmEspera.Provider value={{ episodioSeguinte, episodiosFuturos }}>
            <SPA__PaginaAoVivo__EmEspera />
        </ContextoPaginaAoVivo__EmEspera.Provider>
    );
};