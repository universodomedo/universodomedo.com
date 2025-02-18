// #region Imports
import React, { createContext, useContext, useState } from "react";

import { RLJ_Ficha2 } from 'Classes/ClassesTipos/index.ts';

import { obtemDadosFichaDemonstracao } from "Recursos/DadosFicha.ts";

import { PersonagemProvider } from 'Classes/ClassesContextuais/Personagem.tsx';
// #endregion

interface ContextoFichaProps {
    // dado temporario, enquanto n usa banco de dados
    idFichaNoLocalStorage: number;
    paginaDeJogoAberta: number;
    mudarPaginaDeJogo: (param: { tipoAcao: 'direto', idPaginaDeJogo: number } | { tipoAcao: 'procedimento', acaoParaPaginaDeJogo: 'proximo' | 'anterior' }) => void;
}

export const ContextoFicha = createContext<ContextoFichaProps | undefined>(undefined);

export const ContextoFichaProvider = ({ children, seletorFicha }: { children: React.ReactNode; seletorFicha: { tipo: 'ficha'; idFichaNoLocalStorage: number } | { tipo: 'fichaDemonstracao' }; }) => {
    let data: RLJ_Ficha2;
    const idFichaNoLocalStorage = seletorFicha.tipo === 'fichaDemonstracao' ? 0 : seletorFicha.idFichaNoLocalStorage;

    if (seletorFicha.tipo === 'fichaDemonstracao') {
        data = obtemDadosFichaDemonstracao();
    } else {
        data = JSON.parse(localStorage.getItem("dadosFicha")!)[seletorFicha.idFichaNoLocalStorage];
    }

    const [paginaDeJogoAberta, setPaginaDeJogoAberta] = useState(1);

    const mudarPaginaDeJogo = (param: { tipoAcao: 'direto', idPaginaDeJogo: number } | { tipoAcao: 'procedimento', acaoParaPaginaDeJogo: 'proximo' | 'anterior' }) => {
        if (param.tipoAcao === 'direto') {
            setPaginaDeJogoAberta(param.idPaginaDeJogo)
        } else {
            if (paginaDeJogoAberta === 1) setPaginaDeJogoAberta(2);
            if (paginaDeJogoAberta === 2) setPaginaDeJogoAberta(1);
        }
    }

    return (
        <ContextoFicha.Provider value={{ idFichaNoLocalStorage, paginaDeJogoAberta, mudarPaginaDeJogo }}>
            <PersonagemProvider dadosFicha={data}>
                {children}
            </PersonagemProvider>            
        </ContextoFicha.Provider>
    );
}

export const useContextoFicha = (): ContextoFichaProps => {
    const context = useContext(ContextoFicha);
    if (!context) throw new Error('useContextoFicha precisa estar dentro de um ContextoFicha');
    return context;
};


// remover depois das alterações
export const getPersonagemFromContext = () => {}
export const getIdFichaNoLocalStorageFromContext = () => {}