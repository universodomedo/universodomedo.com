'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';


interface ContextoMenuSwiperEsquerdaProps {
    menuAberto: boolean;
    setMenuAberto: React.Dispatch<React.SetStateAction<boolean>>;
    tamanhoReduzido: boolean;
    setTamanhoReduzido: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContextoMenuSwiperEsquerda = createContext<ContextoMenuSwiperEsquerdaProps | undefined>(undefined);

export const ContextoMenuSwiperEsquerdaProvider = ({ children }: { children: React.ReactNode }) => {
    const [menuAberto, setMenuAberto] = useState(false);
    const [tamanhoReduzido, setTamanhoReduzido] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        if (menuAberto) setMenuAberto(false);
    }, [pathname]);

    return (
        <ContextoMenuSwiperEsquerda.Provider value={{ menuAberto, setMenuAberto, tamanhoReduzido, setTamanhoReduzido }}>
            {children}
        </ContextoMenuSwiperEsquerda.Provider>
    );
};

export const useContextoMenuSwiperEsquerda = (): ContextoMenuSwiperEsquerdaProps => {
    const context = useContext(ContextoMenuSwiperEsquerda);

    if (!context) throw new Error('useContextoMenuSwiperEsquerda must be used within a ContextoMenuSwiperEsquerdaProvider');

    return context;
};