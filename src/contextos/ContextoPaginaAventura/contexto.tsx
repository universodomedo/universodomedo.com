'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { AventuraDto } from 'types-nora-api';

interface ContextoPaginaAventuraProps {
    aventuraSelecionada: AventuraDto | undefined;
    setAventuraSelecionada: Dispatch<SetStateAction<AventuraDto | undefined>>;
};

const ContextoPaginaAventura = createContext<ContextoPaginaAventuraProps | undefined>(undefined);

export const useContextoPaginaAventura = (): ContextoPaginaAventuraProps => {
    const context = useContext(ContextoPaginaAventura);
    if (!context) throw new Error('useContextoPaginaAventura precisa estar dentro de um ContextoPaginaAventura');
    return context;
};

export const ContextoPaginaAventuraProvider = ({ children }: { children: React.ReactNode }) => {
    const [ aventuraSelecionada, setAventuraSelecionada ] = useState<AventuraDto | undefined>(undefined);

    return (
        <ContextoPaginaAventura.Provider value={{ aventuraSelecionada, setAventuraSelecionada }}>
            {children}
        </ContextoPaginaAventura.Provider>
    );
};