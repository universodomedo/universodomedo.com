// #region Imports
import { AtributoPersonagem, PericiaPatentePersonagem } from 'Classes/ClassesTipos/index.ts';
import { ExecutaTestePericia } from 'Recursos/Ficha/Variacao.ts';

// import { LoggerHelper } from 'Classes/classes_estaticas.ts';

// import { toast } from 'react-toastify';
// #endregion

export function ExecutaTestePericiaGenerico(atributoPersonagem: AtributoPersonagem, periciaPersonagem: PericiaPatentePersonagem): number {
    const numeroTestesInternos = (atributoPersonagem.valorTotal > 0 ? atributoPersonagem.valorTotal : 2 + Math.abs(atributoPersonagem.valorTotal));

    const variacaoAleatoriaFinal = ExecutaTestePericia({ listaVarianciasDaAcao: Array.from({ length: numeroTestesInternos }, () => ({ valorMaximo: 20, variancia: 19 })) });

    const valorDoTeste = (atributoPersonagem.valorTotal > 0
        ? variacaoAleatoriaFinal.reduce((cur, acc) => acc.valorFinal > cur ? acc.valorFinal : cur, 0)
        : variacaoAleatoriaFinal.reduce((cur, acc) => acc.valorFinal < cur ? acc.valorFinal : cur, 20)
    );

    const resultado = valorDoTeste + periciaPersonagem.valorTotal;

    const resumoTeste = `${periciaPersonagem.refPericia.nomeAbreviado}: [${resultado}]`;

    // LoggerHelper.getInstance().adicionaMensagem(resumoTeste);
    // toast(resumoTeste);

    // LoggerHelper.getInstance().adicionaMensagem(`${atributoPersonagem.valorTotal} ${atributoPersonagem.refAtributo.nomeAbrev}: [${variacaoAleatoriaFinal.map(item => item.valorFinal).join(', ')}]`);

    // if (periciaPersonagem.valorTotal > 0) LoggerHelper.getInstance().adicionaMensagem(`+${periciaPersonagem.valorTotal} Bônus`);

    // LoggerHelper.getInstance().fechaNivelLogMensagem();

    return resultado;
}