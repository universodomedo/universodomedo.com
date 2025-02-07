// #region Imports
import React, { createContext, useContext } from "react";

// import { EmbrulhoComportamentoRitual, IRitualServico, IAcao, OpcoesExecucao, IModificadorService, RitualModelo } from "Classes/ClassesTipos/index.ts";
import { Acao, Ritual } from "Classes/ClassesTipos/index.ts";
import { useClasseContextualPersonagem } from "./Personagem";
import { SingletonHelper } from "Classes/classes_estaticas";
// #endregion

interface ClasseContextualPersonagemRituaisProps {
    rituais: Ritual[];
    acoesRituais: Acao[];
}

export const PersonagemRituais = createContext<ClasseContextualPersonagemRituaisProps | undefined>(undefined);

export const PersonagemRituaisProvider = ({ children }: { children: React.ReactNode; }) => {
    const { dadosFicha } = useClasseContextualPersonagem();

    // const rituais: Ritual[] = dadosFicha.rituais!.map(ritual =>
    //     new Ritual({ dadosGenericosRitual: ritual.args, dadosComportamentos: ritual.dadosComportamentos })
    //         .adicionarAcoes(
    //             (ritual.dadosAcoes || []).map(dadosAcao => (
    //                 {
    //                     props: { dadosGenericosAcao: dadosAcao.args, dadosComportamentos: dadosAcao.dadosComportamentos },
    //                     config: (acao) => {
    //                         // acao.adicionarCustos([
    //                         //     dadosAcao.custos.custoPE?.valor ? classeComArgumentos(CustoPE, dadosAcao.custos.custoPE.valor) : null!,
    //                         //     ...((dadosAcao.custos.custoExecucao || []).map(execucao =>
    //                         //         execucao.valor ? classeComArgumentos(CustoExecucao, execucao.idExecucao, execucao.valor) : null!
    //                         //     )),
    //                         //     dadosAcao.custos.custoComponente ? classeComArgumentos(CustoComponente) : null!
    //                         // ].filter(Boolean));
    //                         acao.adicionarModificadores((dadosAcao.modificadores?.map(modificador => modificador.props) || []));
    //                         acao.adicionarRequisitosEOpcoesPorId(dadosAcao.requisitos);
    //                     }
    //                 }
    //             ))
    //         )
    // )

    // const rituaisTeste: RitualModelo[] = dadosFicha.rituais.map(dadosRitual => {
    //     const ritual = {
    //         nome: 'nome',
    //         svg: `PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Zz4KICAgIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICAgIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgeD0iMzQxIiB5PSIyOTEiIGlkPSJzdmdfMiIgc3Ryb2tlLXdpZHRoPSIwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPlRlc3RlIDE8L3RleHQ+CiAgICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgeD0iNjMiIHk9IjExMCIgaWQ9InN2Z18zIiBmb250LXNpemU9IjE0MCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5SPC90ZXh0PgogIDwvZz4KPC9zdmc+`,
    //         acoes: [] as IAcao[],
    //     };

    //     return ritual;
    // });

    // const rituais: IRitualServico[] = dadosFicha.rituais.map(dadosRitual => {
    //     const ritual = {
    //         dados: dadosRitual.args,
    //         comportamentos: new EmbrulhoComportamentoRitual({ dadosComportamentoRitual: dadosRitual.dadosComportamentos.dadosComportamentoRitual! }),
    //         svg: `PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Zz4KICAgIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICAgIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgeD0iMzQxIiB5PSIyOTEiIGlkPSJzdmdfMiIgc3Ryb2tlLXdpZHRoPSIwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPlRlc3RlIDE8L3RleHQ+CiAgICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgeD0iNjMiIHk9IjExMCIgaWQ9InN2Z18zIiBmb250LXNpemU9IjE0MCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5SPC90ZXh0PgogIDwvZz4KPC9zdmc+`,
    //         acoes: [] as IAcao[],

    //         nomeExibicao: dadosRitual.args.nome,
    //     };

    //     ritual.acoes = (dadosRitual.dadosAcoes || []).map(dadosAcao => {
    //         const acao: IAcao = {
    //             dados: dadosAcao.args,
    //             svg: 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
    //             opcoesExecucoes: [] as OpcoesExecucao[],
    //             refPai: ritual,
    //             dadosComportamentos: dadosAcao.dadosComportamentos,
    //         };

    //         return acao;
    //     });

    //     return ritual;
    // });

    // const acoesRituais: IAcao[] = rituais.flatMap(ritual => ritual.acoes);

    const rituais: Ritual[] = [];
    const acoesRituais: Acao[] = [];
    
    return (
        <PersonagemRituais.Provider value={{ rituais, acoesRituais }}>
            {children}
        </PersonagemRituais.Provider>
    );
}

export const useClasseContextualPersonagemRituais = (): ClasseContextualPersonagemRituaisProps => {
    const context = useContext(PersonagemRituais);
    if (!context) throw new Error('useClasseContextualPersonagemRituais precisa estar dentro de uma ClasseContextual de PersonagemRituais');
    return context;
};