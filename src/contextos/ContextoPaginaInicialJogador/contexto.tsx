'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { FichaTemporariaDto, PersonagemDto } from 'types-nora-api';
import { me_obtemPersonagensPorTipo, me_obtemFichas } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

interface ContextoPaginaInicialJogadorProps {
    personagens: PersonagemDto[];
    fichas: FichaTemporariaDto[];
};

const ContextoPaginaInicialJogador = createContext<ContextoPaginaInicialJogadorProps | undefined>(undefined);

export const useContextoPaginaInicialJogador = (): ContextoPaginaInicialJogadorProps => {
    const context = useContext(ContextoPaginaInicialJogador);
    if (!context) throw new Error('useContextoPaginaInicialJogador precisa estar dentro de um ContextoPaginaInicialJogador');
    return context;
};

export const ContextoPaginaInicialJogadorProvider = ({ children, idTipoPersonagem }: { children: React.ReactNode; idTipoPersonagem: number; }) => {
    const [carregandoPersonagens, setCarregandoPersonagens] = useState(false);
    const [carregandoFichas, setCarregandoFichas] = useState(false);

    const [personagens, setPersonagens] = useState<PersonagemDto[]>([]);
    const [fichas, setFichas] = useState<FichaTemporariaDto[]>([]);

    async function buscaTodosPersonagensUsuario() {
        setCarregandoPersonagens(true);
        try {
            setPersonagens(await me_obtemPersonagensPorTipo(idTipoPersonagem));
        } catch {
            setPersonagens([]);
        } finally {
            setCarregandoPersonagens(false);
        }
    }

    async function buscaFichasUsuario() {
        setCarregandoFichas(true);
        try {
            setFichas(await me_obtemFichas());
        } catch {
            setFichas([]);
        } finally {
            setCarregandoFichas(false);
        }
    }

    useEffect(() => {
        buscaTodosPersonagensUsuario();
        buscaFichasUsuario();
    }, [idTipoPersonagem]);

    if (carregandoPersonagens || carregandoFichas) {
        if (carregandoPersonagens && carregandoFichas) return <div>Carregando personagens e fichas</div>;
        if (carregandoPersonagens) return <div>Carregando personagens</div>;
        return <div>Buscando fichas</div>;
    }

    return (
        <ContextoPaginaInicialJogador.Provider value={{ personagens, fichas }}>
            {children}
        </ContextoPaginaInicialJogador.Provider>
    );
};