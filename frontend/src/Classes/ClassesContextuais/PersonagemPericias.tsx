// #region Imports
import React, { createContext, useContext } from "react";

import { AtributoPersonagem, PatentePericia, Pericia, PericiaPatentePersonagem } from "Classes/ClassesTipos/index.ts";
import { SingletonHelper } from "Classes/classes_estaticas.ts";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
import { useClasseContextualPersonagemAtributos } from "Classes/ClassesContextuais/PersonagemAtributos.tsx";
import { useClasseContextualPersonagemModificadores } from "Classes/ClassesContextuais/PersonagemModificadores.tsx";

import { ExecutaTestePericiaGenerico } from "Recursos/Ficha/Procedimentos.ts";
// #endregion

interface ClasseContextualPersonagemPericiasProps {
    pericias: PericiaPatentePersonagem[];
}

export const PersonagemPericias = createContext<ClasseContextualPersonagemPericiasProps | undefined>(undefined);

export const PersonagemPericiasProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosFicha } = useClasseContextualPersonagem();
    const { obtemValorTotalComLinhaEfeito, obterDetalhesPorLinhaEfeito } = useClasseContextualPersonagemModificadores();
    const { atributos } = useClasseContextualPersonagemAtributos();

    const pericias = dadosFicha.periciasPatentes.map(periciaPatente => {
        return {
            get refPericia(): Pericia { return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === periciaPatente.idPericia)!; },
            get refPatente(): PatentePericia { return SingletonHelper.getInstance().patentes_pericia.find(patente => patente.id === periciaPatente.idPatente)!; },
            get refAtributoPersonagem(): AtributoPersonagem { return atributos.find(atributo => atributo.refAtributo.id === this.refPericia.refAtributo.id)!; },

            get valorNivelPatente(): number { return this.refPatente.id - 1; },
            get valorBonusPatente(): number { return this.refPatente.valor; },
            get valorEfeito(): number { return obtemValorTotalComLinhaEfeito(0, this.refPericia.refLinhaEfeito.id); },
            get valorTotal(): number { return this.valorEfeito + this.valorBonusPatente; },

            get detalhesValor(): string[] { return [`Patente ${this.refPatente.nome}: ${this.refPatente.valor}`].concat(obterDetalhesPorLinhaEfeito(this.refPericia.refLinhaEfeito.id)); },

            realizarTeste() { console.log('precisa implementar realizarTeste'); }
        };
    });

    return (
        <PersonagemPericias.Provider value={{ pericias }}>
            {children}
        </PersonagemPericias.Provider>
    );
}

export const useClasseContextualPersonagemPericias = (): ClasseContextualPersonagemPericiasProps => {
    const context = useContext(PersonagemPericias);
    if (!context) throw new Error('useClasseContextualPersonagemPericias precisa estar dentro de uma ClasseContextual de PersonagemPericias');
    return context;
};