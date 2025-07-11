'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FichaDeJogo, FichaPersonagemDto, PersonagemDto } from 'types-nora-api';
import { obtemPersonagensComEvolucaoPendente, obtemPersonagemEmProcessoDeEvolucao, salvarEvolucaoDoPersonagem } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoEvoluindoPersonagemProps {
    listaPersonagensEvolucaoPendente: PersonagemDto[] | null;
    buscaPersonagensComEvolucaoPendente: () => void;
    selecionaPersonagemEvoluindo: (idPersonagem: number) => void;
    deselecionaPersonagemEvoluindo: () => void;
    personagemEvoluindo: PersonagemDto | null;
    salvarEvolucao: (fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo) => Promise<boolean>;
};

const ContextoEvoluindoPersonagem = createContext<ContextoEvoluindoPersonagemProps | undefined>(undefined);

export const useContextoEvoluindoPersonagem = (): ContextoEvoluindoPersonagemProps => {
    const context = useContext(ContextoEvoluindoPersonagem);
    if (!context) throw new Error('useContextoEvoluindoPersonagem precisa estar dentro de um ContextoEvoluindoPersonagem');
    return context;
};

export const ContextoEvoluindoPersonagemProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [listaPersonagensEvolucaoPendente, setListaPersonagensEvolucaoPendente] = useState<PersonagemDto[] | null>(null);
    const [personagemEvoluindo, setPersonagemEvoluindo] = useState<PersonagemDto | null>(null);

    async function buscaPersonagensComEvolucaoPendente() {
        setCarregando('Buscando Personagens');

        try {
            setListaPersonagensEvolucaoPendente(await obtemPersonagensComEvolucaoPendente());
        } catch {
            setListaPersonagensEvolucaoPendente(null);
        } finally {
            setCarregando(null);
        }
    }

    async function selecionaPersonagemEvoluindo(idPersonagem: number) {
        setCarregando('Selecionando Personagem para Evoluir');

        try {
            setPersonagemEvoluindo(await obtemPersonagemEmProcessoDeEvolucao(idPersonagem));
        } catch {
            setPersonagemEvoluindo(null);
        } finally {
            setCarregando(null);
        }
    }

    async function deselecionaPersonagemEvoluindo() {
        setPersonagemEvoluindo(null);
    }

    async function salvarEvolucao(fichaEvoluida: FichaPersonagemDto, fichaDeJogoEvoluida: FichaDeJogo): Promise<boolean> {
        setCarregando('Salvando Edições do Personagem');

        try {
            return salvarEvolucaoDoPersonagem(fichaEvoluida, fichaDeJogoEvoluida);
        } catch {
            return false;
        }
    }

    useEffect(() => {
        buscaPersonagensComEvolucaoPendente();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoEvoluindoPersonagem.Provider value={{ listaPersonagensEvolucaoPendente, buscaPersonagensComEvolucaoPendente, selecionaPersonagemEvoluindo, deselecionaPersonagemEvoluindo, personagemEvoluindo, salvarEvolucao }}>
            {children}
        </ContextoEvoluindoPersonagem.Provider>
    );
};