'use client';

import React, { createContext, useContext, useState } from 'react';

interface ContextoMenuSwiperEsquerdaProps {
    menuAberto: boolean;
    alternaMenuAberto: () => void;
}

const ContextoMenuSwiperEsquerda = createContext<ContextoMenuSwiperEsquerdaProps | undefined>(undefined);

export const ContextoMenuSwiperEsquerdaProvider = ({ children }: { children: React.ReactNode }) => {
    const [menuAberto, setMenuAberto] = useState(false);

    const alternaMenuAberto = () => setMenuAberto(prev => !prev);

    return (
        <ContextoMenuSwiperEsquerda.Provider value={{ menuAberto, alternaMenuAberto }}>
            {children}
        </ContextoMenuSwiperEsquerda.Provider>
    );
};

export const useContextoMenuSwiperEsquerda = (): ContextoMenuSwiperEsquerdaProps => {
    const context = useContext(ContextoMenuSwiperEsquerda);

    if (!context) throw new Error('useContextoMenuSwiperEsquerda must be used within a ContextoMenuSwiperEsquerdaProvider');

    return context;
};