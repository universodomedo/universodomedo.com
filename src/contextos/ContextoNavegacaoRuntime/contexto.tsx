'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { indexarNavegacao, type NavegacaoConfigRuntime, type IndiceNavegacao } from 'types-nora-api';

import { obtemConfigNavegacao } from 'Uteis/ApiConsumer/ConsumerMiddleware';

// Provider da config de navegação em runtime (do banco). Busca UMA vez por sessão e disponibiliza config + índice O(1).
// Consumido por MenuSwiperEsquerda (menu principal) e ControladorSlot (guarda/layout/menu interno), evitando fetches duplicados.
type ValorContextoNavegacao = { config: NavegacaoConfigRuntime | null; indice: IndiceNavegacao | null };

const ContextoNavegacaoRuntime = createContext<ValorContextoNavegacao>({ config: null, indice: null });

export function ContextoNavegacaoRuntimeProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<NavegacaoConfigRuntime | null>(null);

    useEffect(() => {
        let ativo = true;
        obtemConfigNavegacao().then(c => { if (ativo) setConfig(c); }).catch(() => { if (ativo) setConfig(null); });
        return () => { ativo = false; };
    }, []);

    const indice = useMemo(() => config ? indexarNavegacao(config) : null, [config]);

    return <ContextoNavegacaoRuntime.Provider value={{ config, indice }}>{children}</ContextoNavegacaoRuntime.Provider>;
};

export function useContextoNavegacaoRuntime(): ValorContextoNavegacao { return useContext(ContextoNavegacaoRuntime); };
