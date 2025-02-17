// #region Imports
import React, { createContext, useContext, useMemo } from "react";

import { Atributo, AtributoPersonagem } from "Classes/ClassesTipos/index.ts";
import { SingletonHelper } from "Classes/classes_estaticas.ts";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
import { useClasseContextualPersonagemModificadores } from "Classes/ClassesContextuais/PersonagemModificadores.tsx";
// #endregion

interface ClasseContextualPersonagemAtributosProps {
    atributos: AtributoPersonagem[];
};

export const PersonagemAtributos = createContext<ClasseContextualPersonagemAtributosProps | undefined>(undefined);

export const PersonagemAtributosProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosPersonagem } = useClasseContextualPersonagem();
    const { obtemValorTotalComLinhaEfeito, obterDetalhesPorLinhaEfeito } = useClasseContextualPersonagemModificadores();

    const atributos = useMemo(() => {
        return dadosPersonagem.atributos.map(atributo => {
            const atributoService = {
                get refAtributo(): Atributo { return SingletonHelper.getInstance().atributos.find(attr => attr.id === atributo.idAtributo)!; },

                get valor(): number { return atributo.valor; },
                get valorTotal(): number { return obtemValorTotalComLinhaEfeito(this.valor, this.refAtributo.refLinhaEfeito.id); },

                get detalhesValor(): string[] { return [`Valor Natural: ${this.valor}`].concat(obterDetalhesPorLinhaEfeito(this.refAtributo.refLinhaEfeito.id)); },
            };

            return atributoService;
        });
    }, [dadosPersonagem]);
    
    return (
        <PersonagemAtributos.Provider value={{ atributos }}>
            {children}
        </PersonagemAtributos.Provider>
    );
};

export const useClasseContextualPersonagemAtributos = (): ClasseContextualPersonagemAtributosProps => {
    const context = useContext(PersonagemAtributos);
    if (!context) throw new Error('useClasseContextualPersonagemAtributos precisa estar dentro de uma ClasseContextual de PersonagemAtributos');
    return context;
};