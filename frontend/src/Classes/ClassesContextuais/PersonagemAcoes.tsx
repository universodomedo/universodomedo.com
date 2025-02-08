// #region Imports
import React, { createContext, useContext } from "react";

import { Acao } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagemHabilidades } from "./PersonagemHabilidades";
import { useClasseContextualPersonagemNatureza } from "./PersonagemNatureza";
import { useClasseContextualPersonagemRituais } from "./PersonagemRituais";

// import { EmbrulhoComportamentoAcao, GastaCustoProps, IAcaoService } from "Classes/ClassesTipos/index.ts";
// #endregion

interface ClasseContextualPersonagemAcoesProps {
    acoes: Acao[];
}

export const PersonagemAcoes = createContext<ClasseContextualPersonagemAcoesProps | undefined>(undefined);

export const PersonagemAcoesProvider = ({ children }: { children: React.ReactNode; }) => {
    const { acoesHabilidades } = useClasseContextualPersonagemHabilidades();
    const { acoesNatureza } = useClasseContextualPersonagemNatureza();
    const { rituais } = useClasseContextualPersonagemRituais();

    const acoes: Acao[] = [ ...rituais ].map(acao => {
        const acaoServico = {
            ...acao,
            nomeExibicao: acao.dados.nome,
            get bloqueada(): boolean { return !this.comportamentos.custosPodemSerPagos || !this.comportamentos.requisitosCumpridos || this.comportamentos.acaoTravada; },
            processaDificuldades: () => { return true; },
            executaComOpcoes: (valoresSelecionados: GastaCustoProps) => {},
            comportamentos: new EmbrulhoComportamentoAcao(),
        };

        if (acao.dadosComportamentos.dadosComportamentoCustoAcao !== undefined) acaoServico.comportamentos.setComportamentoCustoAcao(acao.dadosComportamentos.dadosComportamentoCustoAcao);
        if (acao.dadosComportamentos.dadosComportamentoDificuldadeAcao !== undefined) acaoServico.comportamentos.setComportamentoDificuldadeAcao(acao.dadosComportamentos.dadosComportamentoDificuldadeAcao);
        if (acao.dadosComportamentos.dadosComportamentoAcao !== undefined) acaoServico.comportamentos.setComportamentoAcao(acao.dadosComportamentos.dadosComportamentoAcao);
        if (acao.dadosComportamentos.dadosComportamentoRequisito !== undefined) acaoServico.comportamentos.setComportamentoRequisito(acao.dadosComportamentos.dadosComportamentoRequisito);
        if (acao.dadosComportamentos.dadosComportamentoConsomeUso !== undefined) acaoServico.comportamentos.setComportamentoConsomeUso(...acao.dadosComportamentos.dadosComportamentoConsomeUso);
        if (acao.dadosComportamentos.dadosComportamentoConsomeMunicao !== undefined) acaoServico.comportamentos.setComportamentoConsomeMunicao(...acao.dadosComportamentos.dadosComportamentoConsomeMunicao);

        return acaoServico;
    });

    return (
        <PersonagemAcoes.Provider value={{ acoes }}>
            {children}
        </PersonagemAcoes.Provider>
    );
}

export const useClasseContextualPersonagemAcoes = (): ClasseContextualPersonagemAcoesProps => {
    const context = useContext(PersonagemAcoes);
    if (!context) throw new Error('useClasseContextualPersonagemAcoes precisa estar dentro de uma ClasseContextual de PersonagemAcoes');
    return context;
};