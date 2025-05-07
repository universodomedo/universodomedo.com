'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FichaPersonagemDto, PersonagemDto } from 'types-nora-api';
import { obtemPersonagensComEvolucaoPendente, obtemPersogemEmProcessoDeEvolucao, salvarEvolucaoDoPersonagem } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoEvoluindoPersonagemProps {
    listaPersonagensEvolucaoPendente: PersonagemDto[] | null;
    buscaPersonagensComEvolucaoPendente: () => void;
    selecionaPersonagemEvoluindo: (idPersonagem: number) => void;
    deselecionaPersonagemEvoluindo: () => void;
    personagemEvoluindo: PersonagemDto | null;
    salvarEvolucao: (idFichaPendente: number, resumoProvisorio: string) => void;
    // salvarEvolucao: (ficha: FichaPersonagemDto) => void;
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

    async function deselecionaPersonagemEvoluindo() {
        setPersonagemEvoluindo(null);
    }

    async function salvarEvolucao(idFichaPendente: number, resumoProvisorio: string) {
    // async function salvarEvolucao(ficha: FichaPersonagemDto) {
        setCarregando(true);

        try {
            await salvarEvolucaoDoPersonagem(idFichaPendente, resumoProvisorio);
            window.location.reload();
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
        <ContextoEvoluindoPersonagem.Provider value={{ listaPersonagensEvolucaoPendente, buscaPersonagensComEvolucaoPendente, selecionaPersonagemEvoluindo, deselecionaPersonagemEvoluindo, personagemEvoluindo, salvarEvolucao }}>
            {children}
        </ContextoEvoluindoPersonagem.Provider>
    );
};