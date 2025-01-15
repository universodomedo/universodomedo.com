// #region Imports
import React, { createContext, useContext } from "react";

import { HabilidadePassiva, lista_geral_habilidades, Personagem } from "Types/classes/index.ts";
import { geraFicha } from 'Utils/utils.tsx';
// #endregion

interface ContextoFichaProps {
    // dado temporario, enquanto n usa banco de dados
    idFichaNoLocalStorage: number,
    personagem: Personagem
}

export const ContextoFicha = createContext<ContextoFichaProps | undefined>(undefined);

export const useContextoFicha = (): ContextoFichaProps => {
    const context = useContext(ContextoFicha);

    if (!context) {
        throw new Error('useContextoFicha precisa estar dentro de um ContextoFicha');
    }

    return context;
};

export const ContextoFichaProvider = ({ children, idFichaNoLocalStorage }: { children: React.ReactNode, idFichaNoLocalStorage: number }) => {
    const data = JSON.parse(localStorage.getItem("dadosFicha")!)[idFichaNoLocalStorage];

    const personagem = new Personagem(geraFicha(data));

    const PageComBridge = ({ children }: { children: React.ReactNode }) => {
        useContextBridge();

        personagem.habilidades.forEach(habilidade => habilidade instanceof HabilidadePassiva && habilidade.modificadores.forEach(modificador => modificador.comportamentos.ehPassivoSempreAtivo && modificador.ativaBuff()));
        personagem.estatisticasBuffaveis.execucoes.forEach(execucao => execucao.recarregaNumeroAcoes());
        personagem.habilidades = lista_geral_habilidades().filter(habilidade => habilidade.requisitoFicha === undefined || habilidade.requisitoFicha.verificaRequisitoCumprido(personagem));
        if (personagem.proficienciaPersonagem.proficiencias.length <= 0 ) personagem.proficienciaPersonagem.adicionaProficiencia(personagem.habilidades.filter(habilidade => habilidade.dadosProficiencia !== undefined).map(habilidade => habilidade.dadosProficiencia!));

        return (
            <>{children}</>
        );
    }

    return (
        <ContextoFicha.Provider value={{ idFichaNoLocalStorage, personagem }}>
            <PageComBridge>
                {children}
            </PageComBridge>
        </ContextoFicha.Provider>
    );
}

let getPersonagem: (() => Personagem) | null = null;
let getIdFichaNoLocalStorage: (() => number) | null = null;

export const useContextBridge = () => {
    const { personagem, idFichaNoLocalStorage } = useContextoFicha();

    getPersonagem = () => personagem;
    getIdFichaNoLocalStorage = () => idFichaNoLocalStorage;
};

export const getPersonagemFromContext = () => {
    if (!getPersonagem) {
        throw new Error("ContextBridge não está inicializado neste contexto.");
    }

    return getPersonagem();
};

export const getIdFichaNoLocalStorageFromContext = () => {
    if (!getIdFichaNoLocalStorage) {
        throw new Error("ContextBridge não está inicializado neste contexto.");
    }

    return getIdFichaNoLocalStorage();
};