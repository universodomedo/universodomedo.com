// #region Imports
import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
import { classeComArgumentos, adicionarAcoesUtil, Acao, RequisitoFicha, Personagem, CustoExecucao, FiltroProps, FiltroPropsItems, EmbrulhoComportamentoHabilidade, DificuldadeConsecutiva, Modificador, adicionarModificadoresUtil } from 'Types/classes/index.ts';
// #endregion

export class Habilidade {
    public comportamentos: EmbrulhoComportamentoHabilidade = new EmbrulhoComportamentoHabilidade();

    public svg: string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+';

    constructor(
        public nome: string,
        public descricao: string,
        public requisitoFicha?: RequisitoFicha,
    ) { }

    criarRequisito(condicao: (personagem: Personagem) => boolean): RequisitoFicha {
        return new RequisitoFicha(condicao);
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

    adicionarAcoes(acoes: { props: ConstructorParameters<typeof Acao>, config: (acao: Acao) => void }[]): this { return (adicionarAcoesUtil(this, this.acoes, acoes), this); }
}

export class HabilidadePassiva extends Habilidade {
    protected _modificadores: Modificador[] = [];
    get modificadores(): Modificador[] { return this._modificadores; }

    adicionarModificadores(propsModificadores: ConstructorParameters<typeof Modificador>[0][]): this { return (adicionarModificadoresUtil(this, this._modificadores, propsModificadores), this); }
}

export const lista_geral_habilidades = (): Habilidade[] => {
    return [

        // ACRO //

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

        new HabilidadeAtiva('Movimento Acrobático', 'Seu próximo Deslocamento ultrapassa obstáculos de variadas alturas', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 1);
        })),
        new HabilidadePassiva('Impulso Rápido', 'A Ação Levantar se torna Ação Livre', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 1 && pericia.refPatente.id >= 2);
        })),
        new HabilidadePassiva('Acrobacia Aprimorada', 'Você recebe +5 ACRO na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 1 && pericia.refPatente.id >= 3);
        })),
        new HabilidadePassiva('Movimento Frenético', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 1 && pericia.refPatente.id >= 3);
        })).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 3 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),

        // new HabilidadePassiva('Teste Movimento Frenético 1', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => { return true})).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito:53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBaseAdicional: 0, valorPorcentagemAdicional: 0   , valorBonusAdicional: 0 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        // new HabilidadePassiva('Teste Movimento Frenético 2', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => { return true})).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito:53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBaseAdicional: 0, valorPorcentagemAdicional: 0   , valorBonusAdicional: 3 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        // new HabilidadePassiva('Teste Movimento Frenético 3', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => { return true})).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito:53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBaseAdicional: 2, valorPorcentagemAdicional: 0   , valorBonusAdicional: 2 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        // new HabilidadePassiva('Teste Movimento Frenético 4', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => { return true})).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito:53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBaseAdicional: 3, valorPorcentagemAdicional: 100   , valorBonusAdicional: 5 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        // new HabilidadePassiva('Teste Movimento Frenético 5', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => { return true})).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito:53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBaseAdicional: 0, valorPorcentagemAdicional: 50 , valorBonusAdicional: 0 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        // new HabilidadePassiva('Teste Movimento Frenético 6', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => { return true})).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito:53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBaseAdicional: 0, valorPorcentagemAdicional: 50 , valorBonusAdicional: 2 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        // new HabilidadePassiva('Teste Movimento Frenético 7', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => { return true})).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito:53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBaseAdicional: 2, valorPorcentagemAdicional: 50 , valorBonusAdicional: 0 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        // new HabilidadePassiva('Teste Movimento Frenético 8', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => { return true})).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito:53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBaseAdicional: 2, valorPorcentagemAdicional: 10 , valorBonusAdicional: 0 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        // new HabilidadePassiva('Teste Movimento Frenético 9', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => { return true})).adicionarModificadores([{ nome: 'Movimento Frenético1', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito:53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBaseAdicional: 3, valorPorcentagemAdicional: 25, valorBonusAdicional: 5 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        // new HabilidadePassiva('Teste Movimento Frenético 10', 'Aumenta seu Deslocamento em +3', new RequisitoFicha((personagem: Personagem) => { return true})).adicionarModificadores([{ nome: 'Movimento Frenético2', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito:53, idTipoEfeito: 5, dadosValoresEfeitos: { valorBaseAdicional: 1, valorPorcentagemAdicional: 10 , valorBonusAdicional: 2 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),

        new HabilidadePassiva('Movimento Não Linear', 'Você ignora Penalidades de Deslocamento Vertical até o início do seu próximo turno', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 1 && pericia.refPatente.id >= 4);
        })),

        // CRIM //

        new HabilidadeAtiva('Resolver Mecanismo', 'Você tenta Resolver um Mecanismo', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 2);
        })),
        new HabilidadeAtiva('Surrupiar', 'Você retira um Item de um Local ou do Inventário de um Ser, sem ser Percebido', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 2);
        })),
        new HabilidadePassiva('Olho Treinado', 'Ao falhar em um uso de Resolver Mecanismo, você sabe aproximadamente a Diferença de Dificuldade', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 2 && pericia.refPatente.id >= 2);
        })),
        new HabilidadePassiva('Crime Aprimorado', 'Você recebe +5 CRIM na sua próxima tentativa para essa mesma Ação', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 2 && pericia.refPatente.id >= 3);
        })),
        // new ('', '', new RequisitoFicha((personagem: Personagem) => { 
        //     return personagem.pericias.some(pericia => pericia.refPericia.id === 2 && pericia.refPatente.id >= 4);
        // })),

        // FURT //

        new HabilidadeAtiva('Esconder', 'Te torna Despercebido contra seres que não tem Linha de Visão de você', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 3);
        })),
        new HabilidadePassiva('Gatuno', 'Uma vez por turno, você pode utilizar a Ação Esconder como Ação Livre', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 3 && pericia.refPatente.id >= 2);
        })),
        new HabilidadeAtiva('Ataque Furtivo', 'Esse ataque recebe (P.FURT * 10)% de Variância reduzida', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 3 && pericia.refPatente.id >= 3);
        })),
        new HabilidadePassiva('Rastejando nas Sombras', 'Anula as Penalidades de Deslocamento do estado Escondido', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 3 && pericia.refPatente.id >= 4);
        })),

        // INIC //

        new Habilidade('Próativo', 'Define sua Ordem de Ação em Turnos de Combate', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 4);
        })),
        new Habilidade('Saque Rápido', 'Realiza uma Ação de Sacar ou Ação de Guardar', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 4 && pericia.refPatente.id >= 2);
        })),
        // new Habilidade('Preparar Ação Simples', '', new RequisitoFicha((personagem: Personagem) => { 
        //     return personagem.pericias.some(pericia => pericia.refPericia.id === 4 && pericia.refPatente.id >= 2);
        // })),
        new Habilidade('Iniciativa Aprimorada', 'Você recebe +5 INIC na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 4 && pericia.refPatente.id >= 3);
        })),
        // new Habilidade('Preparar Ação Complexa', '', new RequisitoFicha((personagem: Personagem) => { 
        //     return personagem.pericias.some(pericia => pericia.refPericia.id === 4 && pericia.refPatente.id >= 3);
        // })),
        new Habilidade('Saque Súbito', 'Melhora a Ação Saque Rápido', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 4 && pericia.refPatente.id >= 4);
        })),

        // PONT //

        new HabilidadePassiva('Realizar Ataque a Distância', 'Você pode executar Ataques com Armas de Ataque a Distância', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 5);
        })),
        new HabilidadePassiva('Proficiência com Armas a Distância Simples', 'Você pode utilizar Armas de Ataque a Distância Simples', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 5 && pericia.refPatente.id >= 2);
        })),
        new HabilidadePassiva('Ponto Cego', 'Você recebe uma Vantagem quando atacando um Alvo estando em Posição de Vantagem', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 5 && pericia.refPatente.id >= 2);
        })),
        new HabilidadePassiva('Proficiência com Armas a Distância Complexas', 'Você pode utilizar Armas de Ataque a Distância Complexas', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 5 && pericia.refPatente.id >= 3);
        })),
        new HabilidadeAtiva('Mirar', 'Você remove Penalidades de Linha de Fogo em seu próximo Ataque', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 5 && pericia.refPatente.id >= 3);
        })),
        new HabilidadePassiva('Proficiência com Armas a Distância Especiais', 'Você pode utilizar Armas de Ataque a Distância Especiais', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 5 && pericia.refPatente.id >= 4);
        })),
        new HabilidadePassiva('Analista de Armas a Distância', 'Você sabe dizer a Patente e Categoria de uma Arma de Ataque a Distância na qual tem Visão', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 5 && pericia.refPatente.id >= 4);
        })),

        // REFL //

        new HabilidadeAtiva('Reagir com Reflexo', 'Você soma seu Bônus de REFL na sua Defesa contra um Ataque', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 6);
        })),
        new HabilidadeAtiva('Pular na Frente', 'Você recebe um Ataque no lugar de um Alvo', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 6 && pericia.refPatente.id >= 2);
        })),
        new HabilidadeAtiva('Reflexo Aprimorado', 'Você recebe +5 REFL na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 6 && pericia.refPatente.id >= 3);
        })),
        new HabilidadePassiva('Potencializar Esquiva', 'Você substitui o Bônus de Reagir com Reflexo por um Teste REFL para somar na sua Defesa. Isso consome uma Ação de Movimento do seu próximo Turno', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 6 && pericia.refPatente.id >= 3);
        })),
        new HabilidadePassiva('Instinto de Batalha', 'Você recebe uma Reação Adicional', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 6 && pericia.refPatente.id >= 4);
        })).adicionarModificadores([{ nome: 'Instinto de Batalha', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 58, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 1 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),

        // ATLE //

        new Habilidade('Manobra de Combate', 'Você realiza uma das Manobras de Combate contra o Alvo', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 7);
        })),
        new Habilidade('Proficiência com Proteções Simples', 'Você pode utilizar Proteções Simples', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 7 && pericia.refPatente.id >= 2);
        })),
        new HabilidadeAtiva('Ação Rápida', 'Você recebe uma Ação de Movimento Extra', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 7 && pericia.refPatente.id >= 2);
        })).adicionarAcoes([
            {
                props: [{ nome: 'Ação Rápida', idTipoAcao: 1, idCategoriaAcao: 1, }, {
                    dadosComportamentoUsoAcao: [
                        10, 3, [2]
                    ],
                }],
                config: (acao) => {
                    acao.adicionarLogicaExecucao(() => {
                        getPersonagemFromContext().estatisticasBuffaveis.execucoes.find(execucao => execucao.refTipoExecucao.id === 3)!.numeroAcoesAtuais++;
                    })
                }
            }
        ]),
        new Habilidade('Proficiência com Proteções Complexas', 'Você pode utilizar Proteções Complexas', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 7 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Atletismo Aprimorado', 'Você recebe +5 ATLE na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 7 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Explosão de Adrenalina', 'Você Anula as Penalidades de Deslocamento por Sobrepeso até o Início do seu próximo Turno', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 7 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Proficiência com Proteções Especiais', 'Você pode utilizar Proteções Especiais', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 7 && pericia.refPatente.id >= 4);
        })),
        new Habilidade('Esforço Máximo', 'Você recebe +1 de AGI, FOR ou VIG, enquanto mantem o Efeito', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 7 && pericia.refPatente.id >= 4);
        })),

        // LUTA //

        new Habilidade('Realizar Ataque Corpo-a-Corpo', 'Você pode executar Ataques com Armas de Ataque Corpo-a-Corpo', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 8);
        })),
        new Habilidade('Proficiência com Armas Corpo-a-Corpo Simples', 'Você pode utilizar Armas de Ataque a Corpo-a-Corpo Simples', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 8 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Flanquear', 'Você recebe uma Vantagem quando atacando um Alvo estando em Posição de Vantagem', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 8 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Proficiência com Armas Corpo-a-Corpo Complexas', 'Você pode utilizar Armas de Ataque a Corpo-a-Corpo Complexas', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 8 && pericia.refPatente.id >= 3);
        })),
        // new Habilidade('Parry', '', new RequisitoFicha((personagem: Personagem) => {
        //     return personagem.pericias.some(pericia => pericia.refPericia.id === 8 && pericia.refPatente.id >= 3);
        // })),
        new Habilidade('Proficiência com Armas Corpo-a-Corpo Especiais', 'Você pode utilizar Armas de Ataque a Corpo-a-Corpo Especiais', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 8 && pericia.refPatente.id >= 4);
        })),
        new Habilidade('Analista de Armas Corpo-a-Corpo', 'Você sabe dizer a Patente e Categoria de uma Arma de Ataque a Corpo-a-Corpo na qual tem Visão', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 8 && pericia.refPatente.id >= 4);
        })),

        // ADES //

        new Habilidade('Comunicação Instintiva', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 9);
        })),
        new Habilidade('Domesticar', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 9 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Comando Simples', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 9 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Adestramento Aprimorado', 'Você recebe +5 ADES na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 9 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Comando Avançado', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 9 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Especialidade', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 9 && pericia.refPatente.id >= 4);
        })),

        // ARTE //

        new Habilidade('Execução Artística', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 10);
        })),
        new Habilidade('No Holofote', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 10 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Graciosidade', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 10 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Arte Acolhedora', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 10 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Criatividade Produtiva', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 10 && pericia.refPatente.id >= 4);
        })),

        // ATUA //

        new Habilidade('Sabichão', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 11);
        })),
        new Habilidade('Por Dentro das Novidades', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 11 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Atualidades Aprimorada', 'Você recebe +5 ATUA na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 11 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Noticia do Dia', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 11 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Procurando Respostas', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 11 && pericia.refPatente.id >= 4);
        })),

        // CIEN //

        new Habilidade('Manuseio de Substâncias Mundanas', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 12);
        })),
        new Habilidade('Conhecimento Científico', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 12);
        })),
        new Habilidade('Manuseio de Substâncias Simples', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 12 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Domínio Científico', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 12 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Manuseio de Substâncias Complexas', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 12 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Laboratório de Guerra', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 12 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Manuseio de Substâncias Especiais', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 12 && pericia.refPatente.id >= 4);
        })),
        new Habilidade('Abundância Científica', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 12 && pericia.refPatente.id >= 4);
        })),

        // ENGE //

        new Habilidade('Manutenção', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 13);
        })),
        new Habilidade('Confecção', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 13 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Desmantelar', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 13 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Criatividade Instável', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 13 && pericia.refPatente.id >= 4);
        })),

        // INVE //

        new Habilidade('Procurar por Pistas', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 14);
        })),
        new Habilidade('Opinião Auxiliar', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 14 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Conhecimento Especializado', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 14 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Investigação Otimizada', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 14 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Na Pista Certa', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 14 && pericia.refPatente.id >= 4);
        })),

        // MEDI //

        new Habilidade('Estancar', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 15);
        })),
        new Habilidade('Primeiros Socorros', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 15 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Fechar Ferida', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 15 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Medicina Aprimorada', 'Você recebe +5 MEDI na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 15 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Tratamento Intensivo', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 15 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Cuidados Médicos', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 15 && pericia.refPatente.id >= 4);
        })),
        new Habilidade('Cirurgia Improvisada', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 15 && pericia.refPatente.id >= 4);
        })),

        // OCUL //

        new Habilidade('Sentir Anomalia', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 16);
        })),
        new Habilidade('Expandir Aura', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 16 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Identificar Símbolo', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 16 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Memória do Outro Lado', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 16 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Ocultismo Aprimorado', 'Você recebe +5 OCUL na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 16 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Fortalecer Aura', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 16 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Sentir Membrana', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 16 && pericia.refPatente.id >= 4);
        })),
        new Habilidade('Ação Ritualística', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 16 && pericia.refPatente.id >= 4);
        })),

        // SOBR //

        new Habilidade('Improvisar Ferramenta', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 17);
        })),
        new Habilidade('Meios de Sobreviver', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 17 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Sobrevivência Aprimorada', 'Você recebe +5 SOBR na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 17 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Armar Armadilha', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 17 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Instinto de Caçador', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 17 && pericia.refPatente.id >= 4);
        })),
        new Habilidade('Improvisar Ambiente', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 17 && pericia.refPatente.id >= 4);
        })),

        // TATI //

        new Habilidade('Analisar Terreno', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 18);
        })),
        new Habilidade('Analisar Fraqueza', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 18 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Estrategista do Grupo', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 18 && pericia.refPatente.id >= 3);
        })),
        new HabilidadePassiva('Táticas de Combate', 'Você recebe uma Reação Adicional', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 18 && pericia.refPatente.id >= 4);
        })).adicionarModificadores([{ nome: 'Táticas de Combate', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 58, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 1 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),

        // TECN //

        new Habilidade('Manusear Maquinário', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 19);
        })),
        new Habilidade('Hacker', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 19 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Improvisar Equipamentos', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 19 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Preparar Mecanismo', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 19 && pericia.refPatente.id >= 4);
        })),

        // DIPL //

        new Habilidade('Melhorar Relacionamento', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 20);
        })),
        new Habilidade('Barganhar', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 20 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Voz da Paz', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 20 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Ressoar da Alma', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 20 && pericia.refPatente.id >= 4);
        })),

        // ENGA //

        new Habilidade('Esconder Informação', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 21);
        })),
        new Habilidade('Disfarce Realista', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 21 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Ventriloquismo', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 21 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Na palma da minha mão', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 21 && pericia.refPatente.id >= 4);
        })),

        // INTI //

        new Habilidade('Intimidar', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 22);
        })),
        new Habilidade('Alguem do seu Tamanho', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 22 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Intimidação Aprimorada', 'Você recebe +5 INTI na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 22 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Vai encarar', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 22 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Presença Amedrontadora', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 22 && pericia.refPatente.id >= 4);
        })),

        // INTU //

        new Habilidade('Julgar', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 23);
        })),
        new Habilidade('Argumentação Conjunta', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 23 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Intuição Aprimorada', 'Você recebe +5 INTU na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 23 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Verdade à Tona', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 23 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Devorador de Mentiras', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 23 && pericia.refPatente.id >= 4);
        })),

        // PERC //

        new Habilidade('Analisar Arredores', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 24);
        })),
        new Habilidade('Analisar Comportamento	', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 24 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Percepção Aprimorada', 'Você recebe +5 PERC na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 24 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Chamar por Atenção', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 24 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Olhos na Nuca', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 24 && pericia.refPatente.id >= 4);
        })),
        new Habilidade('Detecção Infalível', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 24 && pericia.refPatente.id >= 4);
        })),

        // VONT //

        new Habilidade('Mente Resistente', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 25);
        })),
        new Habilidade('Afeição Paranormal', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 25 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Vontade Aprimorada', 'Você recebe +5 VONT na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 25 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Mente Inabalável', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 25 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Estabilidade Mental', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 25 && pericia.refPatente.id >= 4);
        })),

        // FORT //

        new Habilidade('Corpo Resistente', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 26);
        })),
        new Habilidade('Reagir com Fortitude', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 26);
        })),
        new Habilidade('Aprimorar Resistência', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 26 && pericia.refPatente.id >= 2);
        })),
        new Habilidade('Fortitude Aprimorada', 'Você recebe +5 FORT na sua próxima tentativa de uma Ação Falha', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 26 && pericia.refPatente.id >= 3);
        })),
        new Habilidade('Negar a Morte', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.pericias.some(pericia => pericia.refPericia.id === 26 && pericia.refPatente.id >= 4);
        })),

        // Gerais //

        new HabilidadeAtiva('Sacar Item', 'Você Empunha um Item que está em seu Inventário em suas Extremidades Livres', new RequisitoFicha((personagem: Personagem) => {
            return personagem.estatisticasBuffaveis.extremidades.length > 0 && personagem.inventario.items.some(item => item.itemEmpunhavel)
        })).adicionarAcoes([
            {
                props: [{ nome: 'Sacar Item', idTipoAcao: 1, idCategoriaAcao: 1, idMecanica: 1 }, {}],
                config: (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 3, 1)
                    ]);
                    acao.adicionarRequisitosEOpcoesPorId([3, 4]);
                }
            },
        ]),
        new HabilidadeAtiva('Guardar Item', 'Você Guarda um Item que está em suas Extremidades em seu Inventário', new RequisitoFicha((personagem: Personagem) => {
            return personagem.estatisticasBuffaveis.extremidades.length > 0 && personagem.inventario.items.some(item => item.itemEmpunhavel)
        })).adicionarAcoes([
            {
                props: [{ nome: 'Guardar Item', idTipoAcao: 1, idCategoriaAcao: 1, idMecanica: 2 }, {}],
                config: (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 3, 1)
                    ]);
                    acao.adicionarRequisitosEOpcoesPorId([5]);
                }
            },
        ]),
        new HabilidadeAtiva('Vestir Item', 'Você Veste um Item que está em suas Extremidades', new RequisitoFicha((personagem: Personagem) => {
            return personagem.inventario.items.some(item => item.itemVestivel)
        })).adicionarAcoes([
            {
                props: [{ nome: 'Vestir Item', idTipoAcao: 1, idCategoriaAcao: 1, idMecanica: 4 }, {}],
                config: (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 2, 1)
                    ]);
                    acao.adicionarRequisitosEOpcoesPorId([6]);
                }
            },
        ]),
        new HabilidadeAtiva('Desvestir Item', 'Você Desveste um Item e Empunha em suas Extremidades Livres', new RequisitoFicha((personagem: Personagem) => {
            return personagem.inventario.items.some(item => item.itemVestivel)
        })).adicionarAcoes([
            {
                props: [{ nome: 'Desvestir Item', idTipoAcao: 1, idCategoriaAcao: 1, idMecanica: 5 }, {}],
                config: (acao) => {
                    acao.adicionarCustos([
                        classeComArgumentos(CustoExecucao, 2, 1)
                    ]);
                    acao.adicionarRequisitosEOpcoesPorId([3, 7]);
                }
            },
        ]),

        // Classes //

        new HabilidadePassiva('Amante de Armas', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.detalhes.refClasse.id === 2
        })),
        new HabilidadePassiva('O Melhor da Turma', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.detalhes.refClasse.id === 3
        })),
        new HabilidadePassiva('Constituição Paranormal', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.detalhes.refClasse.id === 4
        })),
        new HabilidadePassiva('Mente Corrompida', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.detalhes.refClasse.id === 4
        })).adicionarModificadores([{ nome: 'Mente Corrompida', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 24, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 5 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),
        new HabilidadePassiva('Ocultismo Morfológico', '', new RequisitoFicha((personagem: Personagem) => {
            return personagem.detalhes.refClasse.id === 4
        })),
    ];
}