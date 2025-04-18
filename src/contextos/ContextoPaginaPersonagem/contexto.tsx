'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { PersonagemDto } from 'types-nora-api';

import { obtemDadosPaginaPersonagens, obtemDadosPersonagemDoUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

interface ContextoPaginaPersonagemProps {
    carregando: boolean;
    listaPersonagens: PersonagemDto[] | undefined;
    buscaTodosPersonagensUsuario: () => void;
    personagemSelecionado: PersonagemDto | undefined;
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
    const [listaPersonagens, setListaPersonagens] = useState<PersonagemDto[] | undefined>(undefined);
    const [personagemSelecionado, setPersonagemSelecionado] = useState<PersonagemDto | undefined>(undefined);

    async function buscaTodosPersonagensUsuario() {
        setCarregando(true);

        try {
            setListaPersonagens(await obtemDadosPaginaPersonagens());
        } catch {
            setListaPersonagens(undefined);
        } finally {
            setCarregando(false);
        }
    }

    async function buscaDadosGeraisPersonagem(idPersonagem: number) {
        try {
            setCarregando(true);

            setPersonagemSelecionado(await obtemDadosPersonagemDoUsuario(idPersonagem));
        } catch (error) {
            setPersonagemSelecionado(undefined);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <ContextoPaginaPersonagem.Provider value={{ carregando, listaPersonagens, buscaTodosPersonagensUsuario, personagemSelecionado, buscaDadosGeraisPersonagem }}>
            {children}
        </ContextoPaginaPersonagem.Provider>
    );
};