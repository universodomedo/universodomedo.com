'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { PersonagemDto } from 'types-nora-api';
import { me_obtemPersonagens, obtemDadosPersonagemDoUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

interface ContextoListagemPersonagensProps {
    personagens: PersonagemDto[] | null;
};

const ContextoListagemPersonagens = createContext<ContextoListagemPersonagensProps | undefined>(undefined);

export const useContextoListagemPersonagens = (): ContextoListagemPersonagensProps => {
    const context = useContext(ContextoListagemPersonagens);
    if (!context) throw new Error('useContextoListagemPersonagens precisa estar dentro de um ContextoListagemPersonagens');
    return context;
};

export const ContextoListagemPersonagensProvider = ({ children, idTipoPersonagem }: { children: React.ReactNode; idTipoPersonagem: number; }) => {
    const [carregando, setCarregando] = useState(true);
    const [personagens, setPersonagens] = useState<PersonagemDto[] | null>(null);

    async function buscaTodosPersonagensUsuario() {
        setCarregando(true);

        try {
            setPersonagens(await me_obtemPersonagens(idTipoPersonagem));
        } catch {
            setPersonagens(null);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscaTodosPersonagensUsuario();
    }, []);

    if (carregando) return <div>Carregando personagens</div>;

    return (
        <ContextoListagemPersonagens.Provider value={{ personagens }}>
            {children}
        </ContextoListagemPersonagens.Provider>
    );
};