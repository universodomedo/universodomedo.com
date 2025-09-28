'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PersonagemDto } from 'types-nora-api';

import { me_obtemPersonagens } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaPersonagensProps {
    personagens: PersonagemDto[];
    setIdPersonagemSelecionado: (v: number) => void;
    personagemSelecionado: PersonagemDto | null;
};

const ContextoPaginaPersonagens = createContext<ContextoPaginaPersonagensProps | undefined>(undefined);

export const useContextoPaginaPersonagens = (): ContextoPaginaPersonagensProps => {
    const context = useContext(ContextoPaginaPersonagens);
    if (!context) throw new Error('useContextoPaginaPersonagens precisa estar dentro de um ContextoPaginaPersonagens');
    return context;
};

export const ContextoPaginaPersonagensProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [personagens, setPersonagens] = useState<PersonagemDto[] | null>(null);
    const [idPersonagemSelecionado, setIdPersonagemSelecionado] = useState<number | null>(null);
    const [personagemSelecionado, setPersonagemSelecionado] = useState<PersonagemDto | null>(null);

    async function buscaPersonagens() {
        setCarregando('Buscando Personagens');

        try {
            setPersonagens(await me_obtemPersonagens());
        } catch {
            setPersonagens(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaPersonagens();
    }, []);

    useEffect(() => {
        if (!idPersonagemSelecionado) setPersonagemSelecionado(null);


    }, [idPersonagemSelecionado]);

    if (carregando) return <div>{carregando}</div>;

    if (!carregando && !personagens) return <div>Erro ao buscar Personagens</div>

    if (!personagens) return;

    return (
        <ContextoPaginaPersonagens.Provider value={{ personagens, setIdPersonagemSelecionado, personagemSelecionado }}>
            {children}
        </ContextoPaginaPersonagens.Provider>
    );
};