// #region Imports
import React, { createContext, useContext } from "react";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
// #endregion

interface ClasseContextual<Nome>Props {

}

export const <Nome> = createContext<ClasseContextual<Nome>Props | undefined>(undefined);

export const <Nome>Provider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosPersonagem } = useClasseContextualPersonagem();
    
    return (
        <<Nome>.Provider value={{ }}>
            {children}
        </<Nome>.Provider>
    );
}

export const useClasseContextual<Nome> = (): ClasseContextual<Nome>Props => {
    const context = useContext(<Nome>);
    if (!context) throw new Error('useClasseContextual<Nome> precisa estar dentro de uma ClasseContextual de <Nome>');
    return context;
};