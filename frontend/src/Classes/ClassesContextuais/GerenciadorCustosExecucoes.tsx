import { pluralize, PrecoExecucao } from "Classes/ClassesTipos/index.ts";

import { useClasseContextualPersonagemEstatisticasBuffaveis } from "./PersonagemEstatisticasBuffaveis";

export const useCustosExecucoes = () => {
    const { execucoes } = useClasseContextualPersonagemEstatisticasBuffaveis();

    const calculaCustos = (precoExecucao: PrecoExecucao[]) => {
        let custoPadrao = 0;
        let custoMovimento = 0;

        for (const preco of precoExecucao) {
            if (preco.refExecucao.id === 2) {
                custoPadrao += preco.quantidadeExecucoes;
            } else if (preco.refExecucao.id === 3) {
                custoMovimento += preco.quantidadeExecucoes;
            }
        }

        const execucaoPadrao = execucoes.find(exec => exec.refExecucao.id === 2);
        const execucaoMovimento = execucoes.find(exec => exec.refExecucao.id === 3);

        const disponivelPadrao = execucaoPadrao?.numeroAcoesAtuais || 0;
        const disponivelMovimento = execucaoMovimento?.numeroAcoesAtuais || 0;

        const deficitMovimento = Math.max(0, custoMovimento - disponivelMovimento);
        const totalPadraoNecessario = custoPadrao + deficitMovimento;

        return { custoPadrao, custoMovimento, deficitMovimento, totalPadraoNecessario, disponivelPadrao, disponivelMovimento };
    };

    const podePagarPreco = (precoExecucao: PrecoExecucao[]) => {
        const { totalPadraoNecessario, disponivelPadrao } = calculaCustos(precoExecucao);
        return disponivelPadrao >= totalPadraoNecessario;
    };

    const pagaPrecoExecucao = (precoExecucao: PrecoExecucao[]) => {
        const { custoPadrao, custoMovimento, deficitMovimento } = calculaCustos(precoExecucao);

        const execucaoPadrao = execucoes.find(exec => exec.refExecucao.id === 2)!;
        const execucaoMovimento = execucoes.find(exec => exec.refExecucao.id === 3)!;

        execucaoMovimento.numeroAcoesAtuais = Math.max(0, execucaoMovimento.numeroAcoesAtuais - custoMovimento);
        execucaoPadrao.numeroAcoesAtuais -= custoPadrao + deficitMovimento;
    };

    const resumoPagamento = (precoExecucao: PrecoExecucao[]) => {
        const { custoPadrao, custoMovimento, deficitMovimento, disponivelMovimento } = calculaCustos(precoExecucao);

        const log: string[] = [];
        if (custoMovimento > 0) {
            const gastoMovimento = Math.min(custoMovimento, disponivelMovimento);
            if (gastoMovimento > 0) {
                log.push(`${gastoMovimento} ${pluralize(gastoMovimento, 'Ação', 'Ações')} de Movimento`);
            }
            if (deficitMovimento > 0) {
                log.push(`${deficitMovimento} ${pluralize(deficitMovimento, 'Ação', 'Ações')} Padrão (Substituindo Ação de Movimento)`);
            }
        }
        if (custoPadrao > 0) {
            log.push(`${custoPadrao} ${pluralize(custoPadrao, 'Ação', 'Ações')} Padrão`);
        }

        return log;
    };

    return { calculaCustos, podePagarPreco, pagaPrecoExecucao, resumoPagamento };
};