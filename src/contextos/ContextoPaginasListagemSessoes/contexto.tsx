'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { VIEW_SessaoListagemGeralDto } from 'types-nora-api';

import { obtemListagemGeralSessoes } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import { useSincronizarQueryParamSPA } from 'Hooks/useSincronizarQueryParamSPA';
import { QUERY_PARAMS } from 'Constantes/parametros_query';

interface ContextoPaginasListagemSessoesProps {
    sessoes: VIEW_SessaoListagemGeralDto[];
    idSessaoSelecionada: number | null;
    setIdSessaoSelecionada: (idSessao: number) => void;
    deselecionaSessao: () => void;
};

const ContextoPaginasListagemSessoes = createContext<ContextoPaginasListagemSessoesProps | undefined>(undefined);

export const useContextoPaginasListagemSessoes = (): ContextoPaginasListagemSessoesProps => {
    const context = useContext(ContextoPaginasListagemSessoes);
    if (!context) throw new Error('useContextoPaginasListagemSessoes precisa estar dentro de um ContextoPaginasListagemSessoes');
    return context;
};

export const ContextoPaginasListagemSessoesProvider = ({ children, idSessaoInicial }: { children: React.ReactNode; idSessaoInicial: number | null; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [sessoes, setSessoes] = useState<VIEW_SessaoListagemGeralDto[]>([]);
    const [idSessaoSelecionada, setIdSessaoSelecionada] = useState<number | null>(idSessaoInicial ?? null);

    async function buscaListaSessoes() {
        setCarregando('Buscando Sessões');

        try {
            const lista = await obtemListagemGeralSessoes();
            setSessoes(lista);
        } catch {
            setSessoes([]);
            toast.erro('Houve um erro recuperando as Sessões à serem listadas');
        } finally {
            setCarregando(null);
        }
    };

    function deselecionaSessao() { setIdSessaoSelecionada(null); };

    useSincronizarQueryParamSPA(QUERY_PARAMS.SESSAO, idSessaoSelecionada);

    useEffect(() => {
        buscaListaSessoes();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoPaginasListagemSessoes.Provider value={{ sessoes, idSessaoSelecionada, setIdSessaoSelecionada, deselecionaSessao }}>
            {children}
        </ContextoPaginasListagemSessoes.Provider>
    );
};