'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto } from 'types-nora-api';

import { obtemListagemDePersonagensComAvatares } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';

interface ContextoGerenciarAvatares__Props {
    personagens: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto[];
    setIdPersonagemSelecionado: (v: number) => void;
    deselecionaPersonagem: () => void;
    personagemSelecionado: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto | null;
};

const ContextoGerenciarAvatares = createContext<ContextoGerenciarAvatares__Props | undefined>(undefined);

export const useContextoGerenciarAvatares = (): ContextoGerenciarAvatares__Props => {
    const context = useContext(ContextoGerenciarAvatares);
    if (!context) throw new Error('useContextoGerenciarAvatares precisa estar dentro de um ContextoGerenciarAvatares');
    return context;
};

export const ContextoGerenciarAvatares__Provider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [personagens, setPersonagens] = useState<VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto[] | null>(null);
    const [idPersonagemSelecionado, setIdPersonagemSelecionado] = useState<number | null>(null);

    const personagemSelecionado: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto | null = personagens && idPersonagemSelecionado ? personagens.find(personagem => personagem.id === idPersonagemSelecionado)! : null;

    async function buscaPersonagensListagemAvatares() {
        setCarregando('Buscando Personagens e seus Avatares');

        try {
            setPersonagens(await obtemListagemDePersonagensComAvatares());
        } catch {
            setPersonagens(null);
            toast.erro('Houve um problema ao carregar os Personagens da Listagem de Avatares');
        } finally {
            setCarregando(null);
        }
    };

    function deselecionaPersonagem() { setIdPersonagemSelecionado(null); };

    useEffect(() => {
        buscaPersonagensListagemAvatares();
    }, []);

    if (personagens === null) return;

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoGerenciarAvatares.Provider value={{ personagens, setIdPersonagemSelecionado, deselecionaPersonagem, personagemSelecionado }}>
            {children}
        </ContextoGerenciarAvatares.Provider>
    );
};