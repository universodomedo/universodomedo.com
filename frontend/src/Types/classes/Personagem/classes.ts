// #region Imports
import { classeComArgumentos, lista_geral_habilidades, EstatisticaDanificavel, EstatisticasBuffaveisPersonagem, ReducaoDano, AtributoPersonagem, PericiaPatentePersonagem, Inventario, Habilidade, Buff, Ritual, RLJ_Ficha2, Defesa, Execucao, EspacoInventario, GerenciadorEspacoCategoria, EspacoCategoria, Extremidade, AcaoRitual, CustoPE, CustoExecucao, CustoComponente, BuffInterno, ItemComponente, NomeItem, DetalhesItemComponente, ItemArma, DetalhesItemArma, AcaoAtaque, RequisitoItemEmpunhado, Opcao, Acao, BuffsAplicados, BuffsPorId, BuffsPorTipo } from 'Types/classes/index.ts';
import { LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

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

        this.rituais = this._ficha.rituais!.map(ritual =>
            new Ritual(ritual.nomeRitual, ritual.idCirculoNivel, ritual.idElemento)
            // .adicionarAcoes([
            //     [
            //         ...classeComArgumentos(AcaoRitual, ritual.dadosAcao.nomeAcao, ritual.dadosAcao.idTipoAcao, ritual.dadosAcao.idCateoriaAcao, ritual.dadosAcao.idMecanica),
            //         (acao) => {
            //             acao.adicionarCustos([
            //                 ritual.dadosAcao.custos.custoPE?.valor ? classeComArgumentos(CustoPE, ritual.dadosAcao.custos.custoPE.valor) : null!,
            //                 ...((ritual.dadosAcao.custos.custoExecucao || []).map(execucao =>
            //                     execucao.valor ? classeComArgumentos(CustoExecucao, execucao.idExecucao, execucao.valor) : null!
            //                 )),
            //                 ritual.dadosAcao.custos.custoComponente ? classeComArgumentos(CustoComponente) : null!
            //             ]);
            //             acao.adicionarBuffs([
            //                 classeComArgumentos(BuffInterno, ritual.dadosAcao.buff.idBuff, ritual.dadosAcao.buff.nome, ritual.dadosAcao.buff.valor, ritual.dadosAcao.buff.duracao.idDuracao, ritual.dadosAcao.buff.duracao.valor, ritual.dadosAcao.buff.idTipoBuff)
            //             ]);
            //             acao.adicionarRequisitosEOpcoesPorId(ritual.dadosAcao.requisitos);
            //         }
            //     ]
            // ])
            .adicionarAcoes(
                ritual.dadosAcao.map(dadoAcao => [
                    ...classeComArgumentos(AcaoRitual, dadoAcao.nomeAcao, dadoAcao.idTipoAcao, dadoAcao.idCateoriaAcao, dadoAcao.idMecanica),
                    (acao) => {
                        acao.adicionarCustos([
                            dadoAcao.custos.custoPE?.valor ? classeComArgumentos(CustoPE, dadoAcao.custos.custoPE.valor) : null!,
                            ...((dadoAcao.custos.custoExecucao || []).map(execucao =>
                                execucao.valor ? classeComArgumentos(CustoExecucao, execucao.idExecucao, execucao.valor) : null!
                            )),
                            dadoAcao.custos.custoComponente ? classeComArgumentos(CustoComponente) : null!
                        ]);
                        acao.adicionarBuffs([
                            classeComArgumentos(BuffInterno, dadoAcao.buff.idBuff, dadoAcao.buff.nome, dadoAcao.buff.valor, dadoAcao.buff.duracao.idDuracao, dadoAcao.buff.duracao.valor, dadoAcao.buff.idTipoBuff)
                        ]);
                        acao.adicionarRequisitosEOpcoesPorId(dadoAcao.requisitos);
                    }
                ])
            )
        );

        // const itemComponente = new ItemComponente(new NomeItem('Componente de Energia Simples'), 1, 0, new DetalhesItemComponente(2, 1, 2));
        // this.inventario.adicionarItemNoInventario(itemComponente);

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
                                    return [{ key: 1, value: 'Alguem bem atrás de você' }];
                                }
                            },
                        ]);
                    }
                ]
            ]);
        this.inventario.adicionarItemNoInventario(item6);

        this.habilidades = lista_geral_habilidades().filter(habilidade => habilidade.requisitoFicha.verificaRequisitoCumprido(this));
    }

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