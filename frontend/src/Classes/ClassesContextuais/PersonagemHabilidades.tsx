// #region Imports
import React, { createContext, useContext } from "react";

import { Acao, Habilidade } from "Classes/ClassesTipos/index.ts";
import { useClasseContextualPersonagem } from "./Personagem";
// #endregion

interface ClasseContextualPersonagemHabilidadesProps {
    habilidades: Habilidade[]
    acoesHabilidades: Acao[];
}

export const PersonagemHabilidades = createContext<ClasseContextualPersonagemHabilidadesProps | undefined>(undefined);

export const PersonagemHabilidadesProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosFicha } = useClasseContextualPersonagem();

    const habilidades: Habilidade[] = [
        // ...dadosFicha.habilidadesEspeciais?.map(habilidadeEspecial => new HabilidadePassiva({ dadosGenericosHabilidade: habilidadeEspecial.props, fonteHabilidade: { tipo: 'Mundana', fonte: 'Habilidade Especial' } })) || [],
        // ...lista_geral_habilidades().filter(habilidade => habilidade.requisitoFicha === undefined || habilidade.requisitoFicha.verificaRequisitoCumprido(dadosFicha))
    ];

    // const acoesHabilidades: Acao[] = habilidades.filter((habilidade): habilidade is HabilidadeAtiva => habilidade instanceof HabilidadeAtiva).flatMap(habilidade => habilidade.acoes);
    const acoesHabilidades: Acao[] = [];

    return (
        <PersonagemHabilidades.Provider value={{ habilidades, acoesHabilidades }}>
            {children}
        </PersonagemHabilidades.Provider>
    );
}

export const useClasseContextualPersonagemHabilidades = (): ClasseContextualPersonagemHabilidadesProps => {
    const context = useContext(PersonagemHabilidades);
    if (!context) throw new Error('useClasseContextualPersonagemHabilidades precisa estar dentro de uma ClasseContextual de PersonagemHabilidades');
    return context;
};