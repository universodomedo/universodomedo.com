'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { FichaCompletaDto, FichaTemporariaVisualizacaoDetalhadaDto } from 'types-nora-api';

import { me_obtemFichas } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { QUERY_PARAMS } from 'Constantes/parametros_query';

interface ContextoPaginaFichasTemporariasProps {
    fichasTemporarias: FichaTemporariaVisualizacaoDetalhadaDto[];
    setIdFichaTemporariaSelecionada: (v: number) => void;
    deselecionaFicha: () => void;
    fichaTemporariaSelecionada: FichaTemporariaVisualizacaoDetalhadaDto | null;
};

const ContextoPaginaFichasTemporarias = createContext<ContextoPaginaFichasTemporariasProps | undefined>(undefined);

export const useContextoPaginaFichasTemporarias = (): ContextoPaginaFichasTemporariasProps => {
    const context = useContext(ContextoPaginaFichasTemporarias);
    if (!context) throw new Error('useContextoPaginaFichasTemporarias precisa estar dentro de um ContextoPaginaFichasTemporarias');
    return context;
};

export const ContextoPaginaFichasTemporariasProvider = ({ children, idFichaTemporariaInicial = null }: { children: React.ReactNode; idFichaTemporariaInicial?: number | null; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [fichasTemporarias, setFichasTemporarias] = useState<FichaTemporariaVisualizacaoDetalhadaDto[]>([]);
    const [idFichaTemporariaSelecionada, setIdFichaTemporariaSelecionada] = useState<number | null>(null);
    const fichaTemporariaSelecionada: FichaTemporariaVisualizacaoDetalhadaDto | null = idFichaTemporariaSelecionada ? fichasTemporarias.find(fichaTemporaria => fichaTemporaria.id === idFichaTemporariaSelecionada)! : null;

    const searchParams = useSearchParams();
    const pathname = usePathname();

    async function buscaFichas() {
        setCarregando('Buscando Fichas');

        try {
            setFichasTemporarias(await me_obtemFichas());
        } catch {
            setFichasTemporarias([]);
        } finally {
            setCarregando(null);
        }
    };

    function deselecionaFicha() { setIdFichaTemporariaSelecionada(null); };

    const atualizarParametroURL = (idFicha: number | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (idFicha === null || idFicha === 0) {
            params.delete(QUERY_PARAMS.FICHA);
        } else {
            params.set(QUERY_PARAMS.FICHA, idFicha.toString());
        }

        const novaURL = `${pathname}?${params.toString()}`;

        window.history.replaceState(null, '', novaURL);
    };

    useEffect(() => {
        if (idFichaTemporariaInicial) setIdFichaTemporariaSelecionada(idFichaTemporariaInicial);
        buscaFichas();
    }, []);

    useEffect(() => {
        if (fichaTemporariaSelecionada) atualizarParametroURL(fichaTemporariaSelecionada.id);
        else atualizarParametroURL(null);
    }, [fichaTemporariaSelecionada]);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoPaginaFichasTemporarias.Provider value={{ fichasTemporarias, setIdFichaTemporariaSelecionada, deselecionaFicha, fichaTemporariaSelecionada }}>
            {children}
        </ContextoPaginaFichasTemporarias.Provider>
    );
};