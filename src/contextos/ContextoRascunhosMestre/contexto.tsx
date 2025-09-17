'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { RascunhoDto, TipoRascunhoDto, TiposGeralRascunho } from 'types-nora-api';

import { me_obtemRascunhosPorTipo, obtemEstilosSessaoPorParam } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoRascunhosMestreProps {
    tipoGeralRascunho: TiposGeralRascunho;
    tituloComponenteConteudo: string | null;
    tiposRascunhosParaEsseTipoGeral: TipoRascunhoDto[];
    rascunhos: RascunhoDto[];
    limpaRascunhoSelecionado(): void;
    selecionaRascunho(idRascunho: number): void;
    idRascunhoSelecionado: number | null;
};

const ContextoRascunhosMestre = createContext<ContextoRascunhosMestreProps | undefined>(undefined);

export const useContextoRascunhosMestre = (): ContextoRascunhosMestreProps => {
    const context = useContext(ContextoRascunhosMestre);
    if (!context) throw new Error('useContextoRascunhosMestre precisa estar dentro de um ContextoRascunhosMestre');
    return context;
};

export const ContextoRascunhosMestreProvider = ({ ehSessaoUnica, children }: { ehSessaoUnica: boolean; children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [tiposRascunhosParaEsseTipoGeral, setTiposRascunhosParaEsseTipoGeral] = useState<EstiloSessaoMestradaDto[] | null>(null);
    const [rascunhos, setRascunhos] = useState<RascunhoDto[] | null>(null);
    const [idRascunhoSelecionado, setIdRascunhoSelecionado] = useState<number | null>(null);

    const tituloComponenteConteudo = ehSessaoUnica ? 'Mestre - Meus Rascunhos de Sessão Única' : 'Mestre - Meus Rascunhos de Aventuras';

    async function buscaTiposRascunhoPorTipoGeral() {
        setCarregando('Buscando Tipos Rascunho');

        try {
            setTiposRascunhosParaEsseTipoGeral(await obtemEstilosSessaoPorParam(ehSessaoUnica));
        } catch {
            setTiposRascunhosParaEsseTipoGeral(null);
        } finally {
            setCarregando(null);
        }
    }

    async function buscaRascunhos() {
        setCarregando('Buscando Rascunhos');

        try {
            setRascunhos(await me_obtemRascunhosPorTipo(ehSessaoUnica));
        } catch {
            setRascunhos(null);
        } finally {
            setCarregando(null);
        }
    }

    function limpaRascunhoSelecionado() { setIdRascunhoSelecionado(null); }
    function selecionaRascunho(idRascunho: number) { setIdRascunhoSelecionado(idRascunho); }

    useEffect(() => {
        buscaTiposRascunhoPorTipoGeral();
        buscaRascunhos();
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    if (!carregando && !rascunhos) return <p>Nenhum Rascunho encontrado</p>;

    if (!tiposRascunhosParaEsseTipoGeral || !rascunhos) return;

    return (
        <ContextoRascunhosMestre.Provider value={{ tipoGeralRascunho, tituloComponenteConteudo, tiposRascunhosParaEsseTipoGeral, rascunhos, limpaRascunhoSelecionado, selecionaRascunho, idRascunhoSelecionado }}>
            {children}
        </ContextoRascunhosMestre.Provider>
    );
};