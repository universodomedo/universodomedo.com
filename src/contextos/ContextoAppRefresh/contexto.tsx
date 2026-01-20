'use client';

import { createContext, useContext, useMemo, useState } from 'react';

interface ContextoAppRefreshProps {
    nonce: number;
    recarregaPagina: () => void;
}

const ContextoAppRefresh = createContext<ContextoAppRefreshProps | undefined>(undefined);

export function useAppRefresh(): ContextoAppRefreshProps {
    const ctx = useContext(ContextoAppRefresh);
    if (!ctx) throw new Error('useAppRefresh precisa estar dentro de ContextoAppRefreshProvider');
    return ctx;
}

export function ContextoAppRefreshProvider({ children }: { children: React.ReactNode }) {
    const [nonce, setNonce] = useState(0);

    function recarregaPagina() { setNonce((n) => n + 1); }

    const value = useMemo(() => ({ nonce, recarregaPagina }), [nonce]);

    return <ContextoAppRefresh.Provider value={value}>{children}</ContextoAppRefresh.Provider>;
}