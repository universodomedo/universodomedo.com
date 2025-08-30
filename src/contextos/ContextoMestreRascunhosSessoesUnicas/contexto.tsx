'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { RascunhoDto, TipoRascunhoDto, TiposGeralRascunho } from 'types-nora-api';
import { obtemRascunhosSessaoUnicaPorMestre, obtemTiposRascunhoPorTipoGeral } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoMestreRascunhosSessoesUnicasProps {
    tiposRascunhosParaEsseTipoGeral: TipoRascunhoDto[];
    rascunhosSessaoUnica: RascunhoDto[];
};

const ContextoMestreRascunhosSessoesUnicas = createContext<ContextoMestreRascunhosSessoesUnicasProps | undefined>(undefined);

export const useContextoMestreRascunhosSessoesUnicas = (): ContextoMestreRascunhosSessoesUnicasProps => {
    const context = useContext(ContextoMestreRascunhosSessoesUnicas);
    if (!context) throw new Error('useContextoMestreRascunhosSessoesUnicas precisa estar dentro de um ContextoMestreRascunhosSessoesUnicas');
    return context;
};

export const ContextoMestreRascunhosSessoesUnicasProvider = ({ children }: { children: React.ReactNode }) => {
    const { usuarioLogado } = useContextoAutenticacao();
    const [carregando, setCarregando] = useState<string | null>('');
    const [tiposRascunhosParaEsseTipoGeral, setTiposRascunhosParaEsseTipoGeral] = useState<TipoRascunhoDto[] | null>(null);
    const [rascunhosSessaoUnica, setRascunhosSessaoUnica] = useState<RascunhoDto[] | null>(null);

    async function buscaTiposRascunhoPorTipoGeral() {
        setCarregando('Buscando Tipos Rascunho');

        try {
            setTiposRascunhosParaEsseTipoGeral(await obtemTiposRascunhoPorTipoGeral(TiposGeralRascunho.SESSAO_UNICA));
        } catch {
            setTiposRascunhosParaEsseTipoGeral(null);
        } finally {
            setCarregando(null);
        }
    }

    async function buscaRascunhosSessaoUnica() {
        setCarregando('Buscando Rascunhos');

        try {
            setRascunhosSessaoUnica(await obtemRascunhosSessaoUnicaPorMestre(usuarioLogado!.id));
        } catch {
            setRascunhosSessaoUnica(null);
        } finally {
            setCarregando(null);
        }
    }

    useEffect(() => {
        buscaTiposRascunhoPorTipoGeral();
        buscaRascunhosSessaoUnica();
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    if (!carregando && !rascunhosSessaoUnica) return <p>Nenhum Rascunho encontrado</p>;

    if (!tiposRascunhosParaEsseTipoGeral || !rascunhosSessaoUnica) return;
    
    return (
        <ContextoMestreRascunhosSessoesUnicas.Provider value={{ tiposRascunhosParaEsseTipoGeral, rascunhosSessaoUnica }}>
            {children}
        </ContextoMestreRascunhosSessoesUnicas.Provider>
    );
};