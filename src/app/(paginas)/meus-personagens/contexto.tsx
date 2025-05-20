'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { PersonagemDto } from 'types-nora-api';
import { obtemPersonagensDoUsuario, obtemDadosPersonagemDoUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

interface ContextoPaginaPersonagemProps {
    personagensDoUsuario: PersonagemDto[] | null;
    personagemSelecionado: PersonagemDto | null;
    buscaDadosPersonagemSelecionado: (idPersonagem: number) => void;
    deselecionaPersonagem: () => void;
};

const ContextoPaginaPersonagem = createContext<ContextoPaginaPersonagemProps | undefined>(undefined);

export const useContextoPaginaPersonagem = (): ContextoPaginaPersonagemProps => {
    const context = useContext(ContextoPaginaPersonagem);
    if (!context) throw new Error('useContextoPaginaPersonagem precisa estar dentro de um ContextoPaginaPersonagem');
    return context;
};

export const ContextoPaginaPersonagemProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState(true);
    const [personagensDoUsuario, setPersonagensDoUsuario] = useState<PersonagemDto[] | null>(null);
    const [personagemSelecionado, setPersonagemSelecionado] = useState<PersonagemDto | null>(null);

    async function buscaTodosPersonagensUsuario() {
        setCarregando(true);

        try {
            setPersonagensDoUsuario(await obtemPersonagensDoUsuario());
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
        <ContextoPaginaPersonagem.Provider value={{ personagensDoUsuario, personagemSelecionado, buscaDadosPersonagemSelecionado, deselecionaPersonagem }}>
            {children}
        </ContextoPaginaPersonagem.Provider>
    );
};