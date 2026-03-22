'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { RascunhoCompletaDto } from 'types-nora-api';

import { me_obtemDetalhesRascunho } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import { Conteiner__PaginaRascunho } from 'Conteineres/PaginaRascunho/conteiner';

interface ContextoPaginaRascunhosMestre__ComRascunhoSelecionadoProps {
    rascunho: RascunhoCompletaDto;
    deselecionaRascunho: () => void;
};

const ContextoPaginaRascunhosMestre__ComRascunhoSelecionado = createContext<ContextoPaginaRascunhosMestre__ComRascunhoSelecionadoProps | undefined>(undefined);

export const useContextoPaginaRascunhosMestre__ComRascunhoSelecionado = (): ContextoPaginaRascunhosMestre__ComRascunhoSelecionadoProps => {
    const context = useContext(ContextoPaginaRascunhosMestre__ComRascunhoSelecionado);
    if (!context) throw new Error('useContextoPaginaRascunhosMestre__ComRascunhoSelecionado precisa estar dentro de um ContextoPaginaRascunhosMestre__ComRascunhoSelecionado');
    return context;
};

export const ContextoPaginaRascunhosMestre__ComRascunhoSelecionadoProvider = ({ idRascunho, deselecionaRascunho }: { idRascunho: number; deselecionaRascunho: () => void; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [rascunho, setRascunho] = useState<RascunhoCompletaDto | null>(null);

    async function buscaDetalhesRascunho() {
        setCarregando('Buscando Rascunho');

        try {
            setRascunho(await me_obtemDetalhesRascunho(idRascunho));
        } catch {
            setRascunho(null);
            toast.erro('Houve um erro ao carregar o Rascunho Selecionado');
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaDetalhesRascunho();
    }, []);

    if (carregando) return <h2>{carregando}</h2>;

    if (!rascunho) return;

    return (
        <ContextoPaginaRascunhosMestre__ComRascunhoSelecionado.Provider value={{ rascunho, deselecionaRascunho }}>
            <Conteiner__PaginaRascunho />
        </ContextoPaginaRascunhosMestre__ComRascunhoSelecionado.Provider>
    );
};