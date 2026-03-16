'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessaoCompletaDto } from 'types-nora-api';

import { me_obtemSessoesUnicasPorMestre } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaMestreSessoesUnicasProps {
    sessoesUnicas: SessaoCompletaDto[];
};

const ContextoPaginaMestreSessoesUnicas = createContext<ContextoPaginaMestreSessoesUnicasProps | undefined>(undefined);

export const useContextoPaginaMestreSessoesUnicas = (): ContextoPaginaMestreSessoesUnicasProps => {
    const context = useContext(ContextoPaginaMestreSessoesUnicas);
    if (!context) throw new Error('useContextoPaginaMestreSessoesUnicas precisa estar dentro de um ContextoPaginaMestreSessoesUnicas');
    return context;
};

export const ContextoPaginaMestreSessoesUnicasProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [sessoesUnicas, setSessoesUnicas] = useState<SessaoCompletaDto[]>([]);

    async function buscaSessoesUnicas() {
        setCarregando('Buscando Sessões Únicas');

        try {
            setSessoesUnicas(await me_obtemSessoesUnicasPorMestre());
        } catch {
            setSessoesUnicas([]);
        } finally {
            setCarregando(null);
        }
    }

    useEffect(() => {
        buscaSessoesUnicas();
    }, []);

    if (carregando) return <h2>{carregando}</h2>;

    return (
        <ContextoPaginaMestreSessoesUnicas.Provider value={{ sessoesUnicas }}>
            {children}
        </ContextoPaginaMestreSessoesUnicas.Provider>
    );
};