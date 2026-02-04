'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type MenuLayoutDinamicoCtx = {
    readonly menu: ReactNode | null;
    readonly setMenu: (node: ReactNode | null) => void;
};

const ContextoMenuLayoutDinamico = createContext<MenuLayoutDinamicoCtx | undefined>(undefined);

export function MenuLayoutDinamicoProvider({ children }: { children: ReactNode }) {
    const [menu, setMenu] = useState<ReactNode | null>(null);
    const value = useMemo(() => ({ menu, setMenu }), [menu]);
    return <ContextoMenuLayoutDinamico.Provider value={value}>{children}</ContextoMenuLayoutDinamico.Provider>;
}

export function useMenuLayoutDinamicoValor(): ReactNode | null {
    const ctx = useContext(ContextoMenuLayoutDinamico);
    if (!ctx) throw new Error('useMenuLayoutDinamicoValor precisa estar dentro de MenuLayoutDinamicoProvider');
    return ctx.menu;
}

export function RegistrarMenuLayoutDinamico({ node }: { node: ReactNode }) {
    const ctx = useContext(ContextoMenuLayoutDinamico);
    if (!ctx) throw new Error('RegistrarMenuLayoutDinamico precisa estar dentro de MenuLayoutDinamicoProvider');

    useEffect(() => {
        ctx.setMenu(node);
        return () => ctx.setMenu(null);
    }, [ctx, node]);

    return null;
};