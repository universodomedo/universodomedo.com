// #region Imports
import React, { createContext, useContext } from "react";

import { DadosAcao } from "Classes/ClassesTipos/index.ts";
// #endregion

interface ClasseContextualPersonagemNaturezaProps {
    dadosAcoesNatureza: DadosAcao[];
};

export const PersonagemNatureza = createContext<ClasseContextualPersonagemNaturezaProps | undefined>(undefined);

export const PersonagemNaturezaProvider = ({ children }: { children: React.ReactNode; }) => {
    // const natureza: NaturezaPersonagem = new NaturezaPersonagem();

    const dadosAcoesNatureza: DadosAcao[] = [
        // {
        //     nome: 'Sacar Item',

        // }
    ];
    
    return (
        <PersonagemNatureza.Provider value={{ dadosAcoesNatureza }}>
            {children}
        </PersonagemNatureza.Provider>
    );
}

export const useClasseContextualPersonagemNatureza = (): ClasseContextualPersonagemNaturezaProps => {
    const context = useContext(PersonagemNatureza);
    if (!context) throw new Error('useClasseContextualPersonagemNatureza precisa estar dentro de uma ClasseContextual de PersonagemNatureza');
    return context;
};