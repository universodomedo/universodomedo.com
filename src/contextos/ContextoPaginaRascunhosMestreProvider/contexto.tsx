'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { EstiloSessaoMestradaDto, RascunhoCompletaDto } from 'types-nora-api';

import { me_obtemRascunhosPorTipo, obtemEstilosSessaoPorParam } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaRascunhosMestreProps {
    estilosSessaoMestrada: EstiloSessaoMestradaDto[];
    rascunhos: RascunhoCompletaDto[];
    deselecionaRascunho(): void;
    setIdRascunhoSelecionado: (v: number) => void;
    idRascunhoSelecionado: number | null;
};

const ContextoPaginaRascunhosMestre = createContext<ContextoPaginaRascunhosMestreProps | undefined>(undefined);

export const useContextoPaginaRascunhosMestre = (): ContextoPaginaRascunhosMestreProps => {
    const context = useContext(ContextoPaginaRascunhosMestre);
    if (!context) throw new Error('useContextoPaginaRascunhosMestre precisa estar dentro de um ContextoPaginaRascunhosMestre');
    return context;
};

export const ContextoPaginaRascunhosMestreProvider = ({ children, ehSessaoUnica }: { children: React.ReactNode; ehSessaoUnica: boolean; }) => {
    const [carregandoEstilos, setCarregandoEstilos] = useState(false);
    const [carregandoRascunhos, setCarregandoRascunhos] = useState(false);

    const [estilosSessaoMestrada, setEstilosSessaoMestrada] = useState<EstiloSessaoMestradaDto[] | null>(null);
    const [rascunhos, setRascunhos] = useState<RascunhoCompletaDto[]>([]);
    const [idRascunhoSelecionado, setIdRascunhoSelecionado] = useState<number | null>(null);

    async function buscaEstilosSessaoMestrada() {
        setCarregandoEstilos(true);

        try {
            setEstilosSessaoMestrada(await obtemEstilosSessaoPorParam(ehSessaoUnica));
        } catch {
            setEstilosSessaoMestrada(null);
        } finally {
            setCarregandoEstilos(false);
        }
    };

    async function buscaRascunhos() {
        setCarregandoRascunhos(true);

        try {
            setRascunhos(await me_obtemRascunhosPorTipo(ehSessaoUnica));
        } catch {
            setRascunhos([]);
        } finally {
            setCarregandoRascunhos(false);
        }
    };

    function deselecionaRascunho() { setIdRascunhoSelecionado(null); };

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
        <ContextoPaginaRascunhosMestre.Provider value={{ estilosSessaoMestrada, rascunhos, deselecionaRascunho, setIdRascunhoSelecionado, idRascunhoSelecionado }}>
            {children}
        </ContextoPaginaRascunhosMestre.Provider>
    );
};