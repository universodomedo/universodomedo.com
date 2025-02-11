// #region Imports
import React, { createContext, useContext } from "react";

import { Proficiencia } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
// #endregion

interface ClasseContextualPersonagemProficienciasProps {

}

export const PersonagemProficiencias = createContext<ClasseContextualPersonagemProficienciasProps | undefined>(undefined);

export const PersonagemProficienciasProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosFicha } = useClasseContextualPersonagem();

    const proficienciaPersonagem: Proficiencia[] = [];
    
    return (
        <PersonagemProficiencias.Provider value={{ }}>
            {children}
        </PersonagemProficiencias.Provider>
    );
}

export const useClasseContextualPersonagemProficiencias = (): ClasseContextualPersonagemProficienciasProps => {
    const context = useContext(PersonagemProficiencias);
    if (!context) throw new Error('useClasseContextualPersonagemProficiencias precisa estar dentro de uma ClasseContextual de PersonagemProficiencias');
    return context;
};