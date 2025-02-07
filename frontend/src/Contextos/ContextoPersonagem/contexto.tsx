// #region Imports
import React, { createContext, useContext } from "react";

import { HabilidadePassiva, lista_geral_habilidades, Personagem, RLJ_Ficha2 } from 'Classes/ClassesTipos/index.ts';
import { geraFicha } from 'Uteis/uteis.tsx';

import { obtemDadosFichaDemonstracao } from "Recursos/DadosFicha.ts";

import { PersonagemProvider } from 'Classes/ClassesContextuais/Personagem.tsx';
// #endregion

interface ContextoFichaProps {
    // dado temporario, enquanto n usa banco de dados
    idFichaNoLocalStorage: number,
}

export const ContextoFicha = createContext<ContextoFichaProps | undefined>(undefined);

export const useContextoFicha = (): ContextoFichaProps => {
    const context = useContext(ContextoFicha);

    if (!context) {
        throw new Error('useContextoFicha precisa estar dentro de um ContextoFicha');
    }

    return context;
};

export const ContextoFichaProvider = ({ children, seletorFicha }: { children: React.ReactNode; seletorFicha: { tipo: 'ficha'; idFichaNoLocalStorage: number } | { tipo: 'fichaDemonstracao' }; }) => {
    let data: RLJ_Ficha2;
    const idFichaNoLocalStorage = seletorFicha.tipo === 'fichaDemonstracao' ? 0 : seletorFicha.idFichaNoLocalStorage;

    if (seletorFicha.tipo === 'fichaDemonstracao') {
        data = obtemDadosFichaDemonstracao();
    } else {
        data = JSON.parse(localStorage.getItem("dadosFicha")!)[seletorFicha.idFichaNoLocalStorage];
    }

    return (
        <ContextoFicha.Provider value={{ idFichaNoLocalStorage }}>
            <PersonagemProvider dadosFicha={data}>
                {children}
            </PersonagemProvider>            
        </ContextoFicha.Provider>
    );
}

// remover depois das alterações
export const getPersonagemFromContext = () => {}
export const getIdFichaNoLocalStorageFromContext = () => {}