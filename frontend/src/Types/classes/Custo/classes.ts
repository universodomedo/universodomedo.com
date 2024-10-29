// #region Imports
import { AcaoRitual, ItemComponente, Pericia, TipoExecucao } from 'Types/classes/index.ts';
import { FichaHelper, LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export abstract class Custo {
    abstract get podeSerPago(): boolean;
    abstract get descricaoCusto(): string;
    protected abstract gastaCusto(idItem?: number): void;

    processaGastaCusto(idItem?: number): void {
        this.gastaCusto(idItem);
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

    gastaCusto(idItem: number): void {
        LoggerHelper.getInstance().adicionaMensagem(`Componente de ${this.refAcao!.refPai.refElemento.nome} ${this.refAcao!.refPai.refNivelComponente.nome} gasto`);

        (FichaHelper.getInstance().personagem.inventario.items.find(item => item.id === idItem) as ItemComponente).gastaUso();
    }
}

export class CustoTestePericia extends Custo {
    private vezesUtilizadasConsecutivo: number = 0;
    public bloqueadoNesseTurno: boolean = false;

    constructor(private _idPericia: number, public valorInicial: number, public valorConsecutivo: number) { super(); }

    get podeSerPago(): boolean { return (this.bloqueadoNesseTurno || this.valorAtual > FichaHelper.getInstance().personagem.pericias.find(pericia => pericia.refPericia.id === this.refPericia.id)!.valorTotal + 20); }
    get descricaoCusto(): string { return `DT ${this.valorAtual} de ${this.refPericia.nomeAbrev}${this.bloqueadoNesseTurno ? ` | Falhou nesse turno` : ''}`; }
    gastaCusto(): void {
        return;
    }

    get refPericia(): Pericia { return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === this._idPericia)!; }
    get valorAtual(): number { return this.valorInicial + (this.valorConsecutivo * this.vezesUtilizadasConsecutivo) }
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
        if (this.refTipoExecucao.id === 1) return;

        LoggerHelper.getInstance().adicionaMensagem(`-${this.valor} ${this.refTipoExecucao.nome}`);

        FichaHelper.getInstance().personagem.estatisticasBuffaveis.execucoes.find(execucao => execucao.refTipoExecucao.id === this.refTipoExecucao.id)!.numeroAcoesAtuais -= this.valor;
    }
}

export class TipoCusto {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}