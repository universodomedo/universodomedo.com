'use client';

import { toast } from 'Hooks/useToast';
import { createContext, useContext, useState } from 'react';
import { FichaTemporariaVisualizacaoDetalhadaDto, VIEW_SessaoDeJogadorDto } from 'types-nora-api';

import { me_amarraFichaTemporariaEmParticipacaoDeSessaoUnica } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoSelecionarFichaSessaoUnicaProps {
    fichas: FichaTemporariaVisualizacaoDetalhadaDto[];
    idFichaTemporariaSelecionada: number | null;
    setIdFichaTemporariaSelecionada: (v: number | null) => void;
    fichaSelecionada : FichaTemporariaVisualizacaoDetalhadaDto | null;
    selecionarFichaTemporariaParaSessao: () => void;
    podeSalvar: boolean;
};

const ContextoSelecionarFichaSessaoUnica = createContext<ContextoSelecionarFichaSessaoUnicaProps | undefined>(undefined);

export const useContextoSelecionarFichaSessaoUnica = (): ContextoSelecionarFichaSessaoUnicaProps => {
    const context = useContext(ContextoSelecionarFichaSessaoUnica);
    if (!context) throw new Error('useContextoSelecionarFichaSessaoUnica precisa estar dentro de um ContextoSelecionarFichaSessaoUnica');
    return context;
};

export const ContextoSelecionarFichaSessaoUnicaProvider = ({ children, sessao, fichas }: { children: React.ReactNode, sessao: VIEW_SessaoDeJogadorDto; fichas: FichaTemporariaVisualizacaoDetalhadaDto[]; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [idFichaTemporariaSelecionada, setIdFichaTemporariaSelecionada] = useState<number | null>(null);

    const fichaSelecionada: FichaTemporariaVisualizacaoDetalhadaDto | null = idFichaTemporariaSelecionada !== null ? (fichas.find(ficha => ficha.id === idFichaTemporariaSelecionada) || null) : null;

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