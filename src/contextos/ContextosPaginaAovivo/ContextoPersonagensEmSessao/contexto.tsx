'use client';

import { createContext, useContext, useState } from 'react';
import { Eventos_Emite, PersonagemDto } from 'types-nora-api';

import { useContextoSessaoEmAndamento } from '../ContextoSessaoEmAndamento/contexto';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

interface ContextoPersonagensEmSessaoProps {
    personagensEmSessao: PersonagemDto[];
};

const ContextoPersonagensEmSessao = createContext<ContextoPersonagensEmSessaoProps | undefined>(undefined);

export const useContextoPersonagensEmSessao = (): ContextoPersonagensEmSessaoProps => {
    const context = useContext(ContextoPersonagensEmSessao);
    if (!context) throw new Error('useContextoPersonagensEmSessao precisa estar dentro de um ContextoPersonagensEmSessao');
    return context;
};

export const ContextoPersonagensEmSessaoProvider = ({ children }: { children: React.ReactNode }) => {
    const { sessaoEmAndamento } = useContextoSessaoEmAndamento();
    const [personagensEmSessao, setPersonagensEmSessao] = useState<PersonagemDto[]>([]);

    // useEmitWsComDisparoInicial(Eventos_Emite.Jogo.eventos.emitirDadosSessao, data => {
    //     setPersonagensEmSessao(data.dadosSessao[0].personagens);
    // });

    return (
        <ContextoPersonagensEmSessao.Provider value={{ personagensEmSessao }}>
            {children}
        </ContextoPersonagensEmSessao.Provider>
    );
};