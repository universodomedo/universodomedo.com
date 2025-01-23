// #region Imports
import React, { createContext, useContext, useState, ReactNode } from 'react';
// #endregion

interface ContextoMenuSwiperProps {
    menuAberto: boolean;
    alternaMenuAberto: () => void;
}

const ContextoMenuSwiper = createContext<ContextoMenuSwiperProps | undefined>(undefined);

export const ContextoMenuSwiperProvider = ({ children }: { children: React.ReactNode }) => {
    const [menuAberto, setMenuAberto] = useState(false);

    const alternaMenuAberto = () => setMenuAberto(prev => !prev);

    return (
        <ContextoMenuSwiper.Provider value={{ menuAberto, alternaMenuAberto }}>
            {children}
        </ContextoMenuSwiper.Provider>
    );
};

export const useContextoMenuSwiper = (): ContextoMenuSwiperProps => {
    const context = useContext(ContextoMenuSwiper);

    if (!context) throw new Error('useContextoMenuSwiper must be used within a ContextoMenuSwiperProvider');
    
    return context;
};