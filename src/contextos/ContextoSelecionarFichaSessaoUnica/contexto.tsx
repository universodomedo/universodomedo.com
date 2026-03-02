'use client';

import { toast } from 'Hooks/useToast';
import { createContext, useContext, useEffect, useState } from 'react';
import { FichaTemporariaDto, SessaoDto } from 'types-nora-api';

import { me_amarraFichaTemporariaEmParticipacaoDeSessaoUnica } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoSelecionarFichaSessaoUnicaProps {
    fichas: FichaTemporariaDto[];
    idFichaTemporariaSelecionada: number | null;
    setIdFichaTemporariaSelecionada: (v: number | null) => void;
    fichaSelecionada : FichaTemporariaDto | null;
    selecionarFichaTemporariaParaSessao: () => void;
    podeSalvar: boolean;
};

const ContextoSelecionarFichaSessaoUnica = createContext<ContextoSelecionarFichaSessaoUnicaProps | undefined>(undefined);

export const useContextoSelecionarFichaSessaoUnica = (): ContextoSelecionarFichaSessaoUnicaProps => {
    const context = useContext(ContextoSelecionarFichaSessaoUnica);
    if (!context) throw new Error('useContextoSelecionarFichaSessaoUnica precisa estar dentro de um ContextoSelecionarFichaSessaoUnica');
    return context;
};

export const ContextoSelecionarFichaSessaoUnicaProvider = ({ children, sessao, fichas }: { children: React.ReactNode, sessao: SessaoDto; fichas: FichaTemporariaDto[]; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [idFichaTemporariaSelecionada, setIdFichaTemporariaSelecionada] = useState<number | null>(null);

    const fichaSelecionada: FichaTemporariaDto | null = idFichaTemporariaSelecionada !== null ? (fichas.find(ficha => ficha.id === idFichaTemporariaSelecionada) || null) : null;

    const podeSalvar: boolean = idFichaTemporariaSelecionada !== null;

    async function selecionarFichaTemporariaParaSessao() {
        if (!podeSalvar) return;

        setCarregando('Buscando Rascunho');

        try {
            await me_amarraFichaTemporariaEmParticipacaoDeSessaoUnica(sessao.id, idFichaTemporariaSelecionada!);
            await toast.sucesso('Ficha Selecionada com Sucesso!', `Você vai usar a Ficha ${fichaSelecionada?.nome} na Sessão ${sessao.tituloInteligente.tituloCompleto}`, { recarregaPagina: true });
        } catch (e) {
            await toast.erro('Ficha não vinculada', e instanceof Error ? e.message : 'Falha ao vincular Ficha à Sessão');
            setCarregando(null);
        }
    }

    if (carregando) return <h2>{carregando}</h2>;

    return (
        <ContextoSelecionarFichaSessaoUnica.Provider value={{ fichas, idFichaTemporariaSelecionada, setIdFichaTemporariaSelecionada, fichaSelecionada, selecionarFichaTemporariaParaSessao, podeSalvar }}>
            {children}
        </ContextoSelecionarFichaSessaoUnica.Provider>
    );
};