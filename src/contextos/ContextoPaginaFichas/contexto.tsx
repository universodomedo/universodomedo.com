'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { FichaDto, FichaTemporariaDto } from 'types-nora-api';

import { me_obtemFichas, me_obtemDadosFicha } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { QUERY_PARAMS } from 'Constantes/parametros_query';

interface ContextoPaginaFichasProps {
    fichasTemporarias: FichaTemporariaDto[];
    setIdFichaSelecionada: (v: number) => void;
    deselecionaFicha: () => void;
    fichaSelecionada: FichaDto | null;
};

const ContextoPaginaFichas = createContext<ContextoPaginaFichasProps | undefined>(undefined);

export const useContextoPaginaFichas = (): ContextoPaginaFichasProps => {
    const context = useContext(ContextoPaginaFichas);
    if (!context) throw new Error('useContextoPaginaFichas precisa estar dentro de um ContextoPaginaFichas');
    return context;
};

export const ContextoPaginaFichasProvider = ({ children, idFichaInicial = null }: { children: React.ReactNode; idFichaInicial?: number | null; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [fichasTemporarias, setFichasTemporarias] = useState<FichaTemporariaDto[]>([]);
    const [idFichaSelecionada, setIdFichaSelecionada] = useState<number | null>(null);
    const [fichaSelecionada, setFichaSelecionada] = useState<FichaDto | null>(null);

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

    async function buscaFichaSelecionada() {
        if (!idFichaSelecionada) return;

        setCarregando('Buscando Ficha Selecionada');

        try {
            setFichaSelecionada(await me_obtemDadosFicha(idFichaSelecionada));
        } catch {
            setFichaSelecionada(null);
        } finally {
            setCarregando(null);
        }
    };

    function deselecionaFicha() { setIdFichaSelecionada(null); };

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
        if (idFichaInicial) setIdFichaSelecionada(idFichaInicial);
        buscaFichas();
    }, []);

    useEffect(() => {
        if (!idFichaSelecionada) setFichaSelecionada(null);
        else buscaFichaSelecionada();
    }, [idFichaSelecionada]);

    useEffect(() => {
        if (fichaSelecionada) atualizarParametroURL(fichaSelecionada.id);
        else atualizarParametroURL(null);
    }, [fichaSelecionada]);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoPaginaFichas.Provider value={{ fichasTemporarias, setIdFichaSelecionada, deselecionaFicha, fichaSelecionada }}>
            {children}
        </ContextoPaginaFichas.Provider>
    );
};