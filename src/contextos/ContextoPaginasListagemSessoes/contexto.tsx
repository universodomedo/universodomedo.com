'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessaoDto } from 'types-nora-api';

import { obtemListagemGeralSessoes } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginasListagemSessoesProps {
    sessoes: SessaoDto[];
    sessaoSelecionada: SessaoDto | null;
    selecionaSessao: (idSessao: number) => void;
    deselecionaSessao: () => void;
};

const ContextoPaginasListagemSessoes = createContext<ContextoPaginasListagemSessoesProps | undefined>(undefined);

export const useContextoPaginasListagemSessoes = (): ContextoPaginasListagemSessoesProps => {
    const context = useContext(ContextoPaginasListagemSessoes);
    if (!context) throw new Error('useContextoPaginasListagemSessoes precisa estar dentro de um ContextoPaginasListagemSessoes');
    return context;
};

export const ContextoPaginasListagemSessoesProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [sessoes, setSessoes] = useState<SessaoDto[]>([]);
    const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoDto | null>(null);

    async function buscaListaSessoes() {
        setCarregando('Buscando Sessões');

        try {
            setSessoes(await obtemListagemGeralSessoes());
        } catch {
            setSessoes([]);
        } finally {
            setCarregando(null);
        }
    };

    function selecionaSessao(idSessao: number) { setSessaoSelecionada(sessoes.find(sessao => sessao.id === idSessao)!); };
    function deselecionaSessao() { setSessaoSelecionada(null); };

    const atualizarParametroURL = (sessaoId: number | null) => {
        let novoPathname: string;

        if (sessaoId === null || sessaoId === 0) {
            novoPathname = '/sessoes';
        } else {
            novoPathname = `/sessao/${sessaoId}`;
        }

        window.history.replaceState(null, '', novoPathname);
    };

    useEffect(() => {
        buscaListaSessoes();
    }, []);

    useEffect(() => {
        if (sessaoSelecionada) atualizarParametroURL(sessaoSelecionada.id);
        else atualizarParametroURL(null);
    }, [sessaoSelecionada]);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoPaginasListagemSessoes.Provider value={{ sessoes, sessaoSelecionada, selecionaSessao, deselecionaSessao }}>
            {children}
        </ContextoPaginasListagemSessoes.Provider>
    );
};