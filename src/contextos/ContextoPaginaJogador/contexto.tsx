'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { FichaTemporariaDto, PersonagemDto, SessaoDto } from 'types-nora-api';

import { me_obtemPersonagensPorTipo, me_obtemFichas, me_obtemSessoesPrevistasQueEuVouJogar } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

interface ContextoPaginaJogadorProps {
    personagens: PersonagemDto[];
    fichas: FichaTemporariaDto[];
    sessoes: SessaoDto[];

    sessaoEmFoco: SessaoDto | null;
    setIdSessaoEmFoco: (v: number | null) => void;
};

const ContextoPaginaJogador = createContext<ContextoPaginaJogadorProps | undefined>(undefined);

export const useContextoPaginaJogador = (): ContextoPaginaJogadorProps => {
    const context = useContext(ContextoPaginaJogador);
    if (!context) throw new Error('useContextoPaginaJogador precisa estar dentro de um ContextoPaginaJogador');
    return context;
};

export const ContextoPaginaJogadorProvider = ({ children, idTipoPersonagem }: { children: React.ReactNode; idTipoPersonagem: number; }) => {
    const [carregandoPersonagens, setCarregandoPersonagens] = useState(false);
    const [carregandoFichas, setCarregandoFichas] = useState(false);
    const [carregandoSessoes, setCarregandoSessoes] = useState(false);

    const [personagens, setPersonagens] = useState<PersonagemDto[]>([]);
    const [fichas, setFichas] = useState<FichaTemporariaDto[]>([]);
    const [sessoes, setSessoes] = useState<SessaoDto[]>([]);

    const [idSessaoEmFoco, setIdSessaoEmFoco] = useState<number | null>(null);
    const sessaoEmFoco = idSessaoEmFoco !== null ? (sessoes.find(sessao => sessao.id === idSessaoEmFoco) || null) : null;
    
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
        <ContextoPaginaJogador.Provider value={{ personagens, fichas, sessoes, sessaoEmFoco, setIdSessaoEmFoco }}>
            {children}
        </ContextoPaginaJogador.Provider>
    );
};