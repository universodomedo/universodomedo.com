'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PersonagemDto, SessaoDto, SOCKET_EVENTOS } from 'types-nora-api';

import useSocketEvent from 'Hooks/useSocketEvent';
import { useSocketEmit } from 'Hooks/useSocketEmit';

interface ContextoPaginaAovivoProps {
    sessaoEmAndamento: SessaoDto | null;
    personagensEmSessao: PersonagemDto[];
};

const ContextoPaginaAovivo = createContext<ContextoPaginaAovivoProps | undefined>(undefined);

export const useContextoPaginaAovivo = (): ContextoPaginaAovivoProps => {
    const context = useContext(ContextoPaginaAovivo);
    if (!context) throw new Error('useContextoPaginaAovivo precisa estar dentro de um ContextoPaginaAovivo');
    return context;
};

export const ContextoPaginaAovivoProvider = ({ children }: { children: React.ReactNode }) => {
    const [ sessaoEmAndamento, setSessaoEmAndamento ] = useState<SessaoDto | null>(null);
    const [ personagensEmSessao, setPersonagensEmSessao ] = useState<PersonagemDto[]>([]);

    useSocketEvent<SessaoDto>(
        SOCKET_EVENTOS.PaginaAovivo.receberSessaoEmAndamento,
        (sessao) => {
            console.log(`alou`);
            console.log(sessao);
            setSessaoEmAndamento(sessao);
        }
    );

    useSocketEmit(SOCKET_EVENTOS.PaginaAovivo.obterSessaoEmAndamento);

    return (
        <ContextoPaginaAovivo.Provider value={{ sessaoEmAndamento, personagensEmSessao }}>
            {children}
        </ContextoPaginaAovivo.Provider>
    );
};