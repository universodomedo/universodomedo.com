'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ContextoMenuSwiperEsquerdaProps {
    menuAberto: boolean;
    setMenuAberto: React.Dispatch<React.SetStateAction<boolean>>;
    tamanhoReduzido: boolean;
    setTamanhoReduzido: React.Dispatch<React.SetStateAction<boolean>>;
    esconderMenu: boolean;
    funcEsconderMenu: () => void;
}

const ContextoMenuSwiperEsquerda = createContext<ContextoMenuSwiperEsquerdaProps | undefined>(undefined);

export const useContextoMenuSwiperEsquerda = (): ContextoMenuSwiperEsquerdaProps => {
    const context = useContext(ContextoMenuSwiperEsquerda);

    if (!context) throw new Error('useContextoMenuSwiperEsquerda must be used within a ContextoMenuSwiperEsquerdaProvider');

    return context;
};

export const ContextoMenuSwiperEsquerdaProvider = ({ children }: { children: React.ReactNode }) => {
    const [esconderMenu, setEsconderMenu] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);
    const [tamanhoReduzido, setTamanhoReduzido] = useState(false);

    const pathname = usePathname();

    const funcEsconderMenu = () => {
        setEsconderMenu(true);
    };

    useEffect(() => {
        if (menuAberto) setMenuAberto(false);
        setEsconderMenu(false);
    }, [pathname]);

    return (
        <ContextoMenuSwiperEsquerda.Provider value={{ menuAberto, setMenuAberto, tamanhoReduzido, setTamanhoReduzido, esconderMenu, funcEsconderMenu }}>
            {children}
        </ContextoMenuSwiperEsquerda.Provider>
    );
};