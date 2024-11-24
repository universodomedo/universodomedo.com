// #region Imports
import { Acao, GastaCustoProps } from 'Types/classes/index.ts';
import { FichaHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class Mecanica {
    constructor(
        public id: number,
        public descricao: string,
    ) { }
}

export const logicaMecanicas: { [key: number]: (valoresSelecionados: GastaCustoProps, acao: Acao) => void } = {
    // Sacar
    1: (valoresSelecionados) => {
        // const extremidadeSelecionada = FichaHelper.getInstance().personagem.estatisticasBuffaveis.extremidades.find(extremidade => extremidade.id === valoresSelecionados['idExtremidade']!)!;

        // extremidadeSelecionada.empunhar(valoresSelecionados['idItem']!);

        const extremidadeLivre = FichaHelper.getInstance().personagem.estatisticasBuffaveis.extremidades.find(extremidade => !extremidade.estaOcupada);

        extremidadeLivre!.empunhar(valoresSelecionados['idItem']!);
    },

    // Guardar
    2: (valoresSelecionados) => {
        const itemSelecionado = FichaHelper.getInstance().personagem.inventario.items.find(item => item.id === valoresSelecionados['idItem']);

        itemSelecionado?.refExtremidade?.guardar();
    },

    // Aplicar Buff
    3: (valoresSelecionados, acao) => {
        acao.ativaBuffs();
    },

    // Ganhar Coisa
    4: () => {
        FichaHelper.getInstance().personagem.estatisticasBuffaveis.execucoes.find(execucao => execucao.refTipoExecucao.id === 3)!.numeroAcoesAtuais++;
    }
};
