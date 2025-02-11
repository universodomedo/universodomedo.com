// #region Imports
import React, { createContext, useContext } from "react";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
// #endregion

interface ClasseContextualPersonagemPendenciasNexUpProps {
    temPendencias: boolean
}

export const PersonagemPendenciasNexUp = createContext<ClasseContextualPersonagemPendenciasNexUpProps | undefined>(undefined);

export const PersonagemPendenciasNexUpProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosFicha } = useClasseContextualPersonagem();

    const temPendencias: boolean = !(dadosFicha.detalhes.idNivel === dadosFicha.pendencias.idNivelEsperado)
    
    return (
        <PersonagemPendenciasNexUp.Provider value={{ temPendencias  }}>
            {children}
        </PersonagemPendenciasNexUp.Provider>
    );
}

export const useClasseContextualPersonagemPendenciasNexUp = (): ClasseContextualPersonagemPendenciasNexUpProps => {
    const context = useContext(PersonagemPendenciasNexUp);
    if (!context) throw new Error('useClasseContextualPersonagemPendenciasNexUp precisa estar dentro de uma ClasseContextual de PersonagemPendenciasNexUp');
    return context;
};