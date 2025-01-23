// #region Imports
import { getRandomVariance, VariacaoAleatoria } from "udm-dice";
// #endregion

// export type TipoDeAcaoComVariancia = 'Maior Valor' | 'Menor Valor' | 'Soma';

export type VarianciaDaAcao = { valorMaximo: number, variancia: number }

export type PropsAcaoComVariancia = { listaVarianciasDaAcao: VarianciaDaAcao[] }
// export type PropsAcaoComVariancia = { tipoAcao: TipoDeAcaoComVariancia, listaVarianciasDaAcao: VarianciaDaAcao[] }

export type VariacaoAleatoriaFinal = { varianciaDaAcao: VarianciaDaAcao, valorFinal: number, variacaoAleatoria: VariacaoAleatoria };

export const ExecutaVariacaoGenerica = (props: PropsAcaoComVariancia) => {
    return ExecutaVariacao(props.listaVarianciasDaAcao);
}

export const ExecutaTestePericia = (props: PropsAcaoComVariancia) => {
    return ExecutaVariacao(props.listaVarianciasDaAcao);
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

export function RollNumber(variancia:number) {
    const rnd = getRandomVariance(variancia);
    // console.log(`você foi prejudicado em ${rnd.variancia}`);
    return rnd;
    // Teste de Pericia -> Roda os valores, pega o maior, soma bonus
    // Aplicações -> Roda os valores, soma os valoes
}