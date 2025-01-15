// #region Imports
import { Acao, PrecoExecucao, Ritual, TipoExecucao } from 'Types/classes/index.ts';
import { LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

abstract class Custo {
    abstract get podeSerPago(): boolean;
    abstract get descricaoCusto(): string;
    protected abstract gastaCusto(props: GastaCustoProps): void;
}

export class CustoExecucao extends Custo {
    public precoExecucao: PrecoExecucao;

    constructor({ precoExecucao }: { precoExecucao: ConstructorParameters<typeof PrecoExecucao>[0] }) {
        super();
        this.precoExecucao = new PrecoExecucao(precoExecucao);
    }

    get podeSerPago(): boolean { return this.precoExecucao.podePagar; }
    get descricaoCusto(): string { return this.precoExecucao.descricaoListaPreco; }

    gastaCusto(): void {
        if (this.precoExecucao.temApenasAcaoLivre) return;

        this.precoExecucao.pagaExecucao();

        // LoggerHelper.getInstance().adicionaMensagem(`-${this.valor} ${this.refTipoExecucao.nome}`);

        // getPersonagemFromContext().estatisticasBuffaveis.execucoes.find(execucao => execucao.refTipoExecucao.id === this.refTipoExecucao.id)!.numeroAcoesAtuais -= this.valor;
    }
}

export class CustoPE extends Custo {
    public valor: number;

    constructor({ valor }: { valor: number}) {
        super();
        this.valor = valor;
    }

    get desconto(): number { return 0; }
    // get desconto(): number { return this.refAcao!.refPai instanceof Ritual ? this.refAcao!.refPai.comportamentos.comportamentoDescontosRitual.valorDesconto : 0; }
    get valorTotal(): number { return this.valor - this.desconto; }

    get podeSerPago(): boolean { return this.valorTotal <= getPersonagemFromContext().estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)!.valor; }
    get descricaoCusto(): string { return `${this.valorTotal} P.E.`; }

    gastaCusto(): void {
        LoggerHelper.getInstance().adicionaMensagem(`-${this.valorTotal} P.E.`);
        getPersonagemFromContext().estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)!.aplicarDanoFinal(this.valorTotal);
    }
}

export class CustoComponente {

}

export type GastaCustoProps = {
    [key: string]: number | undefined 
};