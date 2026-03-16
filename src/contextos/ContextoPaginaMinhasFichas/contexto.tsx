'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FichaTemporariaVisualizacaoDetalhadaDto } from 'types-nora-api';

import { me_obtemFichas } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaMinhasFichasProps {
    fichas: FichaTemporariaVisualizacaoDetalhadaDto[];
};

const ContextoPaginaMinhasFichas = createContext<ContextoPaginaMinhasFichasProps | undefined>(undefined);

export const useContextoPaginaMinhasFichas = (): ContextoPaginaMinhasFichasProps => {
    const context = useContext(ContextoPaginaMinhasFichas);
    if (!context) throw new Error('useContextoPaginaMinhasFichas precisa estar dentro de um ContextoPaginaMinhasFichas');
    return context;
};

export const ContextoPaginaMinhasFichasProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [fichas, setFichas] = useState<FichaTemporariaVisualizacaoDetalhadaDto[]>([]);

    async function buscaFichasUsuario() {
        setCarregando('Buscando Fichas');

        try {
            setFichas(await me_obtemFichas());
        } catch {
            setFichas([]);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaFichasUsuario();
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    return (
        <ContextoPaginaMinhasFichas.Provider value={{ fichas }}>
            {children}
        </ContextoPaginaMinhasFichas.Provider>
    );
};