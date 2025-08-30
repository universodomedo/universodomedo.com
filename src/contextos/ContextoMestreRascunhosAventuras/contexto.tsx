'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { RascunhoDto, TipoRascunhoDto, TiposGeralRascunho } from 'types-nora-api';
import { obtemRascunhosAventuraPorMestre, obtemTiposRascunhoPorTipoGeral } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoMestreRascunhosAventurasProps {
    tiposRascunhosParaEsseTipoGeral: TipoRascunhoDto[];
    rascunhosAventura: RascunhoDto[];
};

const ContextoMestreRascunhosAventuras = createContext<ContextoMestreRascunhosAventurasProps | undefined>(undefined);

export const useContextoMestreRascunhosAventuras = (): ContextoMestreRascunhosAventurasProps => {
    const context = useContext(ContextoMestreRascunhosAventuras);
    if (!context) throw new Error('useContextoMestreRascunhosAventuras precisa estar dentro de um ContextoMestreRascunhosAventuras');
    return context;
};

export const ContextoMestreRascunhosAventurasProvider = ({ children }: { children: React.ReactNode }) => {
    const { usuarioLogado } = useContextoAutenticacao();
    const [carregando, setCarregando] = useState<string | null>('');
    const [tiposRascunhosParaEsseTipoGeral, setTiposRascunhosParaEsseTipoGeral] = useState<TipoRascunhoDto[] | null>(null);
    const [rascunhosAventura, setRascunhosAventura] = useState<RascunhoDto[] | null>(null);

    async function buscaTiposRascunhoPorTipoGeral() {
        setCarregando('Buscando Tipos Rascunho');

        try {
            setTiposRascunhosParaEsseTipoGeral(await obtemTiposRascunhoPorTipoGeral(TiposGeralRascunho.AVENTURA));
        } catch {
            setTiposRascunhosParaEsseTipoGeral(null);
        } finally {
            setCarregando(null);
        }
    }

    async function buscaRascunhosAventura() {
        setCarregando('Buscando Rascunhos');

        try {
            setRascunhosAventura(await obtemRascunhosAventuraPorMestre(usuarioLogado!.id));
        } catch {
            setRascunhosAventura(null);
        } finally {
            setCarregando(null);
        }
    }

    useEffect(() => {
        buscaTiposRascunhoPorTipoGeral();
        buscaRascunhosAventura();
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    if (!carregando && !rascunhosAventura) return <p>Nenhum Rascunho encontrado</p>;

    if (!tiposRascunhosParaEsseTipoGeral || !rascunhosAventura) return;
    
    return (
        <ContextoMestreRascunhosAventuras.Provider value={{ tiposRascunhosParaEsseTipoGeral, rascunhosAventura }}>
            {children}
        </ContextoMestreRascunhosAventuras.Provider>
    );
};