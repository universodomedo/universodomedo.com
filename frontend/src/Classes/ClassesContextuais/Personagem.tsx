// #region Imports
import React, { createContext, useContext } from "react";

import { RLJ_Ficha2 } from "Classes/ClassesTipos/index.ts";

import { PersonagemModificadoresProvider } from 'Classes/ClassesContextuais/PersonagemModificadores.tsx';

import { PersonagemAtributosProvider } from 'Classes/ClassesContextuais/PersonagemAtributos.tsx';
import { PersonagemDetalhesProvider } from 'Classes/ClassesContextuais/PersonagemDetalhes.tsx';
import { PersonagemPendenciasNexUpProvider } from 'Classes/ClassesContextuais/PersonagemPendenciasNexUp.tsx';
import { PersonagemPericiasProvider } from 'Classes/ClassesContextuais/PersonagemPericias.tsx';

import { PersonagemEstatisticasBuffaveisProvider } from 'Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis.tsx';
import { PersonagemEstatisticasDanificaveisProvider } from 'Classes/ClassesContextuais/PersonagemEstatisticasDanificaveis.tsx';
import { PersonagemHabilidadesProvider } from 'Classes/ClassesContextuais/PersonagemHabilidades.tsx';
import { PersonagemInventarioProvider } from 'Classes/ClassesContextuais/PersonagemInventario.tsx';
import { PersonagemNaturezaProvider } from 'Classes/ClassesContextuais/PersonagemNatureza.tsx';
import { PersonagemProficienciasProvider } from 'Classes/ClassesContextuais/PersonagemProficiencias.tsx';
import { PersonagemReducoesProvider } from 'Classes/ClassesContextuais/PersonagemReducoes.tsx';
import { PersonagemRituaisProvider } from 'Classes/ClassesContextuais/PersonagemRituais.tsx';

import { PersonagemAcoesProvider } from 'Classes/ClassesContextuais/PersonagemAcoes.tsx';

import { combineProviders } from "Uteis/uteis";
// #endregion

const ProvidersControladoresPersonagem = combineProviders(
    PersonagemModificadoresProvider,
);

const ProvidersInternosPersonagem = combineProviders(
    PersonagemAtributosProvider,
    PersonagemDetalhesProvider,
    PersonagemPendenciasNexUpProvider,
    PersonagemPericiasProvider,
);

const ProvidersSubInternosPersonagem = combineProviders(
    PersonagemEstatisticasBuffaveisProvider,
    PersonagemEstatisticasDanificaveisProvider,
    PersonagemHabilidadesProvider,
    PersonagemInventarioProvider,
    PersonagemNaturezaProvider,
    PersonagemProficienciasProvider,
    PersonagemReducoesProvider,
    PersonagemRituaisProvider,
);

const ProvidersJogabilidadePersonagem = combineProviders(
    PersonagemAcoesProvider,
);

const NiveisProviders = combineProviders(
    ProvidersControladoresPersonagem,
    ProvidersInternosPersonagem,
    ProvidersSubInternosPersonagem,
    ProvidersJogabilidadePersonagem
);

interface ClasseContextualPersonagemProps {
    dadosFicha: RLJ_Ficha2;
};

export const Personagem = createContext<ClasseContextualPersonagemProps | undefined>(undefined);

export const PersonagemProvider = ({ children, dadosFicha }: { children: React.ReactNode; dadosFicha: RLJ_Ficha2; }) => {
    return (
        <Personagem.Provider value={{ dadosFicha }}>
            <NiveisProviders>
                {children}
            </NiveisProviders>
        </Personagem.Provider>
    );
}

export const useClasseContextualPersonagem = (): ClasseContextualPersonagemProps => {
    const context = useContext(Personagem);
    if (!context) throw new Error('useClasseContextualPersonagem precisa estar dentro de uma ClasseContextual de Personagem');
    return context;
};