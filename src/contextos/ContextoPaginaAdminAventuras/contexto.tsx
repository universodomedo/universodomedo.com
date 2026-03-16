'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { GrupoAventuraCompletaDto } from 'types-nora-api';

import { obtemTodosGruposParaAdmin } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaAdminAventurasProps {
    gruposAventuras: GrupoAventuraCompletaDto[];
};

const ContextoPaginaAdminAventuras = createContext<ContextoPaginaAdminAventurasProps | undefined>(undefined);

export const useContextoPaginaAdminAventuras = (): ContextoPaginaAdminAventurasProps => {
    const context = useContext(ContextoPaginaAdminAventuras);
    if (!context) throw new Error('useContextoPaginaAdminAventuras precisa estar dentro de um ContextoPaginaAdminAventuras');
    return context;
};

export const ContextoPaginaAdminAventurasProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [gruposAventuras, setGruposAventuras] = useState<GrupoAventuraCompletaDto[]>([]);

    async function buscaTodosGruposParaAdmin() {
        setCarregando('Buscando Aventuras');

        try {
            setGruposAventuras(await obtemTodosGruposParaAdmin());
        } catch {
            setGruposAventuras([]);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaTodosGruposParaAdmin();
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    return (
        <ContextoPaginaAdminAventuras.Provider value={{ gruposAventuras }}>
            {children}
        </ContextoPaginaAdminAventuras.Provider>
    );
};