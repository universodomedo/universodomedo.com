'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { GrupoAventuraCompletaDto } from 'types-nora-api';

import { buscaGrupoAventuraEspecifico } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaAdminAventuraProps {
    grupoAventura: GrupoAventuraCompletaDto;
};

const ContextoPaginaAdminAventura = createContext<ContextoPaginaAdminAventuraProps | undefined>(undefined);

export const useContextoPaginaAdminAventura = (): ContextoPaginaAdminAventuraProps => {
    const context = useContext(ContextoPaginaAdminAventura);
    if (!context) throw new Error('useContextoPaginaAdminAventura precisa estar dentro de um ContextoPaginaAdminAventura');
    return context;
};

export const ContextoPaginaAdminAventuraProvider = ({ children, idGrupoAventura }: { children: React.ReactNode; idGrupoAventura: number; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [grupoAventura, setGrupoAventura] = useState<GrupoAventuraCompletaDto | null>(null);

    async function obtemGrupoAventuraEspecifico() {
        setCarregando('Buscando Aventura');

        try {
            setGrupoAventura(await buscaGrupoAventuraEspecifico(idGrupoAventura));
        } catch {
            setGrupoAventura(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        obtemGrupoAventuraEspecifico();
    }, []);

    if (carregando) return <h2>{carregando}</h2>;
    
    if (!grupoAventura) return <h2>Aventura não encontrada</h2>;

    return (
        <ContextoPaginaAdminAventura.Provider value={{ grupoAventura }}>
            {children}
        </ContextoPaginaAdminAventura.Provider>
    );
};