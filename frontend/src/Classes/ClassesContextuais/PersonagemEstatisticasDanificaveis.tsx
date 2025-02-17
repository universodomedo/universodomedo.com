// #region Imports
import React, { createContext, useContext, useEffect, useState } from "react";

import { EstatisticaDanificavelPersonagem } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagem } from "Classes/ClassesContextuais/Personagem.tsx";
import { SingletonHelper } from "Classes/classes_estaticas";
// #endregion

interface ClasseContextualPersonagemEstatisticasDanificaveisProps {
    estatisticasDanificaveis: EstatisticaDanificavelPersonagem[];
};

export const PersonagemEstatisticasDanificaveis = createContext<ClasseContextualPersonagemEstatisticasDanificaveisProps | undefined>(undefined);

export const PersonagemEstatisticasDanificaveisProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosPersonagem } = useClasseContextualPersonagem();
    const [estatisticasDanificaveis, setEstatisticasDanificaveis] = useState<EstatisticaDanificavelPersonagem[]>([]);

    useEffect(() => {
        setEstatisticasDanificaveis(
            dadosPersonagem.estatisticasDanificaveis!.map(estatisticaDanificavel => {
                return {
                    valorAtual: estatisticaDanificavel.valorAtual,
                    valorMaximo: estatisticaDanificavel.valorMaximo,
        
                    alterarValorAtual: function (valor: number) {
                        this.valorAtual = this.valorAtual - valor;
                        atualizarEstatisticasDanificaveis();
                    },
                    alterarValorMaximo: function (valor: number) { console.log('precisa implementar alterarValorMaximo'); },
        
                    get refEstatisticaDanificavel() { return SingletonHelper.getInstance().estatisticas_danificavel.find(estatistica_danificavel => estatistica_danificavel.id === estatisticaDanificavel.idEstatisticaDanificavel)! },
                }
            })
        );
    }, []);
    // }, [dadosPersonagem.estatisticasDanificaveis]);

    const atualizarEstatisticasDanificaveis = () => setEstatisticasDanificaveis(estatisticasAnteriores => [...estatisticasAnteriores]);

    return (
        <PersonagemEstatisticasDanificaveis.Provider value={{ estatisticasDanificaveis }}>
            {children}
        </PersonagemEstatisticasDanificaveis.Provider>
    );
};

export const useClasseContextualPersonagemEstatisticasDanificaveis = (): ClasseContextualPersonagemEstatisticasDanificaveisProps => {
    const context = useContext(PersonagemEstatisticasDanificaveis);
    if (!context) throw new Error('useClasseContextualPersonagemEstatisticasDanificaveis precisa estar dentro de uma ClasseContextual de PersonagemEstatisticasDanificaveis');
    return context;
};