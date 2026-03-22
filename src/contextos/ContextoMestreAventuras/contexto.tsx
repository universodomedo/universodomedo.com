'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { GrupoAventuraCompletaDto } from 'types-nora-api';

import { me_obtemGruposPorMestre } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoMestreAventurasProps {
    gruposAventurasListadas: GrupoAventuraCompletaDto[];
};

const ContextoMestreAventuras = createContext<ContextoMestreAventurasProps | undefined>(undefined);

export const useContextoMestreAventuras = (): ContextoMestreAventurasProps => {
    const context = useContext(ContextoMestreAventuras);
    if (!context) throw new Error('useContextoMestreAventuras precisa estar dentro de um ContextoMestreAventuras');
    return context;
};

export const ContextoMestreAventurasProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [gruposAventurasListadas, setGruposAventurasListadas] = useState<GrupoAventuraCompletaDto[] | null>(null);

    async function buscaGruposAventuras() {
        setCarregando('Buscando Aventura');

        try {
            setGruposAventurasListadas(await me_obtemGruposPorMestre());
        } catch {
            setGruposAventurasListadas(null);
        } finally {
            setCarregando(null);
        }
    }

    useEffect(() => {
        buscaGruposAventuras();
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    if (!carregando && !gruposAventurasListadas) return <p>Aventura não encontrada</p>;

    if (!gruposAventurasListadas) return;

    return (
        <ContextoMestreAventuras.Provider value={{ gruposAventurasListadas }}>
            {children}
        </ContextoMestreAventuras.Provider>
    );
};