// #region Imports
import React, { createContext, useContext } from "react";

import { Classe, Nivel } from "Classes/ClassesTipos/index.tsx";
import { SingletonHelper } from "Classes/classes_estaticas.ts";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
// #endregion

interface ClasseContextualPersonagemDetalhesProps {
    nome: string;
    classe: Classe;
    nivel: Nivel;
}

export const PersonagemDetalhes = createContext<ClasseContextualPersonagemDetalhesProps | undefined>(undefined);

export const PersonagemDetalhesProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosFicha } = useClasseContextualPersonagem();

    const nome = dadosFicha.detalhes.nome;
    const classe: Classe = SingletonHelper.getInstance().classes.find(classe => classe.id === dadosFicha.detalhes.idClasse)!;
    const nivel: Nivel = SingletonHelper.getInstance().niveis.find(nivel => nivel.id === dadosFicha.detalhes.idNivel)!;

    return (
        <PersonagemDetalhes.Provider value={{ nome, classe, nivel }}>
            {children}
        </PersonagemDetalhes.Provider>
    );
}

export const useClasseContextualPersonagemDetalhes = (): ClasseContextualPersonagemDetalhesProps => {
    const context = useContext(PersonagemDetalhes);
    if (!context) throw new Error('useClasseContextualPersonagemDetalhes precisa estar dentro de uma ClasseContextual de PersonagemDetalhes');
    return context;
};