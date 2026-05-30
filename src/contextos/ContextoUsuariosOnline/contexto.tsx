'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface ContextoUsuariosOnlineProps {
    painelAberto: boolean;
    abrirPainel: () => void;
    fecharPainel: () => void;
    togglePainel: () => void;
};

const ContextoUsuariosOnline = createContext<ContextoUsuariosOnlineProps | undefined>(undefined);

export const useContextoUsuariosOnline = (): ContextoUsuariosOnlineProps => {
    const context = useContext(ContextoUsuariosOnline);
    if (!context) throw new Error('useContextoUsuariosOnline precisa estar dentro de ContextoUsuariosOnline__Provider');
    return context;
};

export const ContextoUsuariosOnline__Provider = ({ children }: { children: React.ReactNode }) => {
    const [painelAberto, setPainelAberto] = useState<boolean>(false);

    const abrirPainel = useCallback(() => setPainelAberto(true), []);
    const fecharPainel = useCallback(() => setPainelAberto(false), []);
    const togglePainel = useCallback(() => setPainelAberto(v => !v), []);

    return (
        <ContextoUsuariosOnline.Provider value={{ painelAberto, abrirPainel, fecharPainel, togglePainel }}>
            {children}
        </ContextoUsuariosOnline.Provider>
    );
};
