'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { PersonagemDto } from 'types-nora-api';
import { me_obtemPersonagens, obtemDadosPersonagemDoUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

interface ContextoListagemPersonagensProps {
    personagensDoUsuario: PersonagemDto[] | null;
    personagemSelecionado: PersonagemDto | null;
    buscaDadosPersonagemSelecionado: (idPersonagem: number) => void;
    deselecionaPersonagem: () => void;
};

const ContextoListagemPersonagens = createContext<ContextoListagemPersonagensProps | undefined>(undefined);

export const useContextoListagemPersonagens = (): ContextoListagemPersonagensProps => {
    const context = useContext(ContextoListagemPersonagens);
    if (!context) throw new Error('useContextoListagemPersonagens precisa estar dentro de um ContextoListagemPersonagens');
    return context;
};

export const ContextoListagemPersonagensProvider = ({ children, idTipoPersonagem }: { children: React.ReactNode; idTipoPersonagem: number; }) => {
    const [carregando, setCarregando] = useState(true);
    const [personagensDoUsuario, setPersonagensDoUsuario] = useState<PersonagemDto[] | null>(null);
    const [personagemSelecionado, setPersonagemSelecionado] = useState<PersonagemDto | null>(null);

    async function buscaTodosPersonagensUsuario() {
        setCarregando(true);

        try {
            setPersonagensDoUsuario(await me_obtemPersonagens(idTipoPersonagem));
        } catch {
            setPersonagensDoUsuario(null);
        } finally {
            setCarregando(false);
        }
    }

    async function buscaDadosPersonagemSelecionado(idPersonagem: number) {
        setCarregando(true);

        try {
            setPersonagemSelecionado(await obtemDadosPersonagemDoUsuario(idPersonagem));
        } catch (error) {
            setPersonagemSelecionado(null);
        } finally {
            setCarregando(false);
        }
    }

    function deselecionaPersonagem() {
        setPersonagemSelecionado(null);
    };

    useEffect(() => {
        buscaTodosPersonagensUsuario();
    }, []);

    if (carregando) return <div>Carregando personagens</div>;

    return (
        <ContextoListagemPersonagens.Provider value={{ personagensDoUsuario, personagemSelecionado, buscaDadosPersonagemSelecionado, deselecionaPersonagem }}>
            {children}
        </ContextoListagemPersonagens.Provider>
    );
};