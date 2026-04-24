'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { VIEW_GrupoAventuraDetalhado } from 'types-nora-api';

import { buscaGrupoAventuraEspecifico } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaMestreAventuraProps {
    grupoAventuraSelecionada: VIEW_GrupoAventuraDetalhado;
};

const ContextoPaginaMestreAventura = createContext<ContextoPaginaMestreAventuraProps | undefined>(undefined);

export const useContextoPaginaMestreAventura = (): ContextoPaginaMestreAventuraProps => {
    const context = useContext(ContextoPaginaMestreAventura);
    if (!context) throw new Error('useContextoPaginaMestreAventura precisa estar dentro de um ContextoPaginaMestreAventura');
    return context;
};

export const ContextoPaginaMestreAventuraProvider = ({ children, idGrupoAventura }: { children: React.ReactNode; idGrupoAventura: number; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [grupoAventuraSelecionada, setGrupoAventuraSelecionada] = useState<VIEW_GrupoAventuraDetalhado | null>(null);

    async function buscaGrupoAventuraSelecionado(idGrupoAventura: number) {
        setCarregando('Buscando Aventura');

        try {
            setGrupoAventuraSelecionada(await buscaGrupoAventuraEspecifico(idGrupoAventura));
        } catch {
            setGrupoAventuraSelecionada(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaGrupoAventuraSelecionado(idGrupoAventura);
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    if (!carregando && !grupoAventuraSelecionada) return <p>Aventura não encontrada</p>;

    if (!grupoAventuraSelecionada) return;
    
    return (
        <ContextoPaginaMestreAventura.Provider value={{ grupoAventuraSelecionada }}>
            {children}
        </ContextoPaginaMestreAventura.Provider>
    );
};