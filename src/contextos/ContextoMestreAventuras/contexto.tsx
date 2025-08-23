'use client';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { createContext, useContext, useEffect, useState } from 'react';
import { GrupoAventuraDto } from 'types-nora-api';
import { obtemGruposPorMestre } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoMestreAventurasProps {
    gruposAventurasListadas: GrupoAventuraDto[];
};

const ContextoMestreAventuras = createContext<ContextoMestreAventurasProps | undefined>(undefined);

export const useContextoMestreAventuras = (): ContextoMestreAventurasProps => {
    const context = useContext(ContextoMestreAventuras);
    if (!context) throw new Error('useContextoMestreAventuras precisa estar dentro de um ContextoMestreAventuras');
    return context;
};

export const ContextoMestreAventurasProvider = ({ children }: { children: React.ReactNode }) => {
    const { usuarioLogado } = useContextoAutenticacao();
    const [carregando, setCarregando] = useState<string | null>('');
    const [gruposAventurasListadas, setGruposAventurasListadas] = useState<GrupoAventuraDto[] | null>(null);

    async function buscaGruposAventuras() {
        setCarregando('Buscando Aventura');

        try {
            setGruposAventurasListadas(await obtemGruposPorMestre(usuarioLogado!.id));
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