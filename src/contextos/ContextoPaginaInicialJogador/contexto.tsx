'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { FichaTemporariaDto, PersonagemDto, SessaoDto } from 'types-nora-api';
import { me_obtemPersonagensPorTipo, me_obtemFichas, me_obtemSessoesPrevistasQueEuVouJogar } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

interface ContextoPaginaInicialJogadorProps {
    personagens: PersonagemDto[];
    fichas: FichaTemporariaDto[];
    sessoes: SessaoDto[];
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
    const [carregandoSessoes, setCarregandoSessoes] = useState(false);

    const [personagens, setPersonagens] = useState<PersonagemDto[]>([]);
    const [fichas, setFichas] = useState<FichaTemporariaDto[]>([]);
    const [sessoes, setSessoes] = useState<SessaoDto[]>([]);

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

    async function buscaSessoesPrevistas() {
        setCarregandoSessoes(true);
        try {
            setSessoes(await me_obtemSessoesPrevistasQueEuVouJogar());
        } catch {
            setSessoes([]);
        } finally {
            setCarregandoSessoes(false);
        }
    }

    useEffect(() => {
        buscaTodosPersonagensUsuario();
        buscaFichasUsuario();
        buscaSessoesPrevistas();
    }, [idTipoPersonagem]);

    if (carregandoPersonagens || carregandoFichas || carregandoSessoes) {
        let mensagemCarregando = '';
        if (carregandoPersonagens) mensagemCarregando += 'Carregando seus personagens...\n';
        if (carregandoFichas) mensagemCarregando += 'Carregando suas fichas...\n';
        if (carregandoSessoes) mensagemCarregando += 'Carregando suas sessões...\n';
        return <div style={{ whiteSpace: 'pre-line' }}>{mensagemCarregando}</div>;
    }

    return (
        <ContextoPaginaInicialJogador.Provider value={{ personagens, fichas, sessoes }}>
            {children}
        </ContextoPaginaInicialJogador.Provider>
    );
};