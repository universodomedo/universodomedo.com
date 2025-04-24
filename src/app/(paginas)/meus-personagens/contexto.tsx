'use client';

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { PersonagemDto } from 'types-nora-api';

import { obtemDadosPaginaPersonagens, obtemDadosPersonagemDoUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

interface ContextoPaginaPersonagemProps {
    listaPersonagens: PersonagemDto[] | null;
    personagemSelecionado: PersonagemDto | null;
    buscaDadosGeraisPersonagem: (idPersonagem: number) => void;
};

const ContextoPaginaPersonagem = createContext<ContextoPaginaPersonagemProps | undefined>(undefined);

export const useContextoPaginaPersonagem = (): ContextoPaginaPersonagemProps => {
    const context = useContext(ContextoPaginaPersonagem);
    if (!context) throw new Error('useContextoPaginaPersonagem precisa estar dentro de um ContextoPaginaPersonagem');
    return context;
};

export const ContextoPaginaPersonagemProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState(true);
    const [listaPersonagens, setListaPersonagens] = useState<PersonagemDto[] | null>(null);
    const [personagemSelecionado, setPersonagemSelecionado] = useState<PersonagemDto | null>(null);

    async function buscaTodosPersonagensUsuario() {
        setCarregando(true);

        try {
            setListaPersonagens(await obtemDadosPaginaPersonagens());
        } catch {
            setListaPersonagens(null);
        } finally {
            setCarregando(false);
        }
    }

    async function buscaDadosGeraisPersonagem(idPersonagem: number) {
        try {
            setCarregando(true);

            setPersonagemSelecionado(await obtemDadosPersonagemDoUsuario(idPersonagem));
        } catch (error) {
            setPersonagemSelecionado(null);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscaTodosPersonagensUsuario();
    }, []);

    if (carregando) return <div>Carregando personagens</div>;

    return (
        <ContextoPaginaPersonagem.Provider value={{ listaPersonagens, personagemSelecionado, buscaDadosGeraisPersonagem }}>
            {children}
        </ContextoPaginaPersonagem.Provider>
    );
};