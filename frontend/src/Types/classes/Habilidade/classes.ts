// #region Imports
import { classeComArgumentos, adicionarAcoesUtil, Acao, RequisitoFicha, Personagem, CustoExecucao, Buff, adicionarBuffsUtil, DificuldadeConsecutiva, FiltroProps, FiltroPropsItems, CorTooltip, Comportamentos } from 'Types/classes/index.ts';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export class Habilidade {
    public comportamentos: Comportamentos;

    public svg: string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+';

    constructor(
        public nome: string,
        public requisitoFicha?: RequisitoFicha,
    ) {
        this.comportamentos = new Comportamentos();
    }

    get nomeExibicao(): string { return this.nome };

    static get filtroProps(): FiltroProps<Habilidade> {
        return new FiltroProps<Habilidade>(
            "Habibilidades",
            [
                new FiltroPropsItems<Habilidade>(
                    (habilidade) => habilidade.nome,
                    'Nome da Habilidade',
                    'Procure pela Habilidade',
                    'text',
                    true
                ),
            ]
        )
    }
}

export class HabilidadeAtiva extends Habilidade {
    public acoes: Acao[] = [];

    constructor(nome: string, requisitoFicha?: RequisitoFicha) {
        super(nome, requisitoFicha);
    }

    adicionarAcoes(acaoParams: [new (...args: any[]) => Acao, any[], (acao: Acao) => void][]): this { return (adicionarAcoesUtil(this, this.acoes, acaoParams), this) }
}

export class HabilidadePassiva extends Habilidade {
    public buffs: Buff[] = [];

    adicionarBuffs(buffParams: [new (...args: any[]) => Buff, any[]][]): this { return (adicionarBuffsUtil(this, this.buffs, buffParams), this) };
}

export const lista_geral_habilidades = (): Habilidade[] => {
    const retorno: Habilidade[] = [];

    const habilidade1 = new HabilidadeAtiva('Sacar Item', new RequisitoFicha((personagem: Personagem) => {
        return personagem.estatisticasBuffaveis.extremidades.length > 0 && personagem.inventario.items.some(item => item.itemEmpunhavel)
    }))
        .adicionarAcoes([
            [
                ...classeComArgumentos(Acao, 'Sacar Item', 1, 1, 1),
                (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 3, 1)
                    ]);
                    acao.adicionarRequisitosEOpcoesPorId([3, 4]);
                }
            ]
        ]);
    retorno.push(habilidade1);

    const habilidade2 = new HabilidadeAtiva('Guardar Item', new RequisitoFicha((personagem: Personagem) => {
        return personagem.estatisticasBuffaveis.extremidades.length > 0 && personagem.inventario.items.some(item => item.itemEmpunhavel)
    }))
        .adicionarAcoes([
            [
                ...classeComArgumentos(Acao, 'Guardar Item', 1, 1, 2),
                (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 3, 1)
                    ]);
                    acao.adicionarRequisitosEOpcoesPorId([5]);
                }
            ]
        ]);
    retorno.push(habilidade2);

    const habilidade3 = new HabilidadeAtiva('Vestir Item', new RequisitoFicha((personagem: Personagem) => {
        return personagem.inventario.items.some(item => item.itemVestivel)
    }))
        .adicionarAcoes([
            [
                ...classeComArgumentos(Acao, 'Vestir Item', 1, 1, 4),
                (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 2, 1)
                    ]);
                    acao.adicionarRequisitosEOpcoesPorId([6]);
                }
            ]
        ]);
    retorno.push(habilidade3);

    const habilidade4 = new HabilidadeAtiva('Desvestir Item', new RequisitoFicha((personagem: Personagem) => {
        return personagem.inventario.items.some(item => item.itemVestivel)
    }))
        .adicionarAcoes([
            [
                ...classeComArgumentos(Acao, 'Desvestir Item', 1, 1, 5),
                (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 2, 1)
                    ]);
                    acao.adicionarRequisitosEOpcoesPorId([3, 7]);
                }
            ]
        ]);
    retorno.push(habilidade4);

    // retorno.push(
    //     new Habilidade('Movimento Acrobático', new RequisitoFicha((personagem:Personagem) => personagem.pericias.some(pericia => pericia.refPericia.id === 6)))
    //     .adicionarAcoes([
    //         [
    //             ...classeComArgumentos(Acao, 'Movimento Acrobático', 1, 1, 3),
    //             (acao) => {
    //                 acao.adicionarCustos([
    //                     classeComArgumentos(CustoExecucao, 1, 1)
    //                 ]);
    //                 acao.adicionarRequisitos([
    //                     classeComArgumentos(RequisitoPodeSeLocomover)
    //                 ]);
    //                 acao.adicionarBuffs([
    //                     classeComArgumentos(BuffInterno, 52, 'Movimento Acrobático', 1, 4, 1, 1)
    //                 ]);
    //             }
    //         ]
    //     ])
    // );

    // retorno.push(new HabilidadeAtiva('Movimento Acribático'))
    // retorno.push(new HabilidadeAtiva('Resolver Mecanismo'))
    // retorno.push(new HabilidadeAtiva('Surrupiar'))
    // retorno.push(new HabilidadeAtiva('Esconder'))
    // retorno.push(new HabilidadeAtiva('Proativo'))?
    // retorno.push(new HabilidadePassiva('Ataque a Distância'))
    // retorno.push(new HabilidadeAtiva('Resistir com Reflexo'))
    // retorno.push(new HabilidadeAtiva('Manobra de Combate'))
    // retorno.push(new HabilidadePassiva('Ataque Corpo-a-Corpo'))
    // retorno.push(new HabilidadeAtiva('Manobra de Combate'))
    // retorno.push(new HabilidadeAtiva('Comando'))?
    // retorno.push(new HabilidadeAtiva('Execução Artística'))
    // retorno.push(new HabilidadeAtiva('Sabichão'))
    // retorno.push(new HabilidadePassiva('Manuseio de Substânncias Mundanas'))
    // retorno.push(new HabilidadePassiva('Conhecimento Científico'))
    // retorno.push(new HabilidadeAtiva('Manutenção'))
    // retorno.push(new HabilidadeAtiva('Procurar Por Pistas'))
    // retorno.push(new HabilidadeAtiva('Estancar'))
    // retorno.push(new HabilidadeAtiva('Sentir Anomalia'))
    // retorno.push(new HabilidadeAtiva('Improvisar Ferramenta'))
    // retorno.push(new HabilidadeAtiva('Analisar Terreno'))
    // retorno.push(new HabilidadeAtiva('Refugiar'))
    // retorno.push(new HabilidadeAtiva('Manusear Maquinário'))
    // retorno.push(new HabilidadeAtiva('Melhorar Relacionamento'))
    // retorno.push(new HabilidadeAtiva('Esconder Informação'))
    // retorno.push(new HabilidadeAtiva('Intimidar'))
    // retorno.push(new HabilidadeAtiva('Julgar'))
    // retorno.push(new HabilidadeAtiva('Analisar Arredores'))
    // retorno.push(new HabilidadeAtiva('Mente Resistente'))
    // retorno.push(new HabilidadeAtiva('Reagir com Fortitude'))
    // retorno.push(new HabilidadeAtiva('Corpo Resistente'))

    retorno.push(
        new HabilidadeAtiva('Ação Rápida', new RequisitoFicha((personagem:Personagem) => personagem.pericias.find(pericia => pericia.refPericia.id === 7)?.refPatente.id! > 0))
        .adicionarAcoes([
            [
                ...classeComArgumentos(Acao, 'Ação Rápida', 1, 1),
                (acao) => {
                    acao.adicionarDificuldades([
                        classeComArgumentos(DificuldadeConsecutiva, 7, 10, 5)
                    ]);
                    acao.adicionarLogicaExecucao(() => {
                        getPersonagemFromContext().estatisticasBuffaveis.execucoes.find(execucao => execucao.refTipoExecucao.id === 3)!.numeroAcoesAtuais++;
                    })
                }
            ]
        ])
    );

    return retorno;
}