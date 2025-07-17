'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AventuraDto } from 'types-nora-api';
import { obtemGrupoAventuraParaAssistir } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaMestreAventuraProps {
    aventuraSelecionada: AventuraDto;
};

const ContextoPaginaMestreAventura = createContext<ContextoPaginaMestreAventuraProps | undefined>(undefined);

export const useContextoPaginaMestreAventura = (): ContextoPaginaMestreAventuraProps => {
    const context = useContext(ContextoPaginaMestreAventura);
    if (!context) throw new Error('useContextoPaginaMestreAventura precisa estar dentro de um ContextoPaginaMestreAventura');
    return context;
};

export const ContextoPaginaMestreAventuraProvider = ({ children, idGrupoAventura }: { children: React.ReactNode; idGrupoAventura: number; }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [aventuraSelecionada, setAventuraSelecionada] = useState<AventuraDto | null>(null);

    async function buscaGrupoAventuraSelecionado(idGrupoAventura: number) {
        setCarregando('Buscando Aventura');

        try {
            setAventuraSelecionada(await obtemGrupoAventuraParaAssistir(idGrupoAventura));
        } catch {
            setAventuraSelecionada(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaGrupoAventuraSelecionado(idGrupoAventura);
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    if (!carregando && !aventuraSelecionada) return <p>Aventura não encontrada</p>;

    if (!aventuraSelecionada) return;
    
    return (
        <ContextoPaginaMestreAventura.Provider value={{ aventuraSelecionada }}>
            {children}
        </ContextoPaginaMestreAventura.Provider>
    );
};