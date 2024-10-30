// #region Imports
import { classeComArgumentos, adicionarAcoesUtil, Acao, RequisitoFicha, Personagem, AcaoHabilidade, CustoExecucao, RequisitoExtremidadeDisponivel, RequisitoAlgumItemGuardado, Opcao, RequisitoAlgumItemEmpunhado, RequisitoPodeSeLocomover, BuffInterno } from 'Types/classes/index.ts';
import { FichaHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export class Habilidade {
    public acoes: Acao[] = [];

    constructor(
        public nome: string,
        public requisitoFicha: RequisitoFicha,
    ) { }

    adicionarAcoes(acaoParams: [new (...args: any[]) => Acao, any[], (acao: Acao) => void][]): this { return (adicionarAcoesUtil(this, this.acoes, acaoParams), this) }

    get nomeExibicao(): string { return this.nome };
}

export const lista_geral_habilidades = (): Habilidade[] => {
    const retorno: Habilidade[] = [];

    const habilidade1 = new Habilidade('Sacar Item', new RequisitoFicha((personagem: Personagem) => personagem.estatisticasBuffaveis.extremidades.length > 0))
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

    const habilidade2 = new Habilidade('Guardar Item', new RequisitoFicha((personagem: Personagem) => personagem.estatisticasBuffaveis.extremidades.length > 0))
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

    retorno.push(
        new Habilidade('Movimento Acrobático', new RequisitoFicha((personagem:Personagem) => personagem.pericias.some(pericia => pericia.refPericia.id === 6)))
        .adicionarAcoes([
            [
                ...classeComArgumentos(AcaoHabilidade, 'Movimento Acrobático', 1, 1, 3),
                (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 1, 1)
                    ]);
                    acao.adicionarRequisitos([
                        classeComArgumentos(RequisitoPodeSeLocomover)
                    ]);
                    acao.adicionarBuffs([
                        classeComArgumentos(BuffInterno, 52, 'Movimento Acrobático', 1, 4, 1, 1)
                    ]);
                }
            ]
        ])
    )

    return retorno;
}