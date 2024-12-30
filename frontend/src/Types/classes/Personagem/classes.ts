// #region Imports
import { classeComArgumentos, lista_geral_habilidades, EstatisticaDanificavel, EstatisticasBuffaveisPersonagem, ReducaoDano, AtributoPersonagem, PericiaPatentePersonagem, Inventario, Habilidade, Buff, Ritual, RLJ_Ficha2, Defesa, Execucao, EspacoInventario, GerenciadorEspacoCategoria, EspacoCategoria, Extremidade, CustoPE, CustoExecucao, CustoComponente, NomeItem, RequisitoItemEmpunhado, Opcao, Acao, BuffsAplicados, BuffsPorId, BuffsPorTipo, Item, HabilidadeAtiva, Modificadores, novoItemPorDadosItem } from 'Types/classes/index.ts';
import { LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

class Receptor {
    constructor(
        public personagem: Personagem,
    ) { }

    teste = (idEstatistica: number, valor: number, flagTipo: number) => {
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

    public modificadores: Modificadores = new Modificadores();

    public receptor: Receptor = new Receptor(this);

    constructor(private _ficha: RLJ_Ficha2) {
        const numExtremidades = 2; // depois vai ter q mudar para alguma logica, colocando esse numero no RLJ_Ficha2

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
            new GerenciadorEspacoCategoria([new EspacoCategoria(1, 2), new EspacoCategoria(2, 1), new EspacoCategoria(3, 0), new EspacoCategoria(4, 0), ]),
            numExtremidades
        );

        // this.reducoesDano = this._ficha.reducoesDano.map(reducaoDano => new ReducaoDano(reducaoDano.valor!, reducaoDano.tipoDano, this));
        this.atributos = this._ficha.atributos!.map(attr => new AtributoPersonagem(attr.id, attr.valor!));
        this.pericias = this._ficha.periciasPatentes!.map(periciaPatente => new PericiaPatentePersonagem(periciaPatente.idPericia, periciaPatente.idPatente));

        this.rituais = this._ficha.rituais!.map(ritual =>
            new Ritual([ritual.nomeRitual], ritual.dadosComportamentos)
                .adicionarAcoes(
                    ritual.dadosAcoes.map(dadosAcao => [
                        ...classeComArgumentos(Acao, [dadosAcao.nomeAcao, dadosAcao.idTipoAcao, dadosAcao.idCategoriaAcao, dadosAcao.idMecanica], {}),
                        (acao) => {
                            acao.adicionarCustos([
                                dadosAcao.custos.custoPE?.valor ? classeComArgumentos(CustoPE, dadosAcao.custos.custoPE.valor) : null!,
                                ...((dadosAcao.custos.custoExecucao || []).map(execucao =>
                                    execucao.valor ? classeComArgumentos(CustoExecucao, execucao.idExecucao, execucao.valor) : null!
                                )),
                                dadosAcao.custos.custoComponente ? classeComArgumentos(CustoComponente) : null!
                            ].filter(Boolean));
                            acao.adicionarBuffs(
                                (dadosAcao.buffs || []).map(buff => [
                                    ...classeComArgumentos(Buff, buff.idBuff, buff.nome, buff.valor, buff.duracao.idDuracao, buff.duracao.valor, buff.idTipoBuff, buff.dadosComportamentos)
                                ])
                            );
                            acao.adicionarRequisitosEOpcoesPorId(dadosAcao.requisitos);
                        }
                    ])
                )
        );

        this._ficha.inventario!.map(dadosItem => this.inventario.adicionarItemNoInventario(novoItemPorDadosItem(dadosItem)));
        
        this.habilidades = lista_geral_habilidades().filter(habilidade => habilidade.requisitoFicha === undefined || habilidade.requisitoFicha.verificaRequisitoCumprido(this));
    }

    public get acoes(): Acao[] {
        const acoesRituais = this.rituais.reduce((acc: Acao[], ritual) => {
            return acc.concat(ritual.acoes);
        }, []);

        const acoesHabilidades = this.habilidades.filter(habilidade => habilidade instanceof HabilidadeAtiva).reduce((acc: Acao[], habilidade) => {
            return acc.concat(habilidade.acoes);
        }, [])

        return acoesRituais.concat(this.inventario.acoesInventario()).concat(acoesHabilidades);
    }

    public onUpdate: () => void = () => { };

    // receberDanoVital = (danoGeral:DanoGeral) => {
    //     this.controladorPersonagem.reduzDano(danoGeral);
    // }

    // public rodaDuracao = (idDuracao: number) => {
    //     LoggerHelper.getInstance().adicionaMensagem(`Rodou ${SingletonHelper.getInstance().duracoes.find(duracao => duracao.id === idDuracao)?.nome}`);

    //     this.obterBuffs().filter(buff => buff.ativo).map(buff => {
    //         if (buff.refDuracao.id === idDuracao) {
    //             buff.reduzDuracao();
    //         } else if (buff.refDuracao.id < idDuracao) {
    //             buff.desativaBuff();
    //         }
    //     });

    //     if (idDuracao >= 2) this.estatisticasBuffaveis.execucoes.forEach(execucao => execucao.recarregaNumeroAcoes());

    //     LoggerHelper.getInstance().saveLog();

    //     this.onUpdate();
    // }

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