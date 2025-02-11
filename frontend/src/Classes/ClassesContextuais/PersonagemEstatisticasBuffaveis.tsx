// #region Imports
import React, { createContext, useContext, useEffect, useState } from "react";

import { Defesa, Deslocamento, EspacoCategoria, EspacoInventario, Execucao, ExecucaoPersonagem, Extremidade, ResistenciaParanormal, TipoCategoria } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagemAtributos } from "./PersonagemAtributos";
import { SingletonHelper } from "Classes/classes_estaticas";
// #endregion

interface ClasseContextualPersonagemEstatisticasBuffaveisProps {
    defesa: Defesa;
    deslocamento: Deslocamento;
    espacoInventario: EspacoInventario;
    execucoes: ExecucaoPersonagem[];
    setExecucoes: (execucoes: ExecucaoPersonagem[]) => void;
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


    // const listaPrecosAplicados = (listaPrecoTipoExecucao: PrecoExecucao[]): PrecoExecucao[] => {
    //     const agrupados = listaPrecoTipoExecucao.reduce((map, preco) => {
    //         const id = preco.refExecucao.id;
    //         if (!map.has(id)) map.set(id, { idTipoExecucao: id, quantidadeExecucoes: 0 });
    //         map.get(id)!.quantidadeExecucoes += preco.quantidadeExecucoes;
    //         return map;
    //     }, new Map<number, { idTipoExecucao: number, quantidadeExecucoes: number }>());

    //     const agrupadosFiltrados = Array.from(agrupados.values()).filter(preco => preco.quantidadeExecucoes > 0);

    //     // Cria a lista final de preços
    //     const listaPrecos: PrecoExecucao[] = agrupadosFiltrados.length > 0
    //         ? agrupadosFiltrados.map(({ idExecucao, quantidadeExecucoes }) => {  idExecucao, quantidadeExecucoes })
    //         : [{ idTipoExecucao: 1, quantidadeExecucoes: 0 }];
    
    //     // Calcula as propriedades desejadas
    //     const descricaoListaPreco = listaPrecos.map(preco => preco.descricaoPreco).join(' e ');
    //     const temApenasAcaoLivre = !listaPrecos.some(preco => preco.refExecucao.id !== 1);
    //     const podePagar = ControladorExecucoesPersonagem.podePagarPreco({ listaPrecos });
    //     const resumoPagamento = ControladorExecucoesPersonagem.resumoPagamento({ listaPrecos }).join(' e ');
    
    //     // Retorna o objeto com as propriedades calculadas
    //     return {
    //         listaPrecos,
    //         descricaoListaPreco,
    //         temApenasAcaoLivre,
    //         podePagar,
    //         resumoPagamento,
    //     };
    // };


    // const calculaCustoExecucao = (precoExecucao: PrecoGeralExecucao) => {
    //     let custoPadrao = 0;
    //     let custoMovimento = 0;
    
    //     for (const preco of precoExecucao.listaPrecos) {
    //         if (preco.refTipoExecucao.id === 2) {
    //             custoPadrao += preco.quantidadeExecucoes;
    //         } else if (preco.refTipoExecucao.id === 3) {
    //             custoMovimento += preco.quantidadeExecucoes;
    //         }
    //     }
    // }

    return (
        <PersonagemEstatisticasBuffaveis.Provider value={{ defesa, deslocamento, espacoInventario, execucoes, setExecucoes, extremidades, espacosCategoria, resistenciaParanormal }}>
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