'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { EstiloSessaoMestradaDto, RascunhoDto } from 'types-nora-api';

import { me_obtemRascunhosPorTipo, obtemEstilosSessaoPorParam } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoRascunhosMestreProps {
    estilosSessaoMestrada: EstiloSessaoMestradaDto[];
    tituloComponenteConteudo: string | null;
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
    const [estilosSessaoMestrada, setEstilosSessaoMestrada] = useState<EstiloSessaoMestradaDto[] | null>(null);
    const [rascunhos, setRascunhos] = useState<RascunhoDto[] | null>(null);
    const [idRascunhoSelecionado, setIdRascunhoSelecionado] = useState<number | null>(null);

    const tituloComponenteConteudo = ehSessaoUnica ? 'Mestre - Meus Rascunhos de Sessão Única' : 'Mestre - Meus Rascunhos de Aventuras';

    async function buscaEstilosSessaoMestrada() {
        setCarregando('Buscando Tipos Rascunho');

        try {
            setEstilosSessaoMestrada(await obtemEstilosSessaoPorParam(ehSessaoUnica));
        } catch {
            setEstilosSessaoMestrada(null);
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
        buscaEstilosSessaoMestrada();
        buscaRascunhos();
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    if (!carregando && !rascunhos) return <p>Nenhum Rascunho encontrado</p>;

    if (!estilosSessaoMestrada || !rascunhos) return;

    return (
        <ContextoRascunhosMestre.Provider value={{ estilosSessaoMestrada, tituloComponenteConteudo, rascunhos, limpaRascunhoSelecionado, selecionaRascunho, idRascunhoSelecionado }}>
            {children}
        </ContextoRascunhosMestre.Provider>
    );
};