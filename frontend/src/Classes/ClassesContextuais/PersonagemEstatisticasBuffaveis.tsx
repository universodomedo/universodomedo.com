// #region Imports
import React, { createContext, useContext, useEffect, useState } from "react";

import { Defesa, Deslocamento, EspacoCategoria, CapacidadeDeCarga, Execucao, ExecucaoPersonagem, Extremidade, Item, ResistenciaParanormal, TipoCategoria } from "Classes/ClassesTipos/index.ts";
import { SingletonHelper } from "Classes/classes_estaticas.ts";

import { useClasseContextualPersonagemAtributos } from "Classes/ClassesContextuais/PersonagemAtributos.tsx";
import { useClasseContextualPersonagemModificadores } from "Classes/ClassesContextuais/PersonagemModificadores.tsx";
// #endregion

interface ClasseContextualPersonagemEstatisticasBuffaveisProps {
    defesa: Defesa;
    deslocamento: Deslocamento;
    capacidadeDeCarga: CapacidadeDeCarga;
    execucoes: ExecucaoPersonagem[];
    setExecucoes: (execucoes: ExecucaoPersonagem[]) => void;
    extremidades: Extremidade[];
    empunhaItem: (item: Item) => void;
    desempunharItem: (item: Item) => void;
    espacosCategoria: EspacoCategoria[];
    resistenciaParanormal: ResistenciaParanormal;
}

export const PersonagemEstatisticasBuffaveis = createContext<ClasseContextualPersonagemEstatisticasBuffaveisProps | undefined>(undefined);

export const PersonagemEstatisticasBuffaveisProvider = ({ children }: { children: React.ReactNode; }) => {
    const { atributos } = useClasseContextualPersonagemAtributos();
    const { adicionarModificador, removeModificador } = useClasseContextualPersonagemModificadores();

    const defesa: Defesa = {
        valorSemEfeitos: 5,
        get valorAdicionalPorAtributos(): number { return atributos.find(atributo => atributo.refAtributo.id === 1)!.valorTotal + atributos.find(atributo => atributo.refAtributo.id === 2)!.valorTotal + atributos.find(atributo => atributo.refAtributo.id === 5)!.valorTotal },
        get valorTotal(): number { return this.valorSemEfeitos + this.valorAdicionalPorAtributos; }
    };

    const deslocamento: Deslocamento = {
        valorSemEfeitos: 10,
        get valorTotal(): number { return this.valorSemEfeitos; }
    };

    const capacidadeDeCarga: CapacidadeDeCarga = {
        capacidadeNatural: 5,
        capacidadeExtraPorForca: 5,
        get capacidadeTotal(): number { return this.capacidadeNatural + (atributos.find(atributo => atributo.refAtributo.id === 2)!.valorTotal * this.capacidadeExtraPorForca) },
    };

    const [execucoes, setExecucoes] = useState<ExecucaoPersonagem[]>([]);
    useEffect(() => {
        setExecucoes(
            [
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
            ]
        );
    }, []);

    const [extremidades, setExtremidades] = React.useState<Extremidade[]>(() =>
        Array.from({ length: 2 }, () => ({
            refItem: undefined,
            get estaOcupada(): boolean {
                return this.refItem !== undefined;
            },
        }))
    );

    const espacosCategoria: EspacoCategoria[] = [
        {
            maximoDeItensDessaCategoria: 2,
            get refTipoCategoria(): TipoCategoria { return SingletonHelper.getInstance().tipos_categoria.find(tipo_categoria => tipo_categoria.id === 2)!; },
        },
        {
            maximoDeItensDessaCategoria: 1,
            get refTipoCategoria(): TipoCategoria { return SingletonHelper.getInstance().tipos_categoria.find(tipo_categoria => tipo_categoria.id === 3)!; },
        },
        {
            maximoDeItensDessaCategoria: 0,
            get refTipoCategoria(): TipoCategoria { return SingletonHelper.getInstance().tipos_categoria.find(tipo_categoria => tipo_categoria.id === 4)!; },
        },
        {
            maximoDeItensDessaCategoria: 0,
            get refTipoCategoria(): TipoCategoria { return SingletonHelper.getInstance().tipos_categoria.find(tipo_categoria => tipo_categoria.id === 5)!; },
        },
    ];

    const resistenciaParanormal: ResistenciaParanormal = {
        valorSemEfeitos: 0,
        get valorTotal(): number { return this.valorSemEfeitos; }
    };

    const empunhaItem = (item: Item) => {
        const novasExtremidades = [...extremidades];
        novasExtremidades.filter(extremidade => !extremidade.estaOcupada).slice(0, item.comportamentoEmpunhavel!.extremidadesNecessarias).forEach(extremidade => extremidade.refItem = item);
        setExtremidades(novasExtremidades);

        if (item.modificadores !== undefined) item.modificadores.filter(modificador => modificador.tipoModificador.tipo === 'Passivo' && modificador.tipoModificador.requisito === 'Empunhar').forEach(modificador => adicionarModificador(modificador));
    };

    const desempunharItem = (item: Item) => {
        const novasExtremidades = [...extremidades];
        novasExtremidades.filter(extremidade => extremidade.refItem?.codigoUnico === item.codigoUnico).forEach(extremidade => extremidade.refItem = undefined);
        setExtremidades(novasExtremidades);

        if (item.modificadores !== undefined) item.modificadores.filter(modificador => modificador.tipoModificador.tipo === 'Passivo' && modificador.tipoModificador.requisito === 'Empunhar').forEach(modificador => removeModificador(modificador));
    };

    return (
        <PersonagemEstatisticasBuffaveis.Provider value={{ defesa, deslocamento, capacidadeDeCarga, execucoes, setExecucoes, extremidades, empunhaItem, desempunharItem, espacosCategoria, resistenciaParanormal }}>
            {children}
        </PersonagemEstatisticasBuffaveis.Provider>
    );
}

export const useClasseContextualPersonagemEstatisticasBuffaveis = (): ClasseContextualPersonagemEstatisticasBuffaveisProps => {
    const context = useContext(PersonagemEstatisticasBuffaveis);
    if (!context) throw new Error('useClasseContextualPersonagemEstatisticasBuffaveis precisa estar dentro de uma ClasseContextual de PersonagemEstatisticasBuffaveis');
    return context;
};





// private static calculaCustos(precoExecucao: PrecoExecucao) {
//     const { execucoes } = useClasseContextualPersonagemEstatisticasBuffaveis();

//     let custoPadrao = 0;
//     let custoMovimento = 0;

//     for (const preco of precoExecucao.listaPrecos) {
//         if (preco.refTipoExecucao.id === 2) {
//             custoPadrao += preco.quantidadeExecucoes;
//         } else if (preco.refTipoExecucao.id === 3) {
//             custoMovimento += preco.quantidadeExecucoes;
//         }
//     }

//     const execucaoPadrao = execucoes.find(exec => exec.refTipoExecucao.id === 2);
//     const execucaoMovimento = execucoes.find(exec => exec.refTipoExecucao.id === 3);

//     const disponivelPadrao = execucaoPadrao?.numeroAcoesAtuais || 0;
//     const disponivelMovimento = execucaoMovimento?.numeroAcoesAtuais || 0;

//     const deficitMovimento = Math.max(0, custoMovimento - disponivelMovimento);
//     const totalPadraoNecessario = custoPadrao + deficitMovimento;

//     return { custoPadrao, custoMovimento, deficitMovimento, totalPadraoNecessario, disponivelPadrao, disponivelMovimento };
// }