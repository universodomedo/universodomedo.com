// #region Imports
// #endregion

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GanhosNex } from 'Types/classes/index.ts';

interface FichaContextType {
    ganhosNex: GanhosNex;
    atualizarFicha: () => void;
}

const FichaContext = createContext<FichaContextType | undefined>(undefined);

export const FichaProvider = ({ children, ganhosNex, atualizarFicha }: { children: ReactNode, ganhosNex: GanhosNex, atualizarFicha: () => void }) => {
    return (
        <FichaContext.Provider value={{ ganhosNex, atualizarFicha }}>
            {children}
        </FichaContext.Provider>
    );
};

export const useFicha = () => {
    const context = useContext(FichaContext);
    if (!context) {
        throw new Error('useFicha must be used within a FichaProvider');
    }
    return context;
};