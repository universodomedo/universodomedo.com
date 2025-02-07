// #region Imports
import React, { createContext, useContext } from "react";

import { ReducaoDano, TipoDano } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
import { SingletonHelper } from "Classes/classes_estaticas";
// #endregion

interface ClasseContextualPersonagemReducoesProps {
    reducoes: ReducaoDano[];
}

export const PersonagemReducoes = createContext<ClasseContextualPersonagemReducoesProps | undefined>(undefined);

export const PersonagemReducoesProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosFicha } = useClasseContextualPersonagem();

    const reducoes: ReducaoDano[] = dadosFicha.reducoesDano?.map(reducao_dano => {
        return {
            valor: reducao_dano.valor,
            get valorTotal(): number { return this.valor },
            get refTipoDano(): TipoDano { return SingletonHelper.getInstance().tipos_dano.find(tipo_dano => tipo_dano.id === reducao_dano.idTipoDano )!  },
        }
    })!;
    
    return (
        <PersonagemReducoes.Provider value={{ reducoes }}>
            {children}
        </PersonagemReducoes.Provider>
    );
}

export const useClasseContextualPersonagemReducoes = (): ClasseContextualPersonagemReducoesProps => {
    const context = useContext(PersonagemReducoes);
    if (!context) throw new Error('useClasseContextualPersonagemReducoes precisa estar dentro de uma ClasseContextual de PersonagemReducoes');
    return context;
};