// #region Imports
import React, { createContext, useContext } from "react";

import { Defesa, Deslocamento, EspacoCategoria, EspacoInventario, Execucao, ExecucaoPersonagem, Extremidade, ResistenciaParanormal, TipoCategoria } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagemAtributos } from "./PersonagemAtributos";
import { SingletonHelper } from "Classes/classes_estaticas";
// #endregion

interface ClasseContextualPersonagemEstatisticasBuffaveisProps {
    defesa: Defesa;
    deslocamento: Deslocamento;
    espacoInventario: EspacoInventario;
    execucoes: ExecucaoPersonagem[];
    extremidades: Extremidade[];
    espacosCategoria: EspacoCategoria[];
    resistenciaParanormal: ResistenciaParanormal;
}

export const PersonagemEstatisticasBuffaveis = createContext<ClasseContextualPersonagemEstatisticasBuffaveisProps | undefined>(undefined);

export const PersonagemEstatisticasBuffaveisProvider = ({ children }: { children: React.ReactNode; }) => {
    const { atributos } = useClasseContextualPersonagemAtributos();

    const defesa: Defesa = {
        valorSemEfeitos: 5,
        get valorAdicionalPorAtributos(): number { return atributos.find(atributo => atributo.refAtributo.id === 1)!.valorTotal + atributos.find(atributo => atributo.refAtributo.id === 2)!.valorTotal + atributos.find(atributo => atributo.refAtributo.id === 5)!.valorTotal },
        get valorTotal(): number { return this.valorSemEfeitos + this.valorAdicionalPorAtributos; }
    };

    const deslocamento: Deslocamento = {
        valorSemEfeitos: 10,
        get valorTotal(): number { return this.valorSemEfeitos; }
    };

    const espacoInventario: EspacoInventario = {
        capacidadeNatural: 5,
        capacidadeExtraPorForca: 5,
        get capacidadeTotal(): number { return this.capacidadeNatural + (atributos.find(atributo => atributo.refAtributo.id === 2)!.valorTotal * this.capacidadeExtraPorForca) },
    };

    const execucoes: ExecucaoPersonagem[] = [
        {
            numeroAcoesMaximasNatural: 1,
            numeroAcoesAtuais: 1,
            get numeroAcoesMaximasTotal(): number { return this.numeroAcoesMaximasNatural; },
            get refExecucao(): Execucao { return SingletonHelper.getInstance().execucoes.find(execucao => execucao.id === 2)!; },
            recarregaNumeroAcoes: () => { console.log('precisa implementar recarregaNumeroAcoes'); },
        },
        {
            numeroAcoesMaximasNatural: 1,
            numeroAcoesAtuais: 1,
            get numeroAcoesMaximasTotal(): number { return this.numeroAcoesMaximasNatural; },
            get refExecucao(): Execucao { return SingletonHelper.getInstance().execucoes.find(execucao => execucao.id === 3)!; },
            recarregaNumeroAcoes: () => { console.log('precisa implementar recarregaNumeroAcoes'); },
        },
    ];

    const extremidades: Extremidade[] = Array.from({ length: 2 }, (_, index) => {
        return {
            refItem: undefined,
            get estaOcupada(): boolean { return this.refItem !== undefined },

            empunhar: () => { console.log('precisa implementar empunhar'); },
            guardar: () => { console.log('precisa implementar guardar'); },
        }
    });

    const espacosCategoria: EspacoCategoria[] = [
        {
            maximoDeItensDessaCategoria: 2,
            get refTipoCategoria(): TipoCategoria { return SingletonHelper.getInstance().tipos_categoria.find(tipo_categoria => tipo_categoria.id === 2)!; },
        },
        {
            maximoDeItensDessaCategoria: 1,
            get refTipoCategoria(): TipoCategoria { return SingletonHelper.getInstance().tipos_categoria.find(tipo_categoria => tipo_categoria.id === 3)!; },
        },
    ];

    const resistenciaParanormal: ResistenciaParanormal = {
        valorSemEfeitos: 0,
        get valorTotal(): number { return this.valorSemEfeitos; }
    };

    return (
        <PersonagemEstatisticasBuffaveis.Provider value={{ defesa, deslocamento, espacoInventario, execucoes, extremidades, espacosCategoria, resistenciaParanormal }}>
            {children}
        </PersonagemEstatisticasBuffaveis.Provider>
    );
}

export const useClasseContextualPersonagemEstatisticasBuffaveis = (): ClasseContextualPersonagemEstatisticasBuffaveisProps => {
    const context = useContext(PersonagemEstatisticasBuffaveis);
    if (!context) throw new Error('useClasseContextualPersonagemEstatisticasBuffaveis precisa estar dentro de uma ClasseContextual de PersonagemEstatisticasBuffaveis');
    return context;
};