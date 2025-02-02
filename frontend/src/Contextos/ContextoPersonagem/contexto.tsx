// #region Imports
import React, { createContext, useContext } from "react";

import { HabilidadePassiva, lista_geral_habilidades, Personagem, RLJ_Ficha2 } from 'Classes/ClassesTipos/index.ts';
import { geraFicha } from 'Uteis/uteis.tsx';

import { obtemDadosFichaDemonstracao } from "Recursos/DadosFicha.ts";
// #endregion

interface ContextoFichaProps {
    // dado temporario, enquanto n usa banco de dados
    idFichaNoLocalStorage: number,
    personagem: Personagem,
    atualizaHabilidades: () => void
}

export const ContextoFicha = createContext<ContextoFichaProps | undefined>(undefined);

export const useContextoFicha = (): ContextoFichaProps => {
    const context = useContext(ContextoFicha);

    if (!context) {
        throw new Error('useContextoFicha precisa estar dentro de um ContextoFicha');
    }

    return context;
};

export const ContextoFichaProvider = ({ children, seletorFicha }: { children: React.ReactNode; seletorFicha: { tipo: 'ficha'; idFichaNoLocalStorage: number } | { tipo: 'fichaDemonstracao' }; }) => {
    let data: RLJ_Ficha2;
    const idFichaNoLocalStorage = seletorFicha.tipo === 'fichaDemonstracao' ? 0 : seletorFicha.idFichaNoLocalStorage;

    if (seletorFicha.tipo === 'fichaDemonstracao') {
        data = obtemDadosFichaDemonstracao();
    } else {
        data = JSON.parse(localStorage.getItem("dadosFicha")!)[seletorFicha.idFichaNoLocalStorage];
    }

    const personagem = new Personagem(geraFicha(data));

    const atualizaHabilidades = () => {
        personagem.habilidades = [
            ...personagem.dadosFicha.habilidadesEspeciais?.map(habilidadeEspecial => new HabilidadePassiva({ dadosGenericosHabilidade: habilidadeEspecial.props, fonteHabilidade: { tipo: 'Mundana', fonte: 'Habilidade Especial' } })) || [],
            ...lista_geral_habilidades().filter(habilidade => habilidade.requisitoFicha === undefined || habilidade.requisitoFicha.verificaRequisitoCumprido(personagem))
        ];

        personagem.proficienciaPersonagem.proficiencias = [];
        if (personagem.proficienciaPersonagem.proficiencias.length <= 0) personagem.proficienciaPersonagem.adicionaProficiencia(personagem.habilidades.filter(habilidade => habilidade.dadosProficiencia !== undefined).map(habilidade => habilidade.dadosProficiencia!));

        personagem.controladorModificadores.limpaModificadores();
        personagem.habilidades.forEach(habilidade => habilidade instanceof HabilidadePassiva && habilidade.modificadores.forEach(modificador => modificador.comportamentos.ehPassivoSempreAtivo && modificador.ativaBuff()));
    }

    const PageComBridge = ({ children }: { children: React.ReactNode }) => {
        useContextBridge();

        personagem.estatisticasBuffaveis.execucoes.forEach(execucao => execucao.recarregaNumeroAcoes());

        atualizaHabilidades();

        return (
            <>{children}</>
        );
    }

    return (
        <ContextoFicha.Provider value={{ idFichaNoLocalStorage, personagem, atualizaHabilidades }}>
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