'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { obtemMinhaAssinatura, salvaMinhaAssinatura } from 'Funcionalidades/AssinaturaArtista/assinaturaArtista.api';
import type { AssinaturaArtistaPersistida, PAYLOAD__SalvarAssinaturaArtista } from 'types-nora-api';

export interface Contexto__PaginaAssinaturaArtista__Props {
    assinaturaAtual: AssinaturaArtistaPersistida | null;
    carregando: boolean;
    aoSalvar: (payload: PAYLOAD__SalvarAssinaturaArtista) => Promise<void>;
};

const Contexto__PaginaAssinaturaArtista = createContext<Contexto__PaginaAssinaturaArtista__Props | undefined>(undefined);

export const useContexto__PaginaAssinaturaArtista = (): Contexto__PaginaAssinaturaArtista__Props => {
    const context = useContext(Contexto__PaginaAssinaturaArtista);
    if (!context) throw new Error('useContexto__PaginaAssinaturaArtista precisa estar dentro de um Contexto__PaginaAssinaturaArtista');
    return context;
};

export const Contexto__PaginaAssinaturaArtista__Provider = ({ children }: { children: ReactNode }) => {
    const [assinaturaAtual, setAssinaturaAtual] = useState<AssinaturaArtistaPersistida | null>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let ativo = true;
        obtemMinhaAssinatura()
            .then(assinatura => { if (ativo) setAssinaturaAtual(assinatura); })
            .catch(() => { })
            .finally(() => { if (ativo) setCarregando(false); });
        return () => { ativo = false; };
    }, []);

    async function aoSalvar(payload: PAYLOAD__SalvarAssinaturaArtista): Promise<void> {
        const salva = await salvaMinhaAssinatura(payload);
        setAssinaturaAtual(salva);
    };

    return (
        <Contexto__PaginaAssinaturaArtista.Provider value={{ assinaturaAtual, carregando, aoSalvar }}>
            {children}
        </Contexto__PaginaAssinaturaArtista.Provider>
    );
};
