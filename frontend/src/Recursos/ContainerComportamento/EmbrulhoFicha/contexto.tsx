// #region Imports
import React, { createContext, useContext } from "react";

import { Personagem } from "Types/classes/index.ts";
import { geraFicha } from 'Utils/utils.tsx';
// #endregion

interface ContextoFichaProps {
    // dado temporario, enquanto n usa banco de dados
    idFichaNoLocalStorage: number,
    personagem: Personagem
}

export const ContextoFicha = createContext<ContextoFichaProps | undefined>(undefined);

export const useContextoFicha = (): ContextoFichaProps => {
    const context = useContext(ContextoFicha);

    if (!context) {
        throw new Error('useContextoFicha precisa estar dentro de um ContextoFicha');
    }

    return context;
};

export const ContextoFichaProvider = ({ children, idFichaNoLocalStorage }: { children: React.ReactNode, idFichaNoLocalStorage: number }) => {
    const data = JSON.parse(localStorage.getItem("dadosFicha")!)[idFichaNoLocalStorage];

    const personagem = new Personagem(geraFicha(data));

    const PageComBridge = ({ children }: { children: React.ReactNode }) => {
        useContextBridge();

        return (
            <>{children}</>
        );
    }

    return (
        <ContextoFicha.Provider value={{ idFichaNoLocalStorage, personagem }}>
            <PageComBridge>
                {children}
            </PageComBridge>
        </ContextoFicha.Provider>
    );
}

let getPersonagem: (() => Personagem) | null = null;
let getIdFichaNoLocalStorage: (() => number) | null = null;

export const useContextBridge = () => {
    const { personagem, idFichaNoLocalStorage } = useContextoFicha();

    getPersonagem = () => personagem;
    getIdFichaNoLocalStorage = () => idFichaNoLocalStorage;
};

export const getPersonagemFromContext = () => {
    if (!getPersonagem) {
        throw new Error("ContextBridge não está inicializado neste contexto.");
    }

    return getPersonagem();
};

export const getIdFichaNoLocalStorageFromContext = () => {
    if (!getIdFichaNoLocalStorage) {
        throw new Error("ContextBridge não está inicializado neste contexto.");
    }

    return getIdFichaNoLocalStorage();
};