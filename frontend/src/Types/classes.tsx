// #region Imports
import CheckboxComponent from "Components/SubComponents/CheckBoxValue/page.tsx";
import { MDL_Atributo, MDL_AtributoPersonagem, MDL_EstatisticaDanificavel, MDL_PatentePericia, MDL_Pericia, MDL_Personagem, MDL_TipoDano, RLJ_AtributoPersonagem_Atributo, RLJ_EstatisticasDanificaveisPersonagem_Estatistica, RLJ_Ficha, RLJ_PericiasPatentesPersonagem_Pericia_Patente, RLJ_ReducaoDanoPersonagem_TipoDano, MDL_CaracteristicaArma, MDL_Habilidade, MDL_Ritual, RLJ_Rituais, MDL_CirculoRitual, MDL_EfeitoAcao, MDL_Duracao, MDL_Elemento } from "udm-types";
import { FichaHelper, SingletonHelper, LoggerHelper } from "Types/classes_estaticas.tsx";
import { toast } from "react-toastify";
import { VarianciaDaAcao, ExecutaVariacao, ExecutaTestePericia, ExecutaVariacaoGenerica } from 'Recursos/Ficha/Variacao.ts';
// #endregion

export const pluralize = (count: number, singular: string, plural?: string): string => {
    const pluralForm = plural || `${singular}s`;
    return count === 1 ? singular : pluralForm;
};

function adicionarAcoesUtil<T extends Ritual | Item | Habilidade>(instancia: T, acoes: Acao[], acaoParams: [new (...args: any[]) => Acao, any[], (acao: Acao) => void][]): void {
    acaoParams.forEach(([AcaoClass, params, configurarAcao]) => {
        const acao = new AcaoClass(...params, instancia).adicionaRefPai(instancia);

        if (configurarAcao) configurarAcao(acao);

        acoes.push(acao);
    });
}

function adicionarBuffsUtil<T extends Acao | Item>(instancia: T, buffs: Buff[], buffParams: [new (...args: any[]) => Buff, any[]][]): void {
    buffParams.forEach(([BuffClass, params]) => {
        const buff = new BuffClass(...params, instancia).adicionaRefPai(instancia);

        buffs.push(buff);
    });
}

function classeComArgumentos<T extends new (...args: any[]) => any>(Ctor: T, ...params: ConstructorParameters<T>) {
    return [Ctor, params] as [T, ConstructorParameters<T>];
}

export class Historico {
    public lista: string[] = [];

    teste = (mensagem: string) => {
        this.lista.push(mensagem);
        console.log(mensagem);
    }
}

class Receptor {
    private historico: Historico = new Historico();

    constructor(
        public personagem: Personagem,
    ) { }

    teste = (idEstatistica: number, valor: number, flagTipo: number) => {
        console.log('teste');
        console.log(flagTipo);
        if (flagTipo === 1)
            this.personagem.estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === idEstatistica)?.aplicarDanoFinal(valor);

        if (flagTipo === 2)
            this.personagem.estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === idEstatistica)?.aplicarCura(valor);

        this.personagem.onUpdate();
    }
}

export class Personagem {
    public detalhes: PersonagemDetalhes;
    public estatisticasDanificaveis: EstatisticaDanificavel[] = [];
    public estatisticasBuffaveis: EstatisticasBuffaveisPersonagem;
    public reducoesDano: ReducaoDano[] = [];
    public atributos: AtributoPersonagem[];
    public pericias: PericiaPatentePersonagem[];
    public inventario: Inventario = new Inventario();
    public habilidades: Habilidade[] = [];
    public buffsExternos: Buff[] = [];
    public rituais: Ritual[] = [];
    public receptor: Receptor = new Receptor(this);

    public get acoes(): Acao[] {
        const acoesRituais = this.rituais.reduce((acc: Acao[], ritual) => {
            return acc.concat(ritual.acoes);
        }, []);

        const acoesHabilidades = this.habilidades.reduce((acc: Acao[], habilidade) => {
            return acc.concat(habilidade.acoes);
        }, [])

        return acoesRituais.concat(this.inventario.acoesInventario()).concat(acoesHabilidades);
    }

    private obterBuffs = (): Buff[] => {
        const buffsAcoes = this.acoes.reduce((acc: Buff[], acao) => {
            return acc.concat(acao.buffs);
        }, []);

        return buffsAcoes.concat(this.inventario.buffsInventario()).concat(this.buffsExternos);
    }

    get buffsAplicados(): BuffsAplicados {
        const buffs = this.obterBuffs().filter(buff => buff.ativo);

        const idsBuffs = Array.from(
            new Set(buffs.map((buff) => buff.refBuff.id))
        );

        const buffsPorId: BuffsPorId[] = [];
        idsBuffs.map(idBuff => {
            const buffsDesseId = buffs.filter(buff => buff.refBuff.id === idBuff);

            const tiposBuffs = Array.from(
                new Set(buffsDesseId.map(buff => buff.refTipoBuff.id))
            );

            const buffsPorTipo: BuffsPorTipo[] = [];
            tiposBuffs.map(idTipoBuff => {
                const buffsDesseTipo = buffsDesseId.filter(buff => buff.refTipoBuff.id === idTipoBuff);

                const maiorBuffDesseTipo = buffsDesseTipo.reduce((maiorValor, cur) => {
                    return cur.valor > maiorValor.valor ? cur : maiorValor;
                }, buffsDesseTipo[0]);

                const buffsSobreescritos = buffsDesseTipo.filter(buff => buff.id !== maiorBuffDesseTipo.id);

                buffsPorTipo.push(new BuffsPorTipo(idTipoBuff, maiorBuffDesseTipo, buffsSobreescritos));
            });

            buffsPorId.push(new BuffsPorId(idBuff, buffsPorTipo));
        });

        return new BuffsAplicados(buffsPorId);
    }

    // public get buffs(): Buff[] {
    //     return this.obterBuffs().filter(buff => buff.ativo);
    // }

    public onUpdate: () => void = () => { };

    // constructor(db_ficha?: RLJ_Ficha);

    // constructor(estatisticas:Estatisticas, atributos:Atributo[], detalhes:CharacterDetalhes, reducoesDano:ReducaoDano[], estatisticasDanificaveisPersonagem:EstatisticasDanificaveisPersonagem) {
    // constructor(db_ficha:RLJ_Ficha, habilidades: MDL_Habilidade[]) {
    // constructor(db_ficha?: RLJ_Ficha) {
    constructor(private _ficha: RLJ_Ficha2) {
        this.detalhes = new PersonagemDetalhes(this._ficha.detalhes!.nome, this._ficha.detalhes!.idClasse, this._ficha.detalhes!.idNivel);

        this.estatisticasDanificaveis = this._ficha.estatisticasDanificaveis!.map(estatisticaDanificavel => {
            return new EstatisticaDanificavel(estatisticaDanificavel.id, estatisticaDanificavel.valor!, estatisticaDanificavel.valorMaximo!)
        });

        this.estatisticasBuffaveis = new EstatisticasBuffaveisPersonagem(
            new Defesa(5, 1, 1, 1),
            10,
            0,
            [new Execucao(2, 1), new Execucao(3, 1), new Execucao(4, 1), new Execucao(6, 1)],
            new EspacoInventario(5, 5),
            new GerenciadorEspacoCategoria([new EspacoCategoria(1, 2)]),
            [new Extremidade(), new Extremidade()],
        );

        // this.reducoesDano = this._ficha.reducoesDano.map(reducaoDano => new ReducaoDano(reducaoDano.valor!, reducaoDano.tipoDano, this));
        this.atributos = this._ficha.atributos!.map(attr => new AtributoPersonagem(attr.id, attr.valor!));
        this.pericias = this._ficha.periciasPatentes!.map(periciaPatente => new PericiaPatentePersonagem(periciaPatente.idPericia, periciaPatente.idPatente));

        const item6 = new ItemArma(new NomeItem('Arma Corpo-a-Corpo Leve Simples', "Gorge"), 2, 0, true, new DetalhesItemArma(4, 3, 1, 8))
            .adicionarAcoes([
                [
                    ...classeComArgumentos(AcaoAtaque, 'Realizar Ataque', 2, 1, 3),
                    (acao) => {
                        acao.adicionarCustos([
                            classeComArgumentos(CustoExecucao, 2, 1),
                        ]);
                        acao.adicionarRequisitos([
                            classeComArgumentos(RequisitoItemEmpunhado),
                        ]);
                        acao.adicionarOpcoesExecucao([
                            {
                                key: 'alvo',
                                displayName: 'Alvo da Ação',
                                obterOpcoes: (): Opcao[] => {
                                    return [{key: 1, value: 'Alguem bem atrás de você'}];
                                }
                            },
                        ]);
                    }
                ] 
            ]);
        this.inventario.adicionarItemNoInventario(item6);

        this.habilidades = lista_geral_habilidades().filter(habilidade => habilidade.requisitoFicha.verificaRequisitoCumprido(this));
    }

    // receberDanoVital = (danoGeral:DanoGeral) => {
    //     this.controladorPersonagem.reduzDano(danoGeral);
    // }

    public rodaDuracao = (idDuracao: number) => {
        LoggerHelper.getInstance().adicionaMensagem(`Rodou ${SingletonHelper.getInstance().duracoes.find(duracao => duracao.id === idDuracao)?.nome}`);

        this.obterBuffs().filter(buff => buff.ativo).map(buff => {
            if (buff.refDuracao.id === idDuracao) {
                buff.reduzDuracao();
            } else if (buff.refDuracao.id < idDuracao) {
                buff.desativaBuff();
            }
        });

        if (idDuracao >= 2) this.estatisticasBuffaveis.execucoes.forEach(execucao => execucao.recarregaNumeroAcoes());

        LoggerHelper.getInstance().saveLog();

        this.onUpdate();
    }

    public carregaOnUpdate = (callback: () => void) => {
        this.onUpdate = callback;
    }

    public alterarMaximoEstatistica = (idEstatistica: number, valorMaximo: number) => {
        if (typeof valorMaximo !== 'number' && valorMaximo < 1) return;

        const estatistica = this.estatisticasDanificaveis.find(estatistica => estatistica.refEstatisticaDanificavel.id === idEstatistica)!;
        estatistica.alterarValorMaximo(valorMaximo);
        // estatistica.aplicarCura(valorMaximo);

        this.onUpdate();
    }
}

export class EstatisticasBuffaveisPersonagem {
    constructor(
        public defesa: Defesa,
        public deslocamento: number,
        public resistenciaParanormal: number,
        public execucoes: Execucao[],
        public espacoInventario: EspacoInventario,
        public gerenciadorEspacoCategoria: GerenciadorEspacoCategoria,
        public extremidades: Extremidade[],
    ) { }
}

export class GerenciadorEspacoCategoria {
    constructor(public espacosCategoria: EspacoCategoria[]) { }

    numeroItensCategoria(valorCategoria: number): number {
        return FichaHelper.getInstance().personagem.inventario.items.filter(item => item.categoria === valorCategoria).length;
    }
}

export class EspacoCategoria {
    constructor(
        public valorCategoria: number,
        public maximoEspacosCategoria: number,
    ) { }

    get nomeCategoria(): string {
        return `Categoria ${this.valorCategoria}`;
    }
}

export class EspacoInventario {
    constructor(
        public valorNatural: number,
        public valorAdicionalPorForca: number,
    ) { }

    get espacoTotal(): number {
        return (
            this.valorNatural +
            (this.valorAdicionalPorForca * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 2)?.valorTotal!)
        )
    }
}

export class Defesa {
    constructor(
        public valorNatural: number,
        public valorAdicionaPorAgilidade: number,
        public valorAdicionaPorForca: number,
        public valorAdicionaPorVigor: number,
    ) { }

    get defesaTotal(): number {
        return (
            this.valorNatural +
            (this.valorAdicionaPorAgilidade * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 1)?.valorTotal!) +
            (this.valorAdicionaPorForca * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 2)?.valorTotal!) +
            (this.valorAdicionaPorVigor * FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === 5)?.valorTotal!)
        );
    }
}

export class EstatisticaBuffavel {
    constructor(
        public idEstatisticaBuffavel: number,
    ) { }
}

export class EstatisticaDanificavel {
    constructor(
        private _idEstatisticaDanificavel: number,
        public valor: number,
        public valorMaximo: number
    ) { }

    get refEstatisticaDanificavel(): TipoEstatisticaDanificavel {
        return SingletonHelper.getInstance().tipo_estatistica_danificavel.find(estatistica_danificavel => estatistica_danificavel.id === this._idEstatisticaDanificavel)!;
    }

    public aplicarDanoFinal(valor: number): void {
        // LoggerHelper.getInstance().adicionaMensagem(`Recebeu ${valor} de Dano`);
        // LoggerHelper.getInstance().adicionaMensagem(`De ${this.valor} de ${this.refEstatisticaDanificavel.nomeAbrev} para ${Math.max(this.valor - valor, 0)}`, true);
        // LoggerHelper.getInstance().fechaNivelLogMensagem();
        this.valor = Math.max(this.valor - valor, 0);
        // LoggerHelper.getInstance().saveLog();
    }
    public aplicarCura(valor: number): void {
        // LoggerHelper.getInstance().adicionaMensagem(`Recebeu ${valor} de Cura`);
        // LoggerHelper.getInstance().adicionaMensagem(`De ${this.valor} de ${this.refEstatisticaDanificavel.nomeAbrev} para ${Math.min(this.valor + valor, this.valorMaximo)}`, true);
        // LoggerHelper.getInstance().fechaNivelLogMensagem();
        this.valor = Math.min(this.valor + valor, this.valorMaximo);
        // LoggerHelper.getInstance().saveLog();
    }

    public alterarValorMaximo(valorMaximo: number): void {
        this.valorMaximo = this.valor = valorMaximo;
    }
}

export class ReducaoDano {
    constructor(
        public valor: number,
        public tipoDano: MDL_TipoDano,
        private refPersonagem: Personagem
    ) { }

    get valorBonus(): number {
        // return this.refPersonagem.buffs.filter(buff => buff.refBuff.id === this.tipoDano.idBuff).reduce((acc, cur) => {
        //     return acc + cur.valor;
        // }, 0);

        return 0;
    }

    get valorTotal(): number {
        return this.valor + this.valorBonus;
    }
}

export class Atributo {
    constructor(
        public id: number,
        private _idBuff: number,
        public nome: string,
        public nomeAbrev: string,
    ) { }

    get refBuffAtivo(): number {
        return FichaHelper.getInstance().personagem.buffsAplicados.buffPorId(this._idBuff);
    }
}

export class AtributoPersonagem {
    constructor(
        private _idAtributo: number,
        public valor: number
    ) { }

    get refAtributo(): Atributo {
        return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this._idAtributo)!;
    }

    get valorBonus(): number {
        return this.refAtributo.refBuffAtivo;
    }

    get valorTotal(): number {
        return this.valor + this.valorBonus;
    }
}

export class Pericia {
    constructor(
        public id: number,
        private _idBuff: number,
        private _idAtributo: number,
        public nome: string,
        public nomeAbrev: string,
    ) { }

    get refBuffAtivo(): number {
        return FichaHelper.getInstance().personagem.buffsAplicados.buffPorId(this._idBuff);
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

    get refPericia(): Pericia {
        return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === this._idPericia)!;
    }

    get refPatente(): PatentePericia {
        return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === this._idPatentePericia)!;
    }

    get refAtributoPersonagem(): AtributoPersonagem {
        return FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === this.refPericia.refAtributo.id)!;
    }

    get valorBonus(): number {
        return this.refPericia.refBuffAtivo;
    }

    get valorTotal(): number {
        return this.refPatente.valor! + this.valorBonus;
    }

    realizarTeste = () => {
        // ExecutaTestePericia();
        // ExecutaAcaoComVariancia({ valorMaximo: 20, variancia: 19});
        // this.rodarTeste();
        // LoggerHelper.getInstance().adicionaMensagem(`2 Agilidade: [14, 20]`);
        // LoggerHelper.getInstance().adicionaMensagem(`+5 Bônus: 25`);

        // LoggerHelper.getInstance().saveLog();

        // LoggerHelper.getInstance().saveLog();
    }

    rodarTeste = () => {
        // const resultadoTeste = TestePericia(this.refAtributoPersonagem.valorTotal, this.valorTotal);

        // toast(`Teste ${this.refPericia.nomeAbrev}: [${resultadoTeste}]`);
        // LoggerHelper.getInstance().adicionaMensagem(`Teste ${this.refPericia.nomeAbrev}: [${resultadoTeste}]`);
    }
}

export abstract class Buff {
    private static nextId = 1;
    public id: number;
    public quantidadeDuracaoAtual: number = 0;
    protected _ativo: boolean = false;
    public refPai?: Acao | Item;

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

    adicionaRefPai(refPai: Acao | Item): this { return (this.refPai = refPai), this; }


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

    get tooltipPropsSuper(): TooltipProps {
        return {
            caixaInformacao: {
                cabecalho: [
                    { tipo: 'titulo', conteudo: this.nome }
                ],
                corpo: [
                    { tipo: 'texto', conteudo: `+${this.valor} ${this.refBuff.nome}` },
                    { tipo: 'texto', conteudo: `${this.refTipoBuff.nomeExibirTooltip}` },
                    { tipo: 'texto', conteudo: `${this.textoDuracao}` },
                ],
            },
            iconeCustomizado: {
                corDeFundo: '',
                svg: '',
            },
            corTooltip: new CorTooltip('#FFFFFF').cores,
            numeroUnidades: 1,
        };
    }

    abstract get tooltipProps(): TooltipProps;

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

    get tooltipProps(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsSuper;

        return {
            caixaInformacao: {
                cabecalho: tooltipPropsSuper.caixaInformacao.cabecalho,
                corpo: tooltipPropsSuper.caixaInformacao.corpo,
            },
            iconeCustomizado: {
                corDeFundo: '#00FF00',
                svg: this.refPai!.svg,
            },
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: tooltipPropsSuper.numeroUnidades,
        };
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

    get tooltipProps(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsSuper;

        return {
            caixaInformacao: {
                cabecalho: tooltipPropsSuper.caixaInformacao.cabecalho,
                corpo: tooltipPropsSuper.caixaInformacao.corpo,
            },
            iconeCustomizado: {
                corDeFundo: '#00FF00',
                svg: this.svg,
            },
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: tooltipPropsSuper.numeroUnidades,
        };
    }
}


// ================================================= //




export class Acao {
    private static nextId = 1;
    public id: number;
    public buffs: Buff[] = [];
    public custos: Custo[] = [];
    public requisitos: Requisito[] = [];
    public opcoesExecucoes: OpcoesExecucao[] = [];
    protected _refPai?: Ritual | Item | Habilidade;

    constructor(
        public nome: string,
        private _idTipoAcao: number,
        private _idCategoriaAcao: number,
        private _idMecanica: number,

        public svg: string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+',
    ) {
        this.id = Acao.nextId++;

        // if (this.refCategoriaAcao.id === 2) {
        //     this.buffs.map(buff => {
        //         FichaHelper.getInstance().personagem.buffs.push(buff);
        //     });
        // }
    }

    get refPai(): Ritual | Item | Habilidade { return this._refPai!; }
    get refTipoAcao(): TipoAcao { return SingletonHelper.getInstance().tipos_acao.find(tipo_acao => tipo_acao.id === this._idTipoAcao)!; }
    get refCategoriaAcao(): CategoriaAcao { return SingletonHelper.getInstance().categorias_acao.find(categoria_acao => categoria_acao.id === this._idCategoriaAcao)!; }
    get nomeAcao(): string { return `${this.nome}`; }

    adicionaRefPai(pai: Ritual | Item | Habilidade): this { return (this._refPai = pai), this; }

    adicionarCustos(custoParams: [new (...args: any[]) => Custo, any[]][]): this { return (custoParams.forEach(([CustoClass, params]) => { this.custos.push((CustoClass === CustoComponente && this.refPai instanceof Ritual) ? new CustoComponente().setRefAcao(this as AcaoRitual) : new CustoClass(...params)); })), this; }
    adicionarBuffs(buffParams: [new (...args: any[]) => Buff, any[]][]): this { return (adicionarBuffsUtil(this, this.buffs, buffParams), this) };
    adicionarRequisitos(requisitoParams: [new (...args: any[]) => Requisito, any[]][]): this { return (requisitoParams.forEach(([RequisitoClass, params]) => { this.requisitos.push(new RequisitoClass(...params).setRefAcao(this as AcaoRitual)); })), this; }
    adicionarOpcoesExecucao(opcoesParams: { key: string, displayName: string, obterOpcoes: () => Opcao[] }[]): this { return (opcoesParams.forEach(param => { this.opcoesExecucoes.push(new OpcoesExecucao(param.key, param.displayName, param.obterOpcoes)); })), this };

    get refTipoPai(): 'Ritual' | 'Item' | 'Habilidade' | undefined {
        if (this.refPai instanceof Ritual) return "Ritual";
        if (this.refPai instanceof Item) return "Item";
        if (this.refPai instanceof Habilidade) return "Habilidade";

        return undefined;
    }

    get verificaRequisitosCumpridos(): boolean {
        return (
            this.requisitos
                ? this.requisitos?.every(requisito => requisito.requisitoCumprido) ?? false
                : true
        );
    }

    get verificaCustosPodemSerPagos(): boolean {
        return (
            this.custos
                ? this.custos?.every(custo => custo.podeSerPago) ?? false
                : true
        );
    }

    aplicaGastos = (valoresSelecionados: { [key: string]: number | undefined }): boolean => {
        LoggerHelper.getInstance().adicionaMensagem(`Custos aplicados`, true);

        this.custos.forEach(custo => {
            if (custo instanceof CustoComponente) {
                custo.processaGastaCusto(valoresSelecionados['custoComponente']!);
            } else {
                custo.processaGastaCusto();
            }
        });

        LoggerHelper.getInstance().fechaNivelLogMensagem();

        return true;
    }

    ativaBuffs = (): void => {
        this.buffs.map(buff => {
            buff.ativaBuff()
        });
    }

    executaComOpcoes = (valoresSelecionados: { [key: string]: number | undefined }) => {
        LoggerHelper.getInstance().adicionaMensagem(`${this.nomeAcao} [${this.refPai.nomeExibicao}]`);

        logicaMecanicas[this._idMecanica](valoresSelecionados);
        this.aplicaGastos(valoresSelecionados);

        FichaHelper.getInstance().personagem.onUpdate();
        LoggerHelper.getInstance().saveLog();
    }

    get tooltipProps(): TooltipProps {
        return {
            caixaInformacao: {
                cabecalho: [
                    { tipo: 'titulo', conteudo: this.nomeAcao }
                ],
                corpo: [
                    { tipo: 'texto', conteudo: `${this.refTipoPai!} - ${this.refPai.nomeExibicao}` },
                    { tipo: 'texto', conteudo: `${this.refTipoAcao.nome}` },

                    ...(this.custos ? [
                        { tipo: 'separacao' as const, conteudo: 'Custos' },
                        ...(this.custos.map(custo => ({
                            tipo: 'texto' as const,
                            conteudo: custo.descricaoCusto,
                            cor: !custo.podeSerPago ? '#FF0000' : '',
                        })))
                    ] : []),

                    ...(this.requisitos ? [
                        { tipo: 'separacao' as const, conteudo: 'Requisitos' },
                        ...(this.requisitos.map(requisito => ({
                            tipo: 'texto' as const,
                            conteudo: requisito.descricaoRequisito,
                            cor: !requisito.requisitoCumprido ? '#FF0000' : '',
                        })))
                    ] : []),
                ],
            },
            iconeCustomizado: {
                corDeFundo: (this.verificaCustosPodemSerPagos && this.verificaRequisitosCumpridos ? '#FFFFFF' : '#BB0000'),
                svg: this.svg,
            },
            corTooltip: new CorTooltip('#FFFFFF').cores,
            numeroUnidades: 1,
        };
    }

    static get filtroProps(): FiltroProps<Acao> {
        return new FiltroProps<Acao>(
            'Ações',
            [
                new FiltroPropsItems<Acao>(
                    (acao) => acao.nome,
                    'Nome da Ação',
                    'Procure pela Ação',
                    'text',
                    true
                ),
                new FiltroPropsItems<Acao>(
                    (acao) => acao.refTipoPai == 'Ritual' ? acao.refPai.nome : (acao.refPai as Item).nome.customizado,
                    'Fonte da Ação',
                    'Selecione a Fonte da Ação',
                    'select',
                    true,
                    new OpcoesFiltrosCategorizadas(
                        [
                            { categoria: "Rituais", opcoes: new OpcoesFiltro(FichaHelper.getInstance().personagem.rituais.filter(ritual => ritual.acoes.length > 0).map(ritual => ({ id: ritual.nome, nome: ritual.nome }))) },
                            { categoria: "Items", opcoes: new OpcoesFiltro(FichaHelper.getInstance().personagem.inventario.items.filter(item => item.acoes.length > 0).map(item => ({ id: item.nome.customizado, nome: item.nome.customizado }))) }
                        ]
                    )
                ),
                new FiltroPropsItems<Acao>(
                    (acao) => acao.refTipoAcao.id,
                    'Tipo de Ação',
                    'Selecione o Tipo de Ação',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().tipos_acao.map(tipo_acao => ({ id: tipo_acao.id, nome: tipo_acao.nome })))
                ),
            ],
        );
    }
}

export class AcaoRitual extends Acao {
    constructor(nome: string, idTipoAcao: number, idCategoriaAcao: number, idMecanica: number) { super(nome, idTipoAcao, idCategoriaAcao, idMecanica); }

    override get refPai(): Ritual { return this._refPai as Ritual };
}

export class AcaoItem extends Acao {
    constructor(nome: string, idTipoAcao: number, idCategoriaAcao: number, idMecanica: number) { super(nome, idTipoAcao, idCategoriaAcao, idMecanica); }

    override get refPai(): Item { return this._refPai as Item };
}

export class AcaoHabilidade extends Acao {
    constructor(nome: string, idTipoAcao: number, idCategoriaAcao: number, idMecanica: number) { super(nome, idTipoAcao, idCategoriaAcao, idMecanica); }

    override get refPai(): Habilidade { return this._refPai as Habilidade };
}

export class AcaoAtaque extends Acao {
    constructor(nome: string, idTipoAcao: number, idCategoriaAcao: number, idMecanica: number) { super(nome, idTipoAcao, idCategoriaAcao, idMecanica); }

    executaComOpcoes = (valoresSelecionados: { [key: string]: number | undefined }) => {
        LoggerHelper.getInstance().adicionaMensagem(`${this.nomeAcao} [${this.refPai.nomeExibicao}]`);

        this.executa();
        this.aplicaGastos(valoresSelecionados);

        FichaHelper.getInstance().personagem.onUpdate();
        LoggerHelper.getInstance().saveLog();
    }

    executa = () => {
        this.executaAtaque();
    }

    executaAtaque = () => {
        // this.refPai.detalhesArma.refPericiaUtilizadaArma.rodarTeste();
        ExecutaVariacaoGenerica({ listaVarianciasDaAcao: [ { valorMaximo: 6, variancia: 4 }, { valorMaximo: 10, variancia: 2 } ] })
        // ExecutaVariacaoGenerica({ listaVarianciasDaAcao: [ { valorMaximo: this.refPai.detalhesArma.dano, variancia: this.refPai.detalhesArma.variancia } ] })
        // const teste2 = RollNumber(this.refPai.detalhesArma.variancia);
        // LoggerHelper.getInstance().adicionaMensagem(`${this.refPai.detalhesArma.dano - teste2.variancia} de dano`);
        // toast(`${this.refPai.detalhesArma.dano - teste2.variancia} de dano`);
        // LoggerHelper.getInstance().fechaNivelLogMensagem();
    }

    override get refPai(): ItemArma { return this._refPai as ItemArma };
}

export class Ritual {
    private static nextId = 1;
    public id: number;
    public acoes: Acao[] = [];

    constructor(
        public nome: string,
        private _idCirculoNivel: number,
        private _idElemento: number,
        public svg: string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Zz4KICAgIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICAgIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgeD0iMzQxIiB5PSIyOTEiIGlkPSJzdmdfMiIgc3Ryb2tlLXdpZHRoPSIwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPlRlc3RlIDE8L3RleHQ+CiAgICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgeD0iNjMiIHk9IjExMCIgaWQ9InN2Z18zIiBmb250LXNpemU9IjE0MCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5SPC90ZXh0PgogIDwvZz4KPC9zdmc+',
    ) {
        this.id = Ritual.nextId++;
    }

    get nomeExibicao(): string { return this.nome };
    get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!; }
    get refCirculoNivelRitual(): CirculoNivelRitual { return SingletonHelper.getInstance().circulos_niveis_ritual.find(circulo_nivel_ritual => circulo_nivel_ritual.id === this._idCirculoNivel)!; }
    get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this.refCirculoNivelRitual.idCirculo)! }

    adicionarAcoes(acaoParams: [new (...args: any[]) => Acao, any[], (acao: Acao) => void][]): this { return (adicionarAcoesUtil(this, this.acoes, acaoParams), this) }

    get tooltipProps(): TooltipProps {
        return {
            caixaInformacao: {
                cabecalho: [
                    { tipo: 'titulo', conteudo: this.nome }
                ],
                corpo: [
                    { tipo: 'texto', conteudo: `Ritual de ${this.refElemento.nome}` },
                    { tipo: 'texto', conteudo: this.refCirculoNivelRitual.nome },
                    { tipo: 'separacao', conteudo: 'Ações' },
                    ...this.acoes?.map(acao => ({
                        tipo: 'texto' as const,
                        conteudo: acao.nomeAcao,
                    })) || []
                ],
            },
            iconeCustomizado: {
                corDeFundo: this.refElemento.cores.corPrimaria,
                svg: this.svg
            },
            corTooltip: new CorTooltip(this.refElemento.cores.corPrimaria, this.refElemento.cores.corSecundaria, this.refElemento.cores.corTerciaria).cores,
            numeroUnidades: 1,
        }
    }

    static get filtroProps(): FiltroProps<Ritual> {
        return new FiltroProps<Ritual>(
            "Rituais",
            [
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.nome,
                    'Nome do Ritual',
                    'Procure pelo Ritual',
                    'text',
                    true
                ),
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.refElemento.id,
                    'Elemento',
                    'Selecione o Elemento do Ritual',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().elementos.map(elemento => ({ id: elemento.id, nome: elemento.nome }))),
                ),
                new FiltroPropsItems<Ritual>(
                    (ritual) => ritual.refCirculoNivelRitual.id,
                    'Círculo',
                    'Selecione o Círculo do Ritual',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().circulos_niveis_ritual.map(circulo_nivel => ({ id: circulo_nivel.id, nome: circulo_nivel.nome }))),
                ),
            ]
        )
    }
}

interface FilterOption {
    id: number;
    nome: string;
}

interface FilterConfig {
    filterableFields: string[];
    filterOptions: { [key: string]: FilterOption[] };
}

export class Elemento implements MDL_Elemento {
    constructor(
        public id: number,
        public nome: string,
        public cores: PaletaCores,
    ) { }
}

export class Circulo {
    // export class Circulo implements MDL_CirculoRitual {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}

// ================================================= //

export class DanoGeral { // traduz em 1 unico ataque
    public listaDano: InstanciaDano[]; // são as diferentes composições dentro desse unico ataque

    constructor(listaDano: InstanciaDano[]) {
        this.listaDano = listaDano;
    }
}

export class InstanciaDano {
    public valor: number;
    public tipoDano: TipoDano;

    constructor(valor: number, tipoDano: TipoDano) {
        this.valor = valor;
        this.tipoDano = tipoDano;
    }
}



export class ReducaoDanoa {
    public tipo: TipoDano;
    public valor: number;

    constructor(tipo: TipoDano, valor: number) {
        this.tipo = tipo;
        this.valor = valor;
    }
}

// export class TipoDano {
//     public id:number;
//     public nome:string;
//     public danoPertencente?:TipoDano;
//     // estatistica alvo

//     constructor(id:number, nome:string) {
//         this.id = id;
//         this.nome = nome;
//     }
// }

export const listaTiposDano: MDL_TipoDano[] = [];

export class SimboloEfeito {
    pathData: string;

    constructor(pathData: string) {
        this.pathData = pathData;
    }

    setPathData(path: string) {
        this.pathData = path;
    }

    getPathData() {
        return this.pathData;
    }

    toSvg(): string {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                <rect width="100" height="100" />
                <path d="${this.pathData}" stroke="white" stroke-width="5" stroke-linecap="round" fill="none" />
            </svg>
        `.replace(/\s+/g, ' ').trim(); // Minify the SVG string

        // Properly encode the SVG
        const encodedSvg = encodeURIComponent(svg)
            .replace(/'/g, '%27')
            .replace(/"/g, '%22');

        return `data:image/svg+xml,${encodedSvg}`;
    }
}

export class BonusConectado {
    public id: number;
    public valor: number;
    public descricao: string;
    public valorBuffavel: string;
    public checked: boolean;
    public componente: React.FC<{ onChange: (checked: boolean) => void; checked: boolean }>;
    public simboloEfeito: SimboloEfeito;

    constructor(id: number, descricao: string, valorBuffavel: string, valor: number) {
        this.id = id;
        this.valor = valor;
        this.descricao = descricao;
        this.valorBuffavel = valorBuffavel;
        this.checked = false;
        this.componente = ({ onChange, checked }) => (
            <CheckboxComponent valor={this.valor} descricao={this.descricao} valorBuffavel={this.valorBuffavel} onChange={onChange} checked={checked} />
        )

        this.simboloEfeito = new SimboloEfeito("M37.8125,49 M37.8125,49 M37.8125,48 M37.8125,47 M36.8125,47 M36.8125,46 M36.8125,45 M36.8125,44 M35.8125,43 M35.8125,42 M35.8125,41 M35.8125,40 M35.8125,39 M35.8125,38 M35.8125,37 M35.8125,36 M35.8125,35 M35.8125,34 M35.8125,33 M35.8125,32 M35.8125,31 M35.8125,30 M35.8125,29 M35.8125,28 M35.8125,27 M35.8125,26 M35.8125,25 M35.8125,24 M35.8125,23 M36.8125,23 M37.8125,23 M38.8125,23 M39.8125,24 M39.8125,25 M40.8125,25 M41.8125,25 M41.8125,26 M42.8125,26 M43.8125,27 M44.8125,27 M45.8125,27 M45.8125,28 M46.8125,28 M46.8125,29 M47.8125,29 M48.8125,29 M49.8125,29 M49.8125,30 M50.8125,30 M51.8125,30 M51.8125,31 M52.8125,31 M53.8125,31 M54.8125,31 M54.8125,32 M55.8125,32 M55.8125,33 M56.8125,33 M57.8125,33 M57.8125,34 M58.8125,34 M59.8125,34 M59.8125,35 M59.8125,36 M60.8125,36 M60.8125,37 M61.8125,37 M62.8125,37 M62.8125,38 M63.8125,38 M63.8125,39 M63.8125,40 M63.8125,41 M63.8125,42 M63.8125,43 M63.8125,44 M63.8125,45 M63.8125,46 M63.8125,47 M63.8125,48 M63.8125,49 M63.8125,50 M63.8125,51 M62.8125,51 M62.8125,52 M61.8125,52 M61.8125,53 M61.8125,54 M60.8125,54 M60.8125,55 M60.8125,56 M59.8125,56 M59.8125,57 M59.8125,58 M58.8125,58 M58.8125,59 M58.8125,60 M57.8125,60 M57.8125,61 M57.8125,62 M57.8125,63 M56.8125,63 M56.8125,64 M56.8125,65 M56.8125,66 M55.8125,66 M55.8125,67 M54.8125,67 M54.8125,68 M53.8125,68 M53.8125,69 M53.8125,70 M52.8125,70 M51.8125,70 M50.8125,70 M50.8125,71 M49.8125,71 M48.8125,71 M47.8125,71 M46.8125,71 M45.8125,71 M44.8125,71 M43.8125,71 M42.8125,71 M41.8125,71 M40.8125,71 M39.8125,71 M38.8125,71 M37.8125,71 M36.8125,71 M35.8125,71 M34.8125,71 M33.8125,71 M32.8125,71 M31.8125,71 M30.8125,71 M29.8125,71 M28.8125,71 M27.8125,71 M27.8125,70 M26.8125,70 M25.8125,70 M24.8125,70 M23.8125,70 M22.8125,70 M22.8125,69 M21.8125,69 M20.8125,69 M20.8125,68 M20.8125,67 M20.8125,66 M20.8125,65 M20.8125,64 M20.8125,63 M20.8125,62 M20.8125,61 M20.8125,60");
    }

    handleCheckboxChange = (checked: boolean) => {
        this.checked = checked;
    }
}

export const listaBonus: BonusConectado[] = [];

export class CharacterDetalhes {
    public nome: string;
    public classe: string;
    public nex: number;

    constructor(nome: string, classe: string, nex: number) {
        this.nome = nome;
        this.classe = classe;
        this.nex = nex;
    }
}

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

export class NivelRitual {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class CirculoRitual {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class CirculoNivelRitual {
    constructor(
        public id: number,
        public idCirculo: number,
        public idNivel: number,
    ) { }

    get nome(): string {
        return `${SingletonHelper.getInstance().circulos_ritual.find(circulo_ritual => circulo_ritual.id === this.idCirculo)!.nome}º Círculo ${SingletonHelper.getInstance().niveis_ritual.find(nivel_ritual => nivel_ritual.id === this.idNivel)!.nome}`;
    }
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
export class Alcance {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class FormatoAlcance {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class Duracao {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class TipoExecucao {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class Execucao {
    public numeroAcoesAtuais: number = 0;

    constructor(
        private _idTipoExecucao: number,
        public numeroAcoesMaximas: number
    ) {
        this.recarregaNumeroAcoes();
    }

    get refTipoExecucao(): TipoExecucao { return SingletonHelper.getInstance().tipos_execucao.find(tipo_execucao => tipo_execucao.id === this._idTipoExecucao)!; }
    recarregaNumeroAcoes(): void { this.numeroAcoesAtuais = this.numeroAcoesMaximas; }
}
export class TipoAcao {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class TipoAlvo {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class TipoCusto {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class TipoDano {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class TipoBuff {
    constructor(
        public id: number,
        public nome: string,
        public nomeExibirTooltip: string,
    ) { }
}
export class CategoriaAcao {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}
export class TipoEstatisticaDanificavel {
    constructor(
        public id: number,
        public nome: string,
        public nomeAbrev: string,
        public cor: string,
    ) { }
}
export class TipoEstatisticaBuffavel {
    constructor(
        public id: number,
        public nome: string
    ) { }
}

export class Inventario {
    public items: Item[] = [];

    constructor() { }

    get agrupamento(): Item[] {
        return [
            ...(this.items.filter(item => item.idTipoItem === ItemArma.idTipoStatic)),
            ...(this.items.filter(item => item.idTipoItem === ItemEquipamento.idTipoStatic)),
            ...(this.items.filter(item => item.idTipoItem === ItemConsumivel.idTipoStatic).reduce((itemUnico, itemAtual) => {
                if (!itemAtual.agrupavel || !itemUnico.some(item => item.agrupavel && item.nome.customizado === itemAtual.nome.customizado)) {
                    itemUnico.push(itemAtual);
                }
                return itemUnico;
            }, [] as typeof this.items)),
            ...(this.items.filter(item => item.idTipoItem === ItemComponente.idTipoStatic).reduce((itemUnico, itemAtual) => {
                if (!itemAtual.agrupavel || !itemUnico.some(item => item.agrupavel && item.nome.customizado === itemAtual.nome.customizado)) {
                    itemUnico.push(itemAtual);
                }
                return itemUnico;
            }, [] as typeof this.items))
        ]
    }

    get espacosUsados(): number {
        return this.items.reduce((acc, cur) => { return acc + cur.peso }, 0)
    }

    public adicionarItemNoInventario = (item: Item): void => {
        this.items.push(item);
    }

    public acoesInventario = (): Acao[] => {
        return this.items.reduce((acc: Acao[], item) => acc.concat(item.acoes), []);
    }

    public buffsInventario = (): Buff[] => {
        return this.items.reduce((acc: Buff[], item) => acc.concat(item.buffs), []);
    }

    public verificaCarregandoComponente(idElemento: number, idNivelComponente: number): boolean {
        return this.items.some(item => item instanceof ItemComponente && item.detalhesComponente.refElemento.id === idElemento && item.detalhesComponente.refNivelComponente.id === idNivelComponente);
    }

    public removerItem(idItem: number): void {
        this.items = this.items.filter(item => item.id !== idItem);
    }
}

export class TipoItem {
    constructor(
        public id: number,
        public nome: string
    ) { }
}

export class NomeItem {
    public customizado: string;
    public temNomeCustomizado: boolean = false;

    constructor(
        public padrao: string,
        customizado?: string,
    ) {
        if (customizado) {
            this.customizado = customizado;
            this.temNomeCustomizado = true;
        } else {
            this.customizado = padrao;
        }
    }
}

export class Item {
    private static nextId = 1;
    public id: number;

    public acoes: Acao[] = [];
    protected _buffs: Buff[] = [];
    public precisaEstarEmpunhado: boolean = false;

    protected idExtremidade?: number;
    public refExtremidade?: Extremidade;

    protected _agrupavel: boolean = false;

    public svg = `PHN2ZyB3aWR0aD0iMjU2cHgiIGhlaWdodD0iMjU2cHgiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNDQ0LjE4IDQ0NC4xOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICA8cGF0aCBkPSJtNDA0LjIgMjA1Ljc0Yy0wLjkxNy0wLjY1Ni0yLjA5Ni0wLjgzLTMuMTY1LTAuNDY3IDAgMC0xMTkuMDEgNDAuNDc3LTEyMi4yNiA0MS41OTgtMi43MjUgMC45MzgtNC40ODctMS40Mi00LjQ4Ny0xLjQybC0zNy40NDgtNDYuMjU0Yy0wLjkzNS0xLjE1NC0yLjQ5Mi0xLjU5Mi0zLjg5LTEuMDk4LTEuMzk2IDAuNDk0LTIuMzMyIDEuODE2LTIuMzMyIDMuMjk5djE2Ny44OWMwIDEuMTY4IDAuNTgzIDIuMjYgMS41NTYgMi45MSAwLjU4NCAwLjM5MSAxLjI2MyAwLjU5IDEuOTQ1IDAuNTkgMC40NTEgMCAwLjkwNi0wLjA4OCAxLjMzNi0wLjI2N2wxNjguMDQtNjkuNDM4YzEuMzEtMC41NDEgMi4xNjMtMS44MTggMi4xNjMtMy4yMzR2LTkxLjI2NmMwLTEuMTI2LTAuNTQ0LTIuMTg1LTEuNDYyLTIuODQ0eiIvPiA8cGF0aCBkPSJtNDQzLjQ5IDE2OC4yMi0zMi4wNy00Mi44NTljLTAuNDYtMC42MTUtMS4xMTEtMS4wNjEtMS44NTItMS4yNzBsLTE4Ni40Mi01Mi42MzZjLTAuNjIyLTAuMTc2LTEuNDY1LTAuMTI1LTIuMDk2IDAuMDQ5bC0xODYuNDIgNTIuNjM2Yy0wLjczOSAwLjIwOS0xLjM5MSAwLjY1NC0xLjg1MSAxLjI3bC0zMi4wNzEgNDIuODYwYy0wLjY3MiAwLjg5OC0wLjg3MiAyLjA2My0wLjU0MSAzLjEzMyAwLjMzMiAxLjA3MSAxLjE1NyAxLjkxOCAyLjIxOSAyLjI3OWwxNTcuNjQgNTMuNTAyYzAuMzcgMC4xMjUgMC43NDkgMC4xODcgMS4xMjUgMC4xODcgMS4wMzUgMCAyLjA0MS0wLjQ2MiAyLjcxOC0xLjI5Nmw0NC4xMjgtNTQuMzkxIDEzLjA4MiAzLjZjMC42MDcgMC4xNjggMS4yNDkgMC4xNjggMS44NTcgMCAwIDAgMC4wNjQtMC4wMTYgMC4xOTItMC4wNDFsMTMuMDgyLTMuNiA0NC4xMjkgNTQuMzkxYzAuNjc3IDAuODM0IDEuNjgzIDEuMjk1IDIuNzE4IDEuMjk1IDAuMzc2IDAgMC43NTYtMC4wNjEgMS4xMjUtMC4xODZsMTU3LjY0LTUzLjUwMmMxLjA2Mi0wLjM2MSAxLjg4Ny0xLjIwOSAyLjIxOS0yLjI3OSAwLjMzLTEuMDcyIDAuMTMtMi4yMzYtMC41NDItMy4xMzQtMC41NDItMC42NTgtMS40NjItMS4yMTgtMi44NDQtMS40NDF6bS0yMjEuMy03Ljg0LTEzMy42OS0zNi41MjUgMTMzLjY5LTM3LjUyNyAxMzMuNDkgMzcuNDc5LTEzMy40OSAzNi41NzN6Ii8+IDxwYXRoIGQ9Im0yMTEuMjQgMTk4LjE1Yy0xLjM5Ni0wLjQ5NC0yLjk1NS0wLjA1Ny0zLjg4OSAxLjA5OGwtMzcuNDQ4IDQ2LjI1NXMtMS43NjQgMi4zNTYtNC40ODggMS40MmMtMy4yNTItMS4xMjEtMTIyLjI2LTQxLjU5OC0xMjIuMjYtNDEuNTk4LTEuMDctMC4zNjMtMi4yNDgtMC4xODktMy4xNjUgMC40NjctMC45MTggMC42NTgtMS40NjIgMS43MTctMS40NjIgMi44NDZ2OTEuMjY3YzAgMS40MTYgMC44NTQgMi42OTIgMi4xNjMgMy4yMzNsMTY4LjA0IDY5LjQzOGMwLjQzIDAuMTc4IDAuODg1IDAuMjY2IDEuMzM2IDAuMjY2IDAuNjg0IDAgMS4zNjItMC4xOTkgMS45NDYtMC41OSAwLjk3Mi0wLjY1IDEuNTU1LTEuNzQyIDEuNTU1LTIuOTF2LTE2Ny44OWMwLTEuNDgyLTAuOTM1LTIuODA0LTIuMzMyLTMuMjk4eiIvPiAgPC9zdmc+`;

    constructor(
        public idTipoItem: number,
        public nome: NomeItem,
        public peso: number,
        public categoria: number,
        agrupavel: boolean = false,
    ) {
        this.id = Item.nextId++;
        this._agrupavel = agrupavel;

        if (!this.precisaEstarEmpunhado) {
            this.buffs.map(buff => {
                buff.ativaBuff();
            });
        }
    }

    get agrupavel(): boolean {
        return this._agrupavel;
    }

    get buffs(): Buff[] {
        return this._buffs.filter(buff => buff.ativo);
    }

    get nomeExibicao(): string { return this.nome.customizado };
    get nomeExibicaoOption(): string { return this.nome.customizado };
    get estaEmpunhado(): boolean { return !!this.idExtremidade; }

    adicionarBuffs(buffParams: [new (...args: any[]) => Buff, any[]][]): this { return (adicionarBuffsUtil(this, this._buffs, buffParams), this) };
    adicionarAcoes(acaoParams: [new (...args: any[]) => Acao, any[], (acao: Acao) => void][]): this { return (adicionarAcoesUtil(this, this.acoes, acaoParams), this) }


    ativarBuffs = (): void => {
        if (!this.precisaEstarEmpunhado) {
            this.buffs.map(buff => {
                buff.ativaBuff();
            });
        }
    }

    sacar = (idExtremidade: number): void => {
        LoggerHelper.getInstance().adicionaMensagem(`${this.nome.customizado} Empunhado`);

        this.idExtremidade = idExtremidade;
        this.refExtremidade = FichaHelper.getInstance().personagem.estatisticasBuffaveis.extremidades.find(extremidade => extremidade.id === idExtremidade);

        if (this.precisaEstarEmpunhado) {
            this.buffs.map(buff => {
                buff.ativaBuff();
            });
        }
    }

    guardar = (): void => {
        LoggerHelper.getInstance().adicionaMensagem(`${this.nome.customizado} Guardado`);

        this.idExtremidade = undefined;
        this.refExtremidade = undefined;

        if (this.precisaEstarEmpunhado) {
            this.buffs.map(buff => {
                buff.desativaBuff();
            })
        }
    }

    removeDoInventario(): void {
        FichaHelper.getInstance().personagem.inventario.removerItem(this.id);
        this.refExtremidade?.limpa();
    }

    get tooltipPropsGenerico(): TooltipProps {
        return {
            caixaInformacao: {
                cabecalho: [
                    { tipo: 'titulo', conteudo: this.nome.customizado },
                    { tipo: 'subtitulo', conteudo: this.nome.temNomeCustomizado ? this.nome.padrao : '' },
                ],
                corpo: [
                    { tipo: 'texto', conteudo: `Categoria ${this.categoria} | ${this.peso} ${pluralize(this.peso, 'Espaço')}` },
                ],
            },
            iconeCustomizado: {
                corDeFundo: (this.idExtremidade ? '#00000000' : '#DDDDDD'),
                svg: this.svg,
            },
            corTooltip: new CorTooltip('#FFFFFF').cores,
            numeroUnidades: 1,
        }
    }

    get tooltipPropsSingular(): TooltipProps {
        return this.tooltipPropsGenerico;
    }

    get tooltipPropsAgrupado(): TooltipProps {
        return this.tooltipPropsGenerico;
    }

    static get filtroProps(): FiltroProps<Item> {
        return new FiltroProps<Item>(
            "Items",
            [
                new FiltroPropsItems<Item>(
                    (item) => item.nome.padrao || item.nome.customizado,
                    'Nome do Item',
                    'Procure pelo Item',
                    'text',
                    true
                ),
                new FiltroPropsItems<Item>(
                    (item) => item.categoria,
                    'Categoria do Item',
                    'Selecione a Categoria',
                    'select',
                    true,
                    new OpcoesFiltro(
                        [0, 1, 2, 3, 4].map(categoria => {
                            return {
                                id: categoria,
                                nome: `Categoria ${categoria}`,
                            } as OpcaoFiltro;
                        })
                    ),
                ),
                new FiltroPropsItems<Item>(
                    (item) => item.idTipoItem,
                    'Tipo do Item',
                    'Selecione o Tipo',
                    'select',
                    true,
                    new OpcoesFiltro(
                        SingletonHelper.getInstance().tipos_items.map(tipo_item => {
                            return {
                                id: tipo_item.id,
                                nome: tipo_item.nome,
                            } as OpcaoFiltro;
                        })
                    ),
                )
            ]
        )
    }
}

export class ItemArma extends Item {
    static idTipoStatic = 1;
    private _idTipoItem: number;

    constructor(
        public nome: NomeItem,
        public peso: number,
        public categoria: number,
        precisaEstarEmpunhado: boolean,
        public detalhesArma: DetalhesItemArma,
    ) {
        super(ItemArma.idTipoStatic, nome, peso, categoria);
        this._idTipoItem = ItemArma.idTipoStatic;
        this.precisaEstarEmpunhado = precisaEstarEmpunhado;
    }

    get tooltipPropsSingular(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        return {
            caixaInformacao: {
                cabecalho: tooltipPropsSuper.caixaInformacao.cabecalho,
                corpo: [
                    { tipo: 'texto', conteudo: `Dano: ${this.detalhesArma.danoMinimo} - ${this.detalhesArma.dano}` },
                    { tipo: 'texto', conteudo: `Empunhado com ${this.detalhesArma.numeroExtremidadesUtilizadas} ${pluralize(this.detalhesArma.numeroExtremidadesUtilizadas, 'Extremidade')}` },
                    ...tooltipPropsSuper.caixaInformacao.corpo,
                    { tipo: 'separacao' },
                    ...this.acoes?.map(acao => ({
                        tipo: 'texto' as const,
                        conteudo: acao.nomeAcao,
                    })) || []
                ],
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: 1,
        }
    }

    get tooltipPropsAgrupado(): TooltipProps {
        return this.tooltipPropsSingular;
    }
}

export class DetalhesItemArma {
    constructor(
        public dano: number,
        public variancia: number,
        public numeroExtremidadesUtilizadas: number,
        private _idPericiaUtilizada: number
    ) { }

    get danoMinimo(): number {
        return this.dano - this.variancia;
    }

    get refPericiaUtilizadaArma(): PericiaPatentePersonagem {
        return FichaHelper.getInstance().personagem.pericias.find(pericia => pericia.refPericia.id === this._idPericiaUtilizada)!;
    }
}

export class ItemEquipamento extends Item {
    static idTipoStatic = 2;
    private _idTipoItem: number;

    constructor(
        public nome: NomeItem,
        public peso: number,
        public categoria: number,
        precisaEstarEmpunhado: boolean,
        public detalhesEquipamento: DetalhesItemEquipamento,
    ) {
        super(ItemEquipamento.idTipoStatic, nome, peso, categoria);
        this._idTipoItem = ItemEquipamento.idTipoStatic;
        this.precisaEstarEmpunhado = precisaEstarEmpunhado;
    }

    get buffs(): Buff[] {
        return this._buffs;
    }

    get tooltipPropsSingular(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        return {
            caixaInformacao: {
                cabecalho: tooltipPropsSuper.caixaInformacao.cabecalho,
                corpo: [
                    ...this.buffs?.map(buff => ({
                        tipo: 'texto' as const,
                        conteudo: `+${buff.valor} ${buff.refBuff.nome}${this.precisaEstarEmpunhado ? ` enquanto Empunhado` : ''}`,
                    })) || [],
                    ...tooltipPropsSuper.caixaInformacao.corpo,
                ],
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: 1,
        }
    }

    get tooltipPropsAgrupado(): TooltipProps {
        return this.tooltipPropsSingular;
    }
}

export class DetalhesItemEquipamento {
    constructor(

    ) { }
}

export class ItemConsumivel extends Item {
    static idTipoStatic = 3;
    private _idTipoItem: number;

    constructor(
        public nome: NomeItem,
        public peso: number,
        public categoria: number,
        precisaEstarEmpunhado: boolean,
        public detalhesConsumivel: DetalhesItemConsumivel,
    ) {
        super(ItemConsumivel.idTipoStatic, nome, peso, categoria, true);
        this._idTipoItem = ItemConsumivel.idTipoStatic;
        this.precisaEstarEmpunhado = precisaEstarEmpunhado;
    }

    get tooltipPropsSingular(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        return {
            caixaInformacao: {
                cabecalho: tooltipPropsSuper.caixaInformacao.cabecalho,
                corpo: [],
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: 1,
        }
    }

    get tooltipPropsAgrupado(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        return {
            caixaInformacao: {
                cabecalho: tooltipPropsSuper.caixaInformacao.cabecalho,
                corpo: [],
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: 1,
        }
    }
}

export class DetalhesItemConsumivel {
    constructor(

    ) { }
}

export class ItemComponente extends Item {
    static idTipoStatic = 4;
    private _idTipoItem: number;

    constructor(
        public nome: NomeItem,
        public peso: number,
        public categoria: number,
        public detalhesComponente: DetalhesItemComponente,
    ) {
        super(ItemComponente.idTipoStatic, nome, peso, categoria, true);
        this._idTipoItem = ItemComponente.idTipoStatic;
    }

    get nomeExibicaoOption(): string { return `${this.nome.customizado} (${this.detalhesComponente.usosAtuais})` };
    get agrupavel(): boolean {
        return (!this.estaEmpunhado && this._agrupavel);
    }

    get tooltipPropsSingular(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        const items: ItemComponente[] = [this];

        const caixaInformacaoProps = ItemComponente.obtemCaixaInformacaoProps(items);

        return {
            caixaInformacao: {
                cabecalho: [
                    ...tooltipPropsSuper.caixaInformacao.cabecalho,
                    ...caixaInformacaoProps.cabecalho,
                ],
                corpo: [
                    ...caixaInformacaoProps.corpo,
                ]
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: items.length
        }
    }

    get tooltipPropsAgrupado(): TooltipProps {
        const tooltipPropsSuper = super.tooltipPropsGenerico;

        let items: ItemComponente[] = [this];
        if (this.agrupavel) {
            items = FichaHelper.getInstance().personagem.inventario.items.filter(item => item instanceof ItemComponente && item.agrupavel && item.nome.padrao === this.nome.padrao && item.categoria === this.categoria && item.detalhesComponente.refElemento === this.detalhesComponente.refElemento && item.detalhesComponente.refNivelComponente) as ItemComponente[]
        }

        const caixaInformacaoProps = ItemComponente.obtemCaixaInformacaoProps(items);

        return {
            caixaInformacao: {
                cabecalho: [
                    ...tooltipPropsSuper.caixaInformacao.cabecalho,
                    ...caixaInformacaoProps.cabecalho,
                ],
                corpo: [
                    ...caixaInformacaoProps.corpo,
                ]
            },
            iconeCustomizado: tooltipPropsSuper.iconeCustomizado,
            corTooltip: tooltipPropsSuper.corTooltip,
            numeroUnidades: items.length
        }
    }

    static obtemCaixaInformacaoProps(items: ItemComponente[]): CaixaInformacaoProps {
        const { pesoTotal, usosTotais } = items.reduce((acc, cur) => {
            return {
                pesoTotal: acc.pesoTotal + cur.peso,
                usosTotais: acc.usosTotais + cur.detalhesComponente.usosAtuais
            };
        }, { pesoTotal: 0, usosTotais: 0 });

        return {
            cabecalho: [
                { tipo: 'subtitulo', conteudo: `${items.length} ${pluralize(items.length, 'Unidade')}` },
            ],
            corpo: [
                { tipo: 'texto', conteudo: `${usosTotais} ${pluralize(usosTotais, 'Uso')}` },
                { tipo: 'texto', conteudo: `Categoria ${items[0].categoria} | ${pesoTotal} ${pluralize(pesoTotal, 'Espaço')}` },
            ],
        }
    }

    gastaUso(): void {
        this.detalhesComponente.usosAtuais--;

        if (this.detalhesComponente.usosAtuais <= 0) {
            LoggerHelper.getInstance().adicionaMensagem(`Componente Finalizado`);
            this.removeDoInventario();
        }
    }

    verificaIgual(item: ItemComponente): boolean {
        return (
            this.detalhesComponente.refElemento.id === item.detalhesComponente.refElemento.id && this.detalhesComponente.refNivelComponente.id == item.detalhesComponente.refNivelComponente.id
        );
    }
}

export class DetalhesItemComponente {
    public usosAtuais: number;

    constructor(
        private _idElemento: number,
        private _idNivelComponente: number,
        public usosMaximos: number,
        public usos?: number,
    ) {
        this.usosAtuais = (usos ? usos : usosMaximos);
    }

    get refElemento(): Elemento {
        return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!;
    }

    get refNivelComponente(): NivelComponente {
        return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this._idNivelComponente)!;
    }
}

export class NivelComponente {
    constructor(
        public id: number,
        public nome: string
    ) { }
}

export class Extremidade {
    private static nextId = 1;
    public id: number;
    public idItemEmpunhado?: number;
    public bloqueado: boolean = false;
    public refItem?: Item;

    constructor() {
        this.id = Extremidade.nextId++;
    }

    empunhar = (idItem: number): void => {
        LoggerHelper.getInstance().adicionaMensagem(`Empunhando na Extremidade ${this.id}`);

        this.idItemEmpunhado = idItem;
        this.refItem = FichaHelper.getInstance().personagem.inventario.items.find(item => item.id === idItem)!;
        this.refItem.sacar(this.id);
        FichaHelper.getInstance().personagem.onUpdate();
    }

    guardar = (): void => {
        LoggerHelper.getInstance().adicionaMensagem(`Extremidade ${this.id} livre`);

        this.refItem?.guardar();
        this.limpa();
    }

    limpa = (): void => {
        this.idItemEmpunhado = undefined;
        this.refItem = undefined;
        FichaHelper.getInstance().personagem.onUpdate();
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

class BuffsPorId {
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

class BuffsPorTipo {
    constructor(
        public idTipoBuff: number,
        public aplicado: Buff,
        public sobreescritos: Buff[],
    ) { }
}

export abstract class Requisito {
    constructor() { }
    abstract get requisitoCumprido(): boolean;
    abstract get descricaoRequisito(): string;

    public refAcao?: AcaoRitual;
    setRefAcao(value: AcaoRitual): this { return (this.refAcao = value, this); }
}

export class RequisitoComponente extends Requisito {
    constructor(public precisaEstarEmpunhando: boolean) { super(); }

    get requisitoCumprido(): boolean {
        return (
            FichaHelper.getInstance().personagem.inventario.items.some(item =>
                item instanceof ItemComponente && item.detalhesComponente.refElemento.id === this.refAcao!.refPai.refElemento.id && item.detalhesComponente.refNivelComponente.id === this.refAcao!.refPai.refNivelComponente.id
                && (this.precisaEstarEmpunhando && item.refExtremidade)
            )
        );
    }

    get descricaoRequisito(): string {
        return !this.precisaEstarEmpunhando
            ? 'Necessário ter o Componente'
            : 'Necessário empunhar o Componente';
    }
}

export class RequisitoItemEmpunhado extends Requisito {
    constructor() { super(); }
    get requisitoCumprido(): boolean { return (this.refAcao!.refPai instanceof Item && this.refAcao!.refPai.estaEmpunhado); }
    get descricaoRequisito(): string { return 'Necessário empunhar o Item da Ação'; }
}

// export class RequisitoItemGuardado extends Requisito {

// }

export class RequisitoExtremidadeDisponivel extends Requisito {
    constructor() { super(); }

    get requisitoCumprido(): boolean { return FichaHelper.getInstance().personagem.estatisticasBuffaveis.extremidades.some(extremidade => !extremidade.refItem); }

    get descricaoRequisito(): string { return 'Nessário Extremidade Disponível'; }
}

export class RequisitoAlgumItemGuardado extends Requisito {
    constructor() { super(); }
    get requisitoCumprido(): boolean { return FichaHelper.getInstance().personagem.inventario.items.some(item => !item.refExtremidade); }
    get descricaoRequisito(): string { return 'Necessário ter Item no Inventário'; }
}

export class RequisitoAlgumItemEmpunhado extends Requisito {
    constructor() { super(); }
    get requisitoCumprido(): boolean { return FichaHelper.getInstance().personagem.inventario.items.some(item => item.refExtremidade); }
    get descricaoRequisito(): string { return 'Necessário Empunhar algum Item'; }
}

export class TipoRequisito {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}

export class FiltroProps<T> {
    constructor(
        public titulo: string,
        public items: FiltroPropsItems<T>[]
    ) { }
}

type OpcaoFiltro = { id: number | string; nome: string; };
export type OpcaoFormatada = { value: string; label: string; };

type CategoriaFiltro = { categoria: string; opcoes: OpcoesFiltro; }[];
export type CategoriaFormatada = { label: string; options: OpcaoFormatada[]; };

class OpcoesFiltro {
    constructor(
        private _opcoes: OpcaoFiltro[]
    ) { }

    get opcoes(): OpcaoFormatada[] {
        return this._opcoes.reduce((acc, opcao) => {
            acc.push({ value: opcao.id.toString(), label: opcao.nome })

            return acc;
        }, [] as OpcaoFormatada[]);
    }
}

export class OpcoesFiltrosCategorizadas {
    constructor(
        private _categorias: CategoriaFiltro
    ) { }

    get categorias(): CategoriaFormatada[] {
        return this._categorias.reduce((acc, categoria) => {
            acc.push({ label: categoria.categoria, options: categoria.opcoes.opcoes });

            return acc;
        }, [] as CategoriaFormatada[]);
    }
}

export class FiltroPropsItems<T> {
    constructor(
        public key: keyof T | ((item: T) => any),
        public label: string,
        public placeholder: string,
        public filterType: 'text' | 'select' | 'number',
        public sortEnabled: boolean,
        private _options?: OpcoesFiltro | OpcoesFiltrosCategorizadas,
    ) { }

    temOpcoes(): boolean {
        return this._options !== undefined;
    }

    temCategorias(): boolean {
        return this._options instanceof OpcoesFiltrosCategorizadas;
    }

    get options(): OpcaoFormatada[] | CategoriaFormatada[] | undefined {
        if (this._options instanceof OpcoesFiltro) {
            return this._options.opcoes;
        }
        if (this._options instanceof OpcoesFiltrosCategorizadas) {
            return this._options.categorias;
        }
    }
}

export interface CaixaInformacaoProps {
    cabecalho: TipoInformacaoCabecalhoCaixa[],
    corpo: TipoInformacaoCorpoCaixa[],
}

export interface TipoInformacaoCabecalhoCaixa {
    tipo: 'titulo' | 'subtitulo',
    conteudo?: string,
}

export interface TipoInformacaoCorpoCaixa {
    tipo: 'texto' | 'separacao' | 'icone',
    conteudo?: string,
    cor?: string,
}

export interface IconeCustomizadoProps {
    corDeFundo: string,
    svg: string
}

export class CorTooltip {
    constructor(
        private _corPrimaria: string,
        private _corSecundaria?: string,
        private _corTerciaria?: string,
    ) { }

    get cores(): PaletaCores {
        return {
            corPrimaria: this._corPrimaria,
            corSecundaria: this._corSecundaria ? this._corSecundaria : this._corPrimaria,
            corTerciaria: this._corTerciaria ? this._corTerciaria : this._corPrimaria,
        }
    }
}

export interface TooltipProps {
    caixaInformacao: CaixaInformacaoProps,
    iconeCustomizado: IconeCustomizadoProps,
    corTooltip: PaletaCores,
    numeroUnidades: number,
}

export interface PaletaCores {
    corPrimaria: string,
    corSecundaria?: string,
    corTerciaria?: string
}

// reduzDano = (danoGeral:DanoGeral) => {
//     let dano:number = 0;
//     // danoGeral.listaDano.forEach(instanciaDano => {
//     //     const rd = this.rds.find(rd => rd.tipo.id === instanciaDano.tipoDano.id);
//     //     console.log(`Recebi ${instanciaDano.valor} de Dano ${instanciaDano.tipoDano.nome}, tendo ${rd!.valor} de RD`);
//     //     dano += instanciaDano.valor - rd!.valor;
//     // });

//     let somaDanoNivel1 = 0;
//     listaTiposDano.filter(tipoDano => !tipoDano.idTipoDanoPertencente).map(tipoDanoNivel1 => {
//         let somaDanoNivel2 = 0;
//         listaTiposDano.filter(tipoDano => tipoDano.idTipoDanoPertencente === tipoDanoNivel1.id).map(tipoDanoNivel2 => {
//             let somaDanoNivel3 = 0;
//             listaTiposDano.filter(tipoDano => tipoDano.idTipoDanoPertencente === tipoDanoNivel2.id).map(tipoDanoNivel3 => {
//                 const danoDoTipo = danoGeral.listaDano.find(tipoDano => tipoDano.tipoDano.id === tipoDanoNivel3.id);
//                 if (danoDoTipo) somaDanoNivel3 += Math.max(danoDoTipo.valor - this.rds.find(reducaoDano => reducaoDano.tipoDano.id === tipoDanoNivel3.id)!.valor, 0);
//             });
//             const danoDoTipo = danoGeral.listaDano.find(tipoDano => tipoDano.tipoDano.id === tipoDanoNivel2.id);
//             somaDanoNivel2 += Math.max((somaDanoNivel3 + (danoDoTipo ? danoDoTipo.valor : 0)) - this.rds.find(reducaoDano => reducaoDano.tipoDano.id === tipoDanoNivel2.id)!.valor, 0);
//         });
//         const danoDoTipo = danoGeral.listaDano.find(tipoDano => tipoDano.tipoDano.id === tipoDanoNivel1.id);
//         somaDanoNivel1 += Math.max((somaDanoNivel2 + (danoDoTipo ? danoDoTipo.valor : 0)) - this.rds.find(reducaoDano => reducaoDano.tipoDano.id === tipoDanoNivel1.id)!.valor, 0);
//     });

//     this.estatisticasDanificaveis.pv.aplicarDanoFinal(somaDanoNivel1);
// }

export class Habilidade {
    public acoes: Acao[] = [];

    constructor(
        public id: number,
        public nome: string,
        public requisitoFicha: RequisitoFicha,
    ) { }

    adicionarAcoes(acaoParams: [new (...args: any[]) => Acao, any[], (acao: Acao) => void][]): this { return (adicionarAcoesUtil(this, this.acoes, acaoParams), this) }

    get nomeExibicao(): string { return this.nome };
}

export class RequisitoFicha {
    constructor(
        private condicao: (personagem: Personagem) => boolean
    ) { }

    verificaRequisitoCumprido(personagem: Personagem): boolean {
        return this.condicao(personagem)
    }
}

export const lista_geral_habilidades = (): Habilidade[] => {
    const retorno: Habilidade[] = [];

    const habilidade1 = new Habilidade(1, 'Sacar Item', new RequisitoFicha((personagem: Personagem) => personagem.estatisticasBuffaveis.extremidades.length > 0))
        .adicionarAcoes([
            [
                ...classeComArgumentos(AcaoHabilidade, 'Sacar Item', 1, 1, 1),
                (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 3, 1)
                    ]);
                    acao.adicionarRequisitos([
                        classeComArgumentos(RequisitoExtremidadeDisponivel), classeComArgumentos(RequisitoAlgumItemGuardado)
                    ]);
                    acao.adicionarOpcoesExecucao([
                        {
                            key: 'idItem',
                            displayName: 'Item Alvo',
                            obterOpcoes: (): Opcao[] => {
                                return FichaHelper.getInstance().personagem.inventario.items.filter(item => !item.refExtremidade).reduce((acc: { key: number; value: string }[], cur) => {
                                    acc.push({ key: cur.id, value: cur.nomeExibicaoOption });
                                    return acc;
                                }, [])
                            }
                        },
                        {
                            key: 'idExtremidade',
                            displayName: 'Extremidade Alvo',
                            obterOpcoes: (): Opcao[] => {
                                return FichaHelper.getInstance().personagem.estatisticasBuffaveis.extremidades.filter(extremidade => !extremidade.refItem).reduce((acc: { key: number; value: string }[], cur) => {
                                    acc.push({ key: cur.id, value: `Extremidade ${cur.id}` });
                                    return acc;
                                }, [])
                            }
                        },
                    ]);
                }
            ]
        ]);
    retorno.push(habilidade1);

    const habilidade2 = new Habilidade(2, 'Guardar Item', new RequisitoFicha((personagem: Personagem) => personagem.estatisticasBuffaveis.extremidades.length > 0))
        .adicionarAcoes([
            [
                ...classeComArgumentos(AcaoHabilidade, 'Guardar Item', 1, 1, 2),
                (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 3, 1)
                    ]);
                    acao.adicionarRequisitos([
                        classeComArgumentos(RequisitoAlgumItemEmpunhado)
                    ]);
                    acao.adicionarOpcoesExecucao([
                        {
                            key: 'idItem',
                            displayName: 'Item Alvo',
                            obterOpcoes: (): Opcao[] => {
                                return FichaHelper.getInstance().personagem.inventario.items.filter(item => item.refExtremidade).reduce((acc: { key: number; value: string }[], cur) => {
                                    acc.push({ key: cur.id, value: cur.nomeExibicaoOption });
                                    return acc;
                                }, [])
                            },
                        },
                    ]);
                }
            ]
        ])
    retorno.push(habilidade2);

    return retorno;
}

export class OpcoesExecucao {
    constructor(private _key: string, private _displayName: string, private _obterOpcoes: () => Opcao[]) { }
    get opcoes(): Opcao[] { return this._obterOpcoes(); }
    get key(): string { return this._key; }
    get displayName(): string { return this._displayName; }
}

export type Opcao = { key: number, value: string };

export interface MensagemLog {
    titulo: string;
    mensagens: (string | MensagemLog)[];
}

export type RLJ_Ficha2 = {
    detalhes?: { nome: string, idClasse: number, idNivel: number },
    estatisticasBuffaveis?: { id: number, valor: number }[],
    estatisticasDanificaveis?: { id: number, valorMaximo: number, valor: number }[],
    atributos?: { id: number, valor: number }[],
    periciasPatentes?: { idPericia: number, idPatente: number }[],
    // reducoesDano:
}

export class PersonagemDetalhes {
    constructor(
        public nome: string,
        private _idClassePersonagem: number,
        private _idNivelPersonagem: number,
    ) { }

    get refClasse(): Classe {
        return SingletonHelper.getInstance().classes.find(classe => classe.id === this._idClassePersonagem)!;
    }
    get refNivel(): Nivel {
        return SingletonHelper.getInstance().niveis.find(nivel => nivel.id === this._idNivelPersonagem)!;
    }
}

export class Classe {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}

export class Nivel {
    constructor(
        public id: number,
        public nome: string,
    ) { }

    get nomeDisplay(): string { return `${this.nome}%` }
}

export class Mecanica {
    constructor(
        public id: number,
        public descricao: string,
    ) { }
}

const logicaMecanicas: { [key: number]: (valoresSelecionados: { [key: string]: number | undefined }) => void } = {
    1: (valoresSelecionados) => {
        const extremidadeSelecionada = FichaHelper.getInstance().personagem.estatisticasBuffaveis.extremidades.find(extremidade => extremidade.id === valoresSelecionados['idExtremidade']!)!;

        extremidadeSelecionada.empunhar(valoresSelecionados['idItem']!);
    },
    2: (valoresSelecionados) => {
        const itemSelecionado = FichaHelper.getInstance().personagem.inventario.items.find(item => item.id === valoresSelecionados['idItem']);

        itemSelecionado?.refExtremidade?.guardar();
    },
    3: (valoresSelecionados) => {
        
    }
};