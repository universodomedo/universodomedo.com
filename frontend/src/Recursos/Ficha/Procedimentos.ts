import { AtributoPersonagem, PericiaPatentePersonagem } from 'Classes/ClassesTipos/index.ts';
import { ExecutaTestePericia } from 'Recursos/Ficha/Variacao.ts';

export function ExecutaTestePericiaGenerico(atributoPersonagem: AtributoPersonagem, periciaPersonagem: PericiaPatentePersonagem): number {
    console.log('Fazendo teste de pericia');
    console.log(`Atributo: ${atributoPersonagem.refAtributo.nomeAbreviado}`);
    console.log(`Pericia: ${periciaPersonagem.refPericia.nomeAbreviado}`);
    
    const numeroTestesInternos = (atributoPersonagem.valorTotal > 0 ? atributoPersonagem.valorTotal : 2 + Math.abs(atributoPersonagem.valorTotal));

    const variacaoAleatoriaFinal = ExecutaTestePericia({ listaVarianciasDaAcao: Array.from({ length: numeroTestesInternos }, () => ({ valorMaximo: 20, variancia: 19 })) });

    const valorDoTeste = (atributoPersonagem.valorTotal > 0
        ? variacaoAleatoriaFinal.reduce((cur, acc) => acc.valorFinal > cur ? acc.valorFinal : cur, 0)
        : variacaoAleatoriaFinal.reduce((cur, acc) => acc.valorFinal < cur ? acc.valorFinal : cur, 20)
    );

    const resultado = valorDoTeste + periciaPersonagem.valorTotal;

    const resumoTeste = `${periciaPersonagem.refPericia.nomeAbreviado}: [${resultado}]`;

    console.log('resultado teste pericia');
    console.log(resumoTeste);

    // LoggerHelper.getInstance().adicionaMensagem(resumoTeste);
    // toast(resumoTeste);

    // LoggerHelper.getInstance().adicionaMensagem(`${atributoPersonagem.valorTotal} ${atributoPersonagem.refAtributo.nomeAbrev}: [${variacaoAleatoriaFinal.map(item => item.valorFinal).join(', ')}]`);

    // if (periciaPersonagem.valorTotal > 0) LoggerHelper.getInstance().adicionaMensagem(`+${periciaPersonagem.valorTotal} Bônus`);

    // LoggerHelper.getInstance().fechaNivelLogMensagem();

    return resultado;
}