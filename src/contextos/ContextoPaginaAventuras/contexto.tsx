'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AventuraDto, SessaoDto } from 'types-nora-api';
import { obtemAventuraCompleta, obtemTodasAventuras, obtemUltimaSessoesPostadas } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaAventurasProps {
    aventurasListadas: AventuraDto[] | null;
    aventuraSelecionada: AventuraDto | null;
    buscaAventuraSelecionada: (idAventura: number) => void;
    ultimasSessoesPostadas: SessaoDto[] | null;
};

const ContextoPaginaAventuras = createContext<ContextoPaginaAventurasProps | undefined>(undefined);

export const useContextoPaginaAventuras = (): ContextoPaginaAventurasProps => {
    const context = useContext(ContextoPaginaAventuras);
    if (!context) throw new Error('useContextoPaginaAventuras precisa estar dentro de um ContextoPaginaAventuras');
    return context;
};

export const ContextoPaginaAventurasProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [aventurasListadas, setAventurasListadas] = useState<AventuraDto[] | null>(null);
    const [aventuraSelecionada, setAventuraSelecionada] = useState<AventuraDto | null>(null);
    const [ultimasSessoesPostadas, setUltimasSessoesPostadas] = useState<SessaoDto[] | null>(null);

    async function buscaAventurasListadas() {
        setCarregando('Buscando Aventuras');

        try {
            setAventurasListadas(await obtemTodasAventuras());
        } catch {
            setAventurasListadas(null);
        } finally {
            setCarregando(null);
        }
    }

    async function buscaAventuraSelecionada(idAventura: number) {
        setCarregando('Buscando Aventura Selecionada');

        try {
            setAventuraSelecionada(await obtemAventuraCompleta(idAventura));
        } catch {
            setAventuraSelecionada(null);
        } finally {
            setCarregando(null);
        }
    }

    async function buscaUltimaSessoesPostadas() {
        setCarregando('Buscando Últimas Sessões Postadas');

        try {
            setUltimasSessoesPostadas(await obtemUltimaSessoesPostadas());
        } catch {
            setUltimasSessoesPostadas(null);
        } finally {
            setCarregando(null);
        }
    }

    useEffect(() => {
        buscaAventurasListadas();
        buscaUltimaSessoesPostadas();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoPaginaAventuras.Provider value={{ aventurasListadas, aventuraSelecionada, buscaAventuraSelecionada, ultimasSessoesPostadas }}>
            {children}
        </ContextoPaginaAventuras.Provider>
    );
};