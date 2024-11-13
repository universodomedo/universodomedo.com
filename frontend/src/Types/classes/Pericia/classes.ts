// #region Imports
import { Atributo, AtributoPersonagem } from 'Types/classes/index.ts';
import { FichaHelper, LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
import { ExecutaTestePericia, VariacaoAleatoriaFinal } from 'Recursos/Ficha/Variacao.ts';
import { toast } from 'react-toastify';
// #endregion

export class Pericia {
    constructor(
        public id: number,
        private _idBuff: number,
        private _idAtributo: number,
        public nome: string,
        public nomeAbrev: string,
    ) { }

    get idBuffRelacionado(): number { return this._idBuff; }

    get refBuffAtivo(): number {
        return FichaHelper.getInstance().personagem.buffsAplicados.buffPorId(this.idBuffRelacionado);
    }

    get refAtributo(): Atributo {
        return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this._idAtributo)!;
    }
}

export class PatentePericia {
    constructor(
        public id: number,
        public nome: string,
        public valor: number,
    ) { }
}

export class PericiaPatentePersonagem {
    constructor(
        private _idPericia: number,
        private _idPatentePericia: number
    ) { }

    get refPericia(): Pericia { return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === this._idPericia)!; }
    get refPatente(): PatentePericia { return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === this._idPatentePericia)!; }
    get refAtributoPersonagem(): AtributoPersonagem { return FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === this.refPericia.refAtributo.id)!; }

    get valorNivelPatente(): number { return this.refPatente.id; }
    get valorBonusPatente(): number { return this.refPatente.valor; }
    get valorBonus(): number { return this.refPericia.refBuffAtivo; }
    get valorTotal(): number { return this.valorBonusPatente + this.valorBonus  }

    realizarTeste = () => {
        this.rodarTeste();

        LoggerHelper.getInstance().saveLog();
    }

    rodarTeste = () => {
        const resultadoVariacao = this.obterResultadoVariacao();

        const resumoTeste = `Teste ${this.refPericia.nomeAbrev}: [${resultadoVariacao.resultado + this.valorTotal}]`;

        LoggerHelper.getInstance().adicionaMensagem(resumoTeste);
        toast(resumoTeste);

        LoggerHelper.getInstance().adicionaMensagem(`${this.refAtributoPersonagem.valorTotal} ${this.refAtributoPersonagem.refAtributo.nomeAbrev}: [${resultadoVariacao.variacao.map(item => item.valorFinal).join(', ')}]`);

        if (this.valorTotal > 0)
            LoggerHelper.getInstance().adicionaMensagem(`+${this.valorTotal} Bônus`);
        LoggerHelper.getInstance().fechaNivelLogMensagem();
        // resultadoVariacao.map(variacao => {

        // });
        // ExecutaAcaoComVariancia({ valorMaximo: 20, variancia: 19});
        // this.rodarTeste();
        // LoggerHelper.getInstance().adicionaMensagem(`2 Agilidade: [14, 20]`);
        // LoggerHelper.getInstance().adicionaMensagem(`+5 Bônus: 25`);

        

        // LoggerHelper.getInstance().saveLog();
        // const resultadoTeste = TestePericia(this.refAtributoPersonagem.valorTotal, this.valorTotal);

        // toast(`Teste ${this.refPericia.nomeAbrev}: [${resultadoTeste}]`);
        // LoggerHelper.getInstance().adicionaMensagem(`Teste ${this.refPericia.nomeAbrev}: [${resultadoTeste}]`);
    }

    obterResultadoVariacao(): {variacao: VariacaoAleatoriaFinal[], resultado: number} {
        //logica provisoria
        const numeroDados = (this.refAtributoPersonagem.valorTotal > 0 ? this.refAtributoPersonagem.valorTotal : 2 + Math.abs(this.refAtributoPersonagem.valorTotal));

        const variacaoAleatoriaFinal = ExecutaTestePericia({listaVarianciasDaAcao: Array.from({ length: numeroDados },() => ({ valorMaximo: 20, variancia: 19 }))});

        //logica provisoria
        const valorDoTeste = (this.refAtributoPersonagem.valorTotal > 0
            ? variacaoAleatoriaFinal.reduce((cur, acc) => acc.valorFinal > cur ? acc.valorFinal : cur, 0)
            : variacaoAleatoriaFinal.reduce((cur, acc) => acc.valorFinal < cur ? acc.valorFinal : cur, 20)
        );

        return { variacao: variacaoAleatoriaFinal, resultado: valorDoTeste };
    }
}