// #region Imports
import { Acao, GastaCustoProps } from 'Types/classes/index.ts';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
import { ExecutaVariacaoGenerica } from 'Recursos/Ficha/Variacao';

import { LoggerHelper } from 'Types/classes_estaticas.tsx';
import { toast } from 'react-toastify';
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
        const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

        itemSelecionado?.sacar();
    },

    // Guardar
    2: (valoresSelecionados) => {
        const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

        itemSelecionado?.guardar();
    },

    // Aplicar Buff
    3: (valoresSelecionados, acao) => {
        acao.ativaBuffs();
    },

    // Vestir
    4: (valoresSelecionados) => {
        const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

        itemSelecionado?.vestir();
    },

    // Desvestir
    5: (valoresSelecionados) => {
        const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

        itemSelecionado?.desvestir();
    },

    // Realizar Ataque
    6: (valoresSelecionados, acao) => {
        // const alvoSelecionado = valoresSelecionados['alvo']

        const resultadoVariacao = ExecutaVariacaoGenerica({ listaVarianciasDaAcao: [{ valorMaximo: acao.refPai.comportamentoGeral.detalhesOfensivo.danoMax, variancia: acao.refPai.comportamentoGeral.detalhesOfensivo.varianciaDeDano }] })

        const resumoDano = `${resultadoVariacao.reduce((cur, acc) => { return cur + acc.valorFinal }, 0)} de dano`;

        acao.refPai.comportamentoGeral.detalhesOfensivo.refPericiaUtilizadaArma.rodarTeste();

        LoggerHelper.getInstance().adicionaMensagem(resumoDano);
        toast(resumoDano);
    
        resultadoVariacao.map(variacao => {
            LoggerHelper.getInstance().adicionaMensagem(`Dano de ${variacao.varianciaDaAcao.valorMaximo - variacao.varianciaDaAcao.variancia} a ${variacao.varianciaDaAcao.valorMaximo}: ${variacao.valorFinal}`, true);
            LoggerHelper.getInstance().adicionaMensagem(`Aproveitamento de ${variacao.variacaoAleatoria.sucessoDessaVariancia}%`);
            LoggerHelper.getInstance().fechaNivelLogMensagem();
        });
    }
};