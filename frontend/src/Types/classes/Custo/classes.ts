// #region Imports
import { Acao, AcaoRitual, HabilidadeAtiva, ItemComponente, Pericia, TipoExecucao } from 'Types/classes/index.ts';
import { FichaHelper, LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export abstract class Custo {
    abstract get podeSerPago(): boolean;
    abstract get descricaoCusto(): string;
    protected abstract gastaCusto(props: GastaCustoProps): void;

    // protected abstract gastaCusto(idItem?: number): void;

    // processaGastaCusto(idItem?: number): void {
    //     this.gastaCusto(idItem);
    // }

    public refAcao?: Acao;
    setRefAcao(value: Acao): this { return (this.refAcao = value, this); }

    processaGastaCusto(props: GastaCustoProps): void {
        this.gastaCusto(props);
    }
}

export class CustoExecucao extends Custo {

    constructor(private _idTipoExecucao: number, public valor: number,) { super(); }

    get refTipoExecucao(): TipoExecucao { return SingletonHelper.getInstance().tipos_execucao.find(execucao => execucao.id === this._idTipoExecucao)!; }

    get podeSerPago(): boolean {
        if (this.refTipoExecucao.id === 1) return true;

        return FichaHelper.getInstance().personagem.estatisticasBuffaveis.execucoes.find(execucao => execucao.refTipoExecucao.id === this.refTipoExecucao.id)!.numeroAcoesAtuais >= this.valor;
    }

    get descricaoCusto(): string {
        if (this.refTipoExecucao.id === 1) return this.refTipoExecucao.nome;

        return `${this.valor} ${this.refTipoExecucao.nome}`;
    }

    gastaCusto(): void {
        return;
        if (this.refTipoExecucao.id === 1) return;

        LoggerHelper.getInstance().adicionaMensagem(`-${this.valor} ${this.refTipoExecucao.nome}`);

        FichaHelper.getInstance().personagem.estatisticasBuffaveis.execucoes.find(execucao => execucao.refTipoExecucao.id === this.refTipoExecucao.id)!.numeroAcoesAtuais -= this.valor;
    }
}

export class CustoPE extends Custo {
    constructor(public valor: number) { super(); }

    get podeSerPago(): boolean {
        return this.valor <= FichaHelper.getInstance().personagem.estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)!.valor;
    }

    get descricaoCusto(): string {
        return `${this.valor} P.E.`;
    }

    gastaCusto(): void {
        LoggerHelper.getInstance().adicionaMensagem(`-${this.valor} P.E.`);
        FichaHelper.getInstance().personagem.estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === 3)!.aplicarDanoFinal(this.valor);
    }
}

export class CustoComponente extends Custo {
    constructor() { super(); }

    public refAcao?: AcaoRitual;
    setRefAcao(value: AcaoRitual): this { return (this.refAcao = value, this); }

    get podeSerPago(): boolean { return FichaHelper.getInstance().personagem.inventario.items.some(item => item instanceof ItemComponente && item.detalhesComponente.refElemento.id === this.refAcao!.refPai.refElemento.id && item.detalhesComponente.refNivelComponente.id === this.refAcao!.refPai.refNivelComponente.id); }

    get descricaoCusto(): string { return `1 Carga de Componente ${this.refAcao!.refPai.refElemento.nome} ${this.refAcao!.refPai.refNivelComponente.nome}`; }

    gastaCusto(props: GastaCustoProps): void {
        const idItem = props['idItem'];
        
        LoggerHelper.getInstance().adicionaMensagem(`Componente de ${this.refAcao!.refPai.refElemento.nome} ${this.refAcao!.refPai.refNivelComponente.nome} gasto`);

        (FichaHelper.getInstance().personagem.inventario.items.find(item => item.id === idItem) as ItemComponente).gastaUso();
    }
}

export class TipoCusto {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}

export type GastaCustoProps = {
    [key: string]: number | undefined 
};