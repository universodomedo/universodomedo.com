'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PersonagemDto } from 'types-nora-api';
import { obtemPersonagensComEvolucaoPendente, obtemPersogemEmProcessoDeEvolucao } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoEvoluindoPersonagemProps {
    listaPersonagensEvolucaoPendente: PersonagemDto[] | null;
    buscaPersonagensComEvolucaoPendente: () => void;
    selecionaPersonagemEvoluindo: (idPersonagem: number) => void;
    personagemEvoluindo: PersonagemDto | null;
};

const ContextoEvoluindoPersonagem = createContext<ContextoEvoluindoPersonagemProps | undefined>(undefined);

export const useContextoEvoluindoPersonagem = (): ContextoEvoluindoPersonagemProps => {
    const context = useContext(ContextoEvoluindoPersonagem);
    if (!context) throw new Error('useContextoEvoluindoPersonagem precisa estar dentro de um ContextoEvoluindoPersonagem');
    return context;
};

export const ContextoEvoluindoPersonagemProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState(true);
    const [listaPersonagensEvolucaoPendente, setListaPersonagensEvolucaoPendente] = useState<PersonagemDto[] | null>(null);
    const [personagemEvoluindo, setPersonagemEvoluindo] = useState<PersonagemDto | null>(null);

    async function buscaPersonagensComEvolucaoPendente() {
        setCarregando(true);

        try {
            setListaPersonagensEvolucaoPendente(await obtemPersonagensComEvolucaoPendente());
        } catch {
            setListaPersonagensEvolucaoPendente(null);
        } finally {
            setCarregando(false);
        }
    }

    async function selecionaPersonagemEvoluindo(idPersonagem: number) {
        setCarregando(true);

        try {
            setPersonagemEvoluindo(await obtemPersogemEmProcessoDeEvolucao(idPersonagem));
        } catch {
            setPersonagemEvoluindo(null);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscaPersonagensComEvolucaoPendente();
    }, []);

    if (carregando) return <div>Carregando personagens</div>;

    return (
        <ContextoEvoluindoPersonagem.Provider value={{ listaPersonagensEvolucaoPendente, buscaPersonagensComEvolucaoPendente, selecionaPersonagemEvoluindo, personagemEvoluindo }}>
            {children}
        </ContextoEvoluindoPersonagem.Provider>
    );
};