// #region Imports
import { createContext, useContext, ReactNode, useRef } from 'react';
import { GanhosNex, Personagem } from 'Classes/ClassesTipos/index.ts';

import { useContextoFicha } from 'Contextos/ContextoPersonagem/contexto.tsx';
// #endregion

interface ContextoNexUpProps {
    ganhosNex: GanhosNex;
    triggerSetState: () => void;
    registerSetState: (callback: React.Dispatch<React.SetStateAction<any>>) => void;
}

const ContextoNexUp = createContext<ContextoNexUpProps | undefined>(undefined);

export const ContextoNexUpProvider = ({ children, personagem }: { children: ReactNode, personagem: Personagem }) => {
    const { idFichaNoLocalStorage } = useContextoFicha();
    const ganhosNex = new GanhosNex(personagem, idFichaNoLocalStorage);

    const registerSetState = (callback: React.Dispatch<React.SetStateAction<any>>) => {
        setStateRef.current = callback;
    };

    const setStateRef = useRef<React.Dispatch<React.SetStateAction<Record<string, any>>> | null>(null);

    const triggerSetState = () => {
        if (setStateRef.current) {
            setStateRef.current((prev: Record<string, any>) => ({ ...prev, updated: true }));
        }
        // else {
        //     console.warn("Nenhum setState foi registrado!");
        // }
    };

    return (
        <ContextoNexUp.Provider value={{ ganhosNex, triggerSetState, registerSetState }}>
            {children}
        </ContextoNexUp.Provider>
    );
};

export const useContextoNexUp = (): ContextoNexUpProps => {
    const context = useContext(ContextoNexUp);
    if (!context) throw new Error('useNexUp must be used within a ContextoNexUpProvider');

    return context;
};