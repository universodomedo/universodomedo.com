// #region Imports
import { TestePericia, RollNumber } from "Components/Functions/RollNumber.tsx";
import { VariacaoAleatoria } from "udm-dice";
import { LoggerHelper } from "Types/classes_estaticas.tsx";
// #endregion

// export type TipoDeAcaoComVariancia = 'Maior Valor' | 'Menor Valor' | 'Soma';

export type VarianciaDaAcao = { valorMaximo: number, variancia: number }

export type PropsAcaoComVariancia = { listaVarianciasDaAcao: VarianciaDaAcao[] }
// export type PropsAcaoComVariancia = { tipoAcao: TipoDeAcaoComVariancia, listaVarianciasDaAcao: VarianciaDaAcao[] }

export type VariacaoAleatoriaFinal = { varianciaDaAcao: VarianciaDaAcao, valorFinal: number, variacaoAleatoria: VariacaoAleatoria };

export const ExecutaVariacaoGenerica = (props: PropsAcaoComVariancia) => {
    const listaVariacoes = ExecutaVariacao(props.listaVarianciasDaAcao);

    LoggerHelper.getInstance().adicionaMensagem(`${listaVariacoes.reduce((cur, acc) => { return cur + acc.valorFinal }, 0)} de dano`);

    listaVariacoes.map(variacao => {
        LoggerHelper.getInstance().adicionaMensagem(`Dano de ${variacao.varianciaDaAcao.valorMaximo - variacao.varianciaDaAcao.variancia} a ${variacao.varianciaDaAcao.valorMaximo}: ${variacao.valorFinal}`, true);
        LoggerHelper.getInstance().adicionaMensagem(`Aproveitamento de ${variacao.variacaoAleatoria.sucessoDessaVariancia}%`);
        LoggerHelper.getInstance().fechaNivelLogMensagem();
    });
}

export const ExecutaTestePericia = (props: PropsAcaoComVariancia) => {
    const listaVariacoes = ExecutaVariacao(props.listaVarianciasDaAcao);

    LoggerHelper.getInstance().adicionaMensagem(`${listaVariacoes.reduce((cur, acc) => { return cur + acc.valorFinal }, 0)} de dano`);
}

export const ExecutaVariacao = (listaVarianciasDaAcao: VarianciaDaAcao[]):VariacaoAleatoriaFinal[] => {
    return listaVarianciasDaAcao.map(variacaoDaAcao => {
        const rollNumber = RollNumber(variacaoDaAcao.variancia);

        return {
            varianciaDaAcao: variacaoDaAcao,
            valorFinal: variacaoDaAcao.valorMaximo - rollNumber.variancia,
            variacaoAleatoria: rollNumber,
        } as VariacaoAleatoriaFinal;
    });
}