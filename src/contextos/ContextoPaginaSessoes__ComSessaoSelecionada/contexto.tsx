'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessaoCompletaDto } from 'types-nora-api';

import { obtemSessaoGeral } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { Conteiner__PaginaVisualizacaoSessao } from 'Conteineres/PaginaVisualizacaoSessao/conteiner';

interface ContextoPaginaSessoes__ComSessaoSelecionadaProps {
    sessaoSelecionada: SessaoCompletaDto;
    deselecionaSessao: () => void;
};

const ContextoPaginaSessoes__ComSessaoSelecionada = createContext<ContextoPaginaSessoes__ComSessaoSelecionadaProps | undefined>(undefined);

export const useContextoPaginaSessoes__ComSessaoSelecionada = (): ContextoPaginaSessoes__ComSessaoSelecionadaProps => {
    const context = useContext(ContextoPaginaSessoes__ComSessaoSelecionada);
    if (!context) throw new Error('useContextoPaginaSessoes__ComSessaoSelecionada precisa estar dentro de um ContextoPaginaSessoes__ComSessaoSelecionada');
    return context;
};

export const ContextoPaginaSessoes__ComSessaoSelecionadaProvider = ({ idSessaoSelecionada, deselecionaSessao }: { idSessaoSelecionada: number; deselecionaSessao: () => void; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoCompletaDto | null>(null);

    async function buscaDadosSessaoSelecionada() {
        setCarregando('Buscando Sessão');

        try {
            setSessaoSelecionada(await obtemSessaoGeral(idSessaoSelecionada));
        } catch {
            setSessaoSelecionada(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaDadosSessaoSelecionada();
    }, []);

    if (carregando) return <h2>{carregando}</h2>;

    if (!sessaoSelecionada) return;

    return (
        <ContextoPaginaSessoes__ComSessaoSelecionada.Provider value={{ sessaoSelecionada, deselecionaSessao }}>
            <Conteiner__PaginaVisualizacaoSessao />
        </ContextoPaginaSessoes__ComSessaoSelecionada.Provider>
    );
};