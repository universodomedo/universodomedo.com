// #region Imports
import React, { createContext, useContext } from "react";

import { Acao } from "Classes/ClassesTipos/index.ts";
// #endregion

interface ClasseContextualPersonagemNaturezaProps {
    acoesNatureza: Acao[];
}

export const PersonagemNatureza = createContext<ClasseContextualPersonagemNaturezaProps | undefined>(undefined);

export const PersonagemNaturezaProvider = ({ children }: { children: React.ReactNode; }) => {
    // const natureza: NaturezaPersonagem = new NaturezaPersonagem();

    const acoesNatureza: Acao[] = [];
    
    return (
        <PersonagemNatureza.Provider value={{ acoesNatureza }}>
            {children}
        </PersonagemNatureza.Provider>
    );
}

export const useClasseContextualPersonagemNatureza = (): ClasseContextualPersonagemNaturezaProps => {
    const context = useContext(PersonagemNatureza);
    if (!context) throw new Error('useClasseContextualPersonagemNatureza precisa estar dentro de uma ClasseContextual de PersonagemNatureza');
    return context;
};