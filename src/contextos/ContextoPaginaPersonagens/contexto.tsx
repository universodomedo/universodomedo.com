'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { PersonagemDto } from 'types-nora-api';

import { me_obtemPersonagens, obtemDadosInteligentePersonagem } from 'Uteis/ApiConsumer/ConsumerMiddleware';

import { QUERY_PARAMS } from 'Constantes/parametros_query';

interface ContextoPaginaPersonagensProps {
    personagens: PersonagemDto[];
    setIdPersonagemSelecionado: (v: number) => void;
    deselecionaPersonagem: () => void;
    personagemSelecionado: PersonagemDto | null;
};

const ContextoPaginaPersonagens = createContext<ContextoPaginaPersonagensProps | undefined>(undefined);

export const useContextoPaginaPersonagens = (): ContextoPaginaPersonagensProps => {
    const context = useContext(ContextoPaginaPersonagens);
    if (!context) throw new Error('useContextoPaginaPersonagens precisa estar dentro de um ContextoPaginaPersonagens');
    return context;
};

export const ContextoPaginaPersonagensProvider = ({ children, idPersonagemInicial = null }: { children: React.ReactNode; idPersonagemInicial?: number | null; }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [personagens, setPersonagens] = useState<PersonagemDto[] | null>(null);
    const [idPersonagemSelecionado, setIdPersonagemSelecionado] = useState<number | null>(null);
    const [personagemSelecionado, setPersonagemSelecionado] = useState<PersonagemDto | null>(null);

    const searchParams = useSearchParams();
    const pathname = usePathname();

    async function buscaPersonagens() {
        setCarregando('Buscando Personagens');

        try {
            setPersonagens(await me_obtemPersonagens());
        } catch {
            setPersonagens(null);
        } finally {
            setCarregando(null);
        }
    };

    async function buscaPersonagemSelecionado() {
        if (!idPersonagemSelecionado) return;

        setCarregando('Buscando Personagem Selecionado');

        try {
            setPersonagemSelecionado(await obtemDadosInteligentePersonagem(idPersonagemSelecionado));
        } catch {
            setPersonagemSelecionado(null);
        } finally {
            setCarregando(null);
        }
    };

    function deselecionaPersonagem() { setIdPersonagemSelecionado(null); };

    const atualizarParametroURL = (idPersonagem: number | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (idPersonagem === null || idPersonagem === 0) {
            params.delete(QUERY_PARAMS.PERSONAGEM);
        } else {
            params.set(QUERY_PARAMS.PERSONAGEM, idPersonagem.toString());
        }

        const novaURL = `${pathname}?${params.toString()}`;

        window.history.replaceState(null, '', novaURL);
    };

    useEffect(() => {
        if (idPersonagemInicial) setIdPersonagemSelecionado(idPersonagemInicial);
        buscaPersonagens();
    }, []);

    useEffect(() => {
        if (!idPersonagemSelecionado) setPersonagemSelecionado(null);
        else buscaPersonagemSelecionado();
    }, [idPersonagemSelecionado]);

    useEffect(() => {
        if (personagemSelecionado) atualizarParametroURL(personagemSelecionado.id);
        else atualizarParametroURL(null);
    }, [personagemSelecionado]);

    if (carregando) return <div>{carregando}</div>;

    if (!carregando && !personagens) return <div>Erro ao buscar Personagens</div>

    if (!personagens) return;

    return (
        <ContextoPaginaPersonagens.Provider value={{ personagens, setIdPersonagemSelecionado, deselecionaPersonagem, personagemSelecionado }}>
            {children}
        </ContextoPaginaPersonagens.Provider>
    );
};