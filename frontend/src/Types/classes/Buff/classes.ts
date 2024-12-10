// #region Imports
import { pluralize, Acao, Item, Duracao, CorTooltip, FiltroProps, FiltroPropsItems, OpcoesFiltro, OpcaoFiltro, Habilidade, HabilidadePassiva } from 'Types/classes/index.ts';
import { FichaHelper, LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export abstract class Buff {
    private static nextId = 1;
    public id: number;
    public quantidadeDuracaoAtual: number = 0;
    protected _ativo: boolean = false;
    public refPai?: Acao | Item | Habilidade;

    constructor(
        private _idBuff: number,
        public nome: string,
        public valor: number,
        private _idDuracao: number,
        public quantidadeDuracaoMaxima: number,
        private _idTipoBuff: number,
    ) {
        this.id = Buff.nextId++;
    }

    adicionaRefPai(refPai: Acao | Item | Habilidade): this { return (this.refPai = refPai), this; }

    get ativo(): boolean { return this._ativo; }
    get refBuff(): BuffRef { return SingletonHelper.getInstance().buffs.find(buff => buff.id === this._idBuff)!; }
    get refDuracao(): Duracao { return SingletonHelper.getInstance().duracoes.find(duracao => duracao.id === this._idDuracao)!; }
    get refTipoBuff(): TipoBuff { return SingletonHelper.getInstance().tipos_buff.find(tipo_buff => tipo_buff.id === this._idTipoBuff)!; }

    ativaBuff = (): void => {
        if (this._ativo) {
            LoggerHelper.getInstance().adicionaMensagem(`Renovando por ${this.quantidadeDuracaoMaxima} ${this.refDuracao.nome}`);
        } else {
            LoggerHelper.getInstance().adicionaMensagem(`Ativando por ${this.quantidadeDuracaoMaxima} ${this.refDuracao.nome}`);
        }

        this._ativo = true;
        this.quantidadeDuracaoAtual = this.quantidadeDuracaoMaxima;
    }

    desativaBuff = (): void => {
        LoggerHelper.getInstance().adicionaMensagem(`Desativando efeito ${this.nome}`);
        this._ativo = false;
    }

    reduzDuracao = (): void => {
        this.quantidadeDuracaoAtual--;
        if (this.quantidadeDuracaoAtual <= 0) {
            this.desativaBuff();
        } else {
            LoggerHelper.getInstance().adicionaMensagem(`${this.nome}: ${this.quantidadeDuracaoAtual} ${this.refBuff.nome} para terminar`);
        }
    }

    get textoDuracao(): string {
        if (this._idDuracao === 5)
            return `Duração ${this.refDuracao.nome}`;

        let retorno = 'Encerra';

        if (this.quantidadeDuracaoAtual > 2)
            return `${retorno} em ${this.quantidadeDuracaoAtual} ${pluralize(this.quantidadeDuracaoAtual, this.refDuracao.nome)}`;

        if (this._idDuracao === 1) {
            if (this.quantidadeDuracaoAtual === 1)
                retorno += ` depois dessa ${this.refDuracao.nome}`;
            if (this.quantidadeDuracaoAtual === 2)
                retorno += ` depois da próxima ${this.refDuracao.nome}`;
        }

        if (this._idDuracao === 2) {
            if (this.quantidadeDuracaoAtual === 1)
                retorno += ` no fim desse ${this.refDuracao.nome}`;
            if (this.quantidadeDuracaoAtual === 2)
                retorno += ` depois do próximo ${this.refDuracao.nome}`;
        }

        if (this._idDuracao === 3) {
            if (this.quantidadeDuracaoAtual === 1)
                retorno += ` no fim dessa ${this.refDuracao.nome}`;
            if (this.quantidadeDuracaoAtual === 2)
                retorno += ` depois da próxima ${this.refDuracao.nome}`;
        }

        if (this._idDuracao === 4) {
            if (this.quantidadeDuracaoAtual === 1)
                retorno += ` no fim desse ${this.refDuracao.nome}`;
            if (this.quantidadeDuracaoAtual === 2)
                retorno += ` depois do próximo ${this.refDuracao.nome}`;
        }

        return retorno;
    }

    static get filtroProps(): FiltroProps<Buff> {
        return new FiltroProps<Buff>(
            'Efeitos',
            [
                new FiltroPropsItems<Buff>(
                    (buff) => buff.nome,
                    'Nome da Fonte do Efeito',
                    'Procure pela Fonte do Efeito',
                    'text',
                    true
                ),
                new FiltroPropsItems<Buff>(
                    (buff) => buff.refBuff.nome,
                    'Alvo do Efeito',
                    'Selecione o Alvo',
                    'select',
                    true,
                    new OpcoesFiltro(
                        FichaHelper.getInstance().personagem.buffsAplicados.listaObjetosBuff.map((buff) => {
                            const buffRef = BuffRef.obtemBuffRefPorId(buff.idBuff);
                            return {
                                id: buffRef,
                                nome: buffRef
                            } as OpcaoFiltro;
                        })
                    )
                ),
                new FiltroPropsItems<Buff>(
                    (buff) => buff.refTipoBuff.id,
                    'Tipo do Efeito',
                    'Selecione o Tipo do Efeito Alvo',
                    'select',
                    true,
                    new OpcoesFiltro(
                        SingletonHelper.getInstance().tipos_buff.map((tipo_buff) => {
                            return {
                                id: tipo_buff.id,
                                nome: tipo_buff.nome
                            }
                        })
                    )
                ),
            ],
        )
    }
}

export class BuffInterno extends Buff {
    constructor(_idBuff: number, nome: string, valor: number, _idDuracao: number, quantidadeDuracaoMaxima: number, idTipoBuff: number) {
        super(_idBuff, nome, valor, _idDuracao, quantidadeDuracaoMaxima, idTipoBuff);
    }

    public get ativo(): boolean {
        const retorno = (
            this.refPai instanceof HabilidadePassiva ||
            (
                this.refPai instanceof Item &&
                (
                    (this.refPai.detalhesItem.precisaEstarEmpunhado && this.refPai.comportamentoEmpunhavel.estaEmpunhado) ||
                    (this.refPai.detalhesItem.precisaEstarVetindo && this.refPai.comportamentoVestivel.estaVestido)
                )
            )
        );
        // ||            this.refPai instanceof Acao &&
        return retorno || false;
        // return true;



        // return (!this.refPai?.precisaEstarEmpunhado || (this.refPai.precisaEstarEmpunhado && this.refPai.estaEmpunhado));
    }
}

export class BuffExterno extends Buff {
    public svg: string = `PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PHRleHQgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgdGV4dC1hbmNob3I9InN0YXJ0IiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiBmb250LXNpemU9IjE1MCIgaWQ9InN2Z18xIiB5PSIxMTQiIHg9IjU3IiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzAwMDAwMCI+RTwvdGV4dD48L2c+PC9zdmc+`;
    public refPai?: ItemEquipamento;
    public get ativo(): boolean {
        return (!this.refPai?.precisaEstarEmpunhado || (this.refPai.precisaEstarEmpunhado && this.refPai.estaEmpunhado));
    }

    constructor(_idBuff: number, nome: string, valor: number, _idDuracao: number, quantidadeDuracaoMaxima: number, idTipoBuff: number) {
        super(_idBuff, nome, valor, _idDuracao, quantidadeDuracaoMaxima, idTipoBuff);
    }

    adicionaRefPai(refPai: ItemEquipamento): this { return (this.refPai = refPai), this; }
}

export class BuffRef {
    constructor(
        public id: number,
        public nome: string,
    ) { }

    static obtemBuffRefPorId(idBuff: number): string {
        return SingletonHelper.getInstance().buffs.find(buff => buff.id === idBuff)!.nome;
    }
}

export class BuffsAplicados {
    constructor(
        public listaObjetosBuff: BuffsPorId[],
    ) { }

    public buffPorId = (idBuff: number): number => {
        const buff = this.listaObjetosBuff.find(objetoBuff => objetoBuff.idBuff === idBuff);
        return buff ? buff.valorParaId : 0;
    }
}

export class BuffsPorId {
    constructor(
        public idBuff: number,
        public tipoBuff: BuffsPorTipo[],
    ) { }

    get valorParaId(): number {
        return this.tipoBuff.reduce((acc, cur) => {
            return acc + cur.aplicado.valor;
        }, 0)
    }
}

export class BuffsPorTipo {
    constructor(
        public idTipoBuff: number,
        public aplicado: Buff,
        public sobreescritos: Buff[],
    ) { }
}

export class TipoBuff {
    constructor(
        public id: number,
        public nome: string,
        public nomeExibirTooltip: string,
    ) { }
}