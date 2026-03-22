'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PersonagemVisualizacaoDetalhadaDto } from 'types-nora-api';

import { me_obtemPersonagensPorTipo } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

interface ContextoListagemPersonagensProps {
    personagens: PersonagemVisualizacaoDetalhadaDto[];
};

const ContextoListagemPersonagens = createContext<ContextoListagemPersonagensProps | undefined>(undefined);

export const useContextoListagemPersonagens = (): ContextoListagemPersonagensProps => {
    const context = useContext(ContextoListagemPersonagens);
    if (!context) throw new Error('useContextoListagemPersonagens precisa estar dentro de um ContextoListagemPersonagens');
    return context;
};

export const ContextoListagemPersonagensProvider = ({ children, idTipoPersonagem }: { children: React.ReactNode; idTipoPersonagem: number; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [personagens, setPersonagens] = useState<PersonagemVisualizacaoDetalhadaDto[]>([]);

    async function buscaTodosPersonagensUsuario() {
        setCarregando('Carregando personagens');

        try {
            setPersonagens(await me_obtemPersonagensPorTipo(idTipoPersonagem));
        } catch {
            setPersonagens([]);
        } finally {
            setCarregando(null);
        }
    }

    useEffect(() => {
        buscaTodosPersonagensUsuario();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoListagemPersonagens.Provider value={{ personagens }}>
            {children}
        </ContextoListagemPersonagens.Provider>
    );
};