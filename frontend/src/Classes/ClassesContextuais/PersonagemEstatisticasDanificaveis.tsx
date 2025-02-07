// #region Imports
import React, { createContext, useContext } from "react";

import { EstatisticaDanificavelPersonagem } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
import { SingletonHelper } from "Classes/classes_estaticas";
// #endregion

interface ClasseContextualPersonagemEstatisticasDanificaveisProps {
    estatisticasDanificaveis: EstatisticaDanificavelPersonagem[];
}

export const PersonagemEstatisticasDanificaveis = createContext<ClasseContextualPersonagemEstatisticasDanificaveisProps | undefined>(undefined);

export const PersonagemEstatisticasDanificaveisProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosFicha } = useClasseContextualPersonagem();

    const estatisticasDanificaveis: EstatisticaDanificavelPersonagem[] = dadosFicha.estatisticasDanificaveis!.map(estatisticaDanificavel => {
        return {
            valorAtual: estatisticaDanificavel.valorAtual,
            valorMaximo: estatisticaDanificavel.valorMaximo,

            alterarValorAtual: function () { console.log('precisa implementar alterarValorAtual'); },
            alterarValorMaximo: function () { console.log('precisa implementar alterarValorMaximo'); },

            get refEstatisticaDanificavel() { return SingletonHelper.getInstance().estatisticas_danificavel.find(estatistica_danificavel => estatistica_danificavel.id === estatisticaDanificavel.idEstatisticaDanificavel)! },
        }
    });

    return (
        <PersonagemEstatisticasDanificaveis.Provider value={{ estatisticasDanificaveis }}>
            {children}
        </PersonagemEstatisticasDanificaveis.Provider>
    );
}

export const useClasseContextualPersonagemEstatisticasDanificaveis = (): ClasseContextualPersonagemEstatisticasDanificaveisProps => {
    const context = useContext(PersonagemEstatisticasDanificaveis);
    if (!context) throw new Error('useClasseContextualPersonagemEstatisticasDanificaveis precisa estar dentro de uma ClasseContextual de PersonagemEstatisticasDanificaveis');
    return context;
};