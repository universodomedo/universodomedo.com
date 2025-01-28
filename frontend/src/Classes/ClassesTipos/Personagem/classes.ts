// #region Imports
import { EstatisticaDanificavel, EstatisticasBuffaveisPersonagem, ReducaoDano, AtributoPersonagem, PericiaPatentePersonagem, Inventario, Habilidade, Ritual, RLJ_Ficha2, Defesa, Execucao, EspacoInventario, GerenciadorEspacoCategoria, EspacoCategoria, Acao, HabilidadeAtiva, novoItemPorDadosItem, lista_geral_habilidades, Efeito, ControladorModificadores, ValoresEfeito, CustoPE, classeComArgumentos, CustoExecucao, CustoComponente, NaturezaPersonagem, ProficienciaPersonagem } from 'Classes/ClassesTipos/index.ts';

import { SingletonHelper } from 'Classes/classes_estaticas.ts';
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
    public atributos: AtributoPersonagem[] = [];
    public pericias: PericiaPatentePersonagem[] = [];
    public inventario: Inventario = new Inventario();
    public habilidades: Habilidade[] = [];
    public buffsExternos: Efeito[] = [];
    public rituais: Ritual[] = [];
    public natureza: NaturezaPersonagem = new NaturezaPersonagem();

    public controladorModificadores: ControladorModificadores = new ControladorModificadores();
    public proficienciaPersonagem: ProficienciaPersonagem = new ProficienciaPersonagem();

    public receptor: Receptor = new Receptor(this);

    // só deve ser utilizado quando estiver upando
    public atualizaFonteDaFicha(novoDadosFicha: RLJ_Ficha2) {
        this._ficha = novoDadosFicha;
    }

    constructor(public _ficha: RLJ_Ficha2) {
        const numExtremidades = 2; // depois vai ter q mudar para alguma logica, colocando esse numero no RLJ_Ficha2

        this.detalhes = new PersonagemDetalhes(this._ficha.detalhes!.nome, this._ficha.detalhes!.idClasse, this._ficha.detalhes!.idNivel);

        this.estatisticasDanificaveis = this._ficha.estatisticasDanificaveis!.map(estatisticaDanificavel => {
            return new EstatisticaDanificavel(estatisticaDanificavel.id, estatisticaDanificavel.valorMaximo, estatisticaDanificavel.valor)
        });

        this.estatisticasBuffaveis = new EstatisticasBuffaveisPersonagem(
            new Defesa(5, 1, 1, 1),
            10,
            0,
            [new Execucao(2, 1), new Execucao(3, 1), new Execucao(4, 1)],
            new EspacoInventario(5, 5),
            new GerenciadorEspacoCategoria([new EspacoCategoria(1, 2), new EspacoCategoria(2, 1), new EspacoCategoria(3, 0), new EspacoCategoria(4, 0),]),
            numExtremidades
        );

        this.reducoesDano = this._ficha.reducoesDano?.map(reducao_dano => new ReducaoDano(reducao_dano.idTipoDano, reducao_dano.valor))!;
        this.carregaAtributos();
        this.pericias = this._ficha.periciasPatentes!.map(periciaPatente => new PericiaPatentePersonagem(periciaPatente.idPericia, periciaPatente.idPatente));

        this.rituais = this._ficha.rituais!.map(ritual =>
            new Ritual({ dadosGenericosRitual: ritual.args, dadosComportamentos: ritual.dadosComportamentos })
                .adicionarAcoes(
                    (ritual.dadosAcoes || []).map(dadosAcao => (
                        {
                            props: { dadosGenericosAcao: dadosAcao.args, dadosComportamentos: dadosAcao.dadosComportamentos },
                            config: (acao) => {
                                // acao.adicionarCustos([
                                //     dadosAcao.custos.custoPE?.valor ? classeComArgumentos(CustoPE, dadosAcao.custos.custoPE.valor) : null!,
                                //     ...((dadosAcao.custos.custoExecucao || []).map(execucao =>
                                //         execucao.valor ? classeComArgumentos(CustoExecucao, execucao.idExecucao, execucao.valor) : null!
                                //     )),
                                //     dadosAcao.custos.custoComponente ? classeComArgumentos(CustoComponente) : null!
                                // ].filter(Boolean));
                                acao.adicionarModificadores((dadosAcao.modificadores?.map(modificador => modificador.props) || []));
                                acao.adicionarRequisitosEOpcoesPorId(dadosAcao.requisitos);
                            }
                        }
                    ))
                )
        );

        this._ficha.inventario!.map(dadosItem => this.inventario.adicionarItemNoInventario(novoItemPorDadosItem(dadosItem)));
    }

    public get temPendencia(): boolean { return true; }

    public get acoes(): Acao[] {
        const acoesRituais = this.rituais.reduce((acc: Acao[], ritual) => acc.concat(ritual.acoes), []);

        const acoesHabilidades = this.habilidades.filter(habilidade => habilidade instanceof HabilidadeAtiva).reduce((acc: Acao[], habilidade) => acc.concat(habilidade.acoes), []);

        return this.natureza.acoes.concat(this.inventario.acoesInventario()).concat(acoesHabilidades).concat(acoesRituais);
    }

    obtemValorTotalComLinhaEfeito(valorBase: number, idLinhaEfeito: number): number {
        const valoresLinhaEfeito = this.controladorModificadores.valoresEfeitoPorLinhaEfeito(idLinhaEfeito);
        return Math.floor((valorBase + valoresLinhaEfeito.valorBaseAdicional) * (1 + (valoresLinhaEfeito.valorPorcentagemAdicional / 100))) + valoresLinhaEfeito.valorBonusAdicional;
    }

    obterDetalhesPorLinhaEfeito(idLinhaEfeito: number): string[] {
        return this.controladorModificadores.detalhesPorLinhaEfeito(idLinhaEfeito);
    }

    public onUpdate: () => void = () => { };

    // receberDanoVital = (danoGeral:DanoGeral) => {
    //     this.controladorPersonagem.reduzDano(danoGeral);
    // }

    public rodaDuracao = (idDuracao: number) => {
        // LoggerHelper.getInstance().adicionaMensagem(`Rodou ${SingletonHelper.getInstance().duracoes.find(duracao => duracao.id === idDuracao)?.nome}`);

        // this.obterBuffs().filter(buff => buff.ativo).map(buff => {
        //     if (buff.refDuracao.id === idDuracao) {
        //         buff.reduzDuracao();
        //     } else if (buff.refDuracao.id < idDuracao) {
        //         buff.desativaBuff();
        //     }
        // });

        if (idDuracao >= 2) this.estatisticasBuffaveis.execucoes.forEach(execucao => execucao.recarregaNumeroAcoes());

        // LoggerHelper.getInstance().saveLog();

        this.onUpdate();
    }

    public carregaOnUpdate = (callback: () => void) => {
        this.onUpdate = callback;
    }

    public carregaAtributos() {
        this.atributos = this._ficha.atributos!.map(attr => new AtributoPersonagem(attr.id, attr.valor!));
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