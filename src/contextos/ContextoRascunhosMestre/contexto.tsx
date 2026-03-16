'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { EstiloSessaoMestradaCompletaDto, RascunhoCompletaDto } from 'types-nora-api';

import { me_obtemRascunhosPorTipo, obtemEstilosSessaoPorParam } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoRascunhosMestreProps {
    estilosSessaoMestrada: EstiloSessaoMestradaCompletaDto[];
    tituloComponenteConteudo: string | null;
    rascunhos: RascunhoCompletaDto[];
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
    const [carregandoEstilos, setCarregandoEstilos] = useState(false);
    const [carregandoRascunhos, setCarregandoRascunhos] = useState(false);

    const [estilosSessaoMestrada, setEstilosSessaoMestrada] = useState<EstiloSessaoMestradaCompletaDto[] | null>(null);
    const [rascunhos, setRascunhos] = useState<RascunhoCompletaDto[]>([]);
    const [idRascunhoSelecionado, setIdRascunhoSelecionado] = useState<number | null>(null);

    const tituloComponenteConteudo = ehSessaoUnica ? 'Mestre - Meus Rascunhos de Sessão Única' : 'Mestre - Meus Rascunhos de Aventuras';

    async function buscaEstilosSessaoMestrada() {
        setCarregandoEstilos(true);

        try {
            setEstilosSessaoMestrada(await obtemEstilosSessaoPorParam(ehSessaoUnica));
        } catch {
            setEstilosSessaoMestrada(null);
        } finally {
            setCarregandoEstilos(false);
        }
    }

    async function buscaRascunhos() {
        setCarregandoRascunhos(true);

        try {
            setRascunhos(await me_obtemRascunhosPorTipo(ehSessaoUnica));
        } catch {
            setRascunhos([]);
        } finally {
            setCarregandoRascunhos(false);
        }
    }

    function limpaRascunhoSelecionado() { setIdRascunhoSelecionado(null); }
    function selecionaRascunho(idRascunho: number) { setIdRascunhoSelecionado(idRascunho); }

    useEffect(() => {
        buscaEstilosSessaoMestrada();
        buscaRascunhos();
    }, []);

    if (carregandoEstilos || carregandoRascunhos) {
        if (carregandoEstilos && carregandoRascunhos) return <div>Carregando tipos de rascunho e rascunhos</div>;
        if (carregandoEstilos) return <div>Carregando tipos de rascunho</div>;
        return <div>Buscando rascunhos</div>;
    }

    if (!estilosSessaoMestrada || !rascunhos) return;

    return (
        <ContextoRascunhosMestre.Provider value={{ estilosSessaoMestrada, tituloComponenteConteudo, rascunhos, limpaRascunhoSelecionado, selecionaRascunho, idRascunhoSelecionado }}>
            {children}
        </ContextoRascunhosMestre.Provider>
    );
};