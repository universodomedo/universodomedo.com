// #region Imports
import { classeComArgumentos, adicionarAcoesUtil, Acao, RequisitoFicha, Personagem, CustoExecucao, FiltroProps, FiltroPropsItems, EmbrulhoComportamentoHabilidade, Modificador, adicionarModificadoresUtil, OpcoesFiltro, OpcoesFiltrosCategorizadas, Pericia, PatentePericia } from 'Types/classes/index.ts';

import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
// #endregion

export abstract class Habilidade {
    public comportamentos: EmbrulhoComportamentoHabilidade = new EmbrulhoComportamentoHabilidade();

    public requisitoFicha?: RequisitoFicha

    public svg: string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+';
    protected abstract _habilidadeAtivaOuPassiva: 1 | 2;

    constructor(
        public nome: string,
        public descricao: string,
        protected _fonteHabilidade: FonteHabilidade,
    ) {
        if (this._fonteHabilidade.fonte === 'Habilidade de Perícia') {
            const habilidadePericia = this._fonteHabilidade as { fonte: 'Habilidade de Perícia'; idPericia: number; idPatente: number };
            this.requisitoFicha = new RequisitoFicha((personagem: Personagem) => {
                return personagem.pericias.some(pericia =>
                    pericia.refPericia.id === habilidadePericia.idPericia &&
                    pericia.refPatente.id >= habilidadePericia.idPatente
                );
            });
        }
    }

    get refOpcionalPericia(): Pericia | undefined {
        if (this._fonteHabilidade.fonte === 'Habilidade de Perícia') {
            const habilidadePericia = this._fonteHabilidade as { fonte: 'Habilidade de Perícia'; idPericia: number; idPatente: number };
            return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === habilidadePericia.idPericia)!;  
        }

        return undefined;
    }

    get refOpcionalPatente(): PatentePericia | undefined {
        if (this._fonteHabilidade.fonte === 'Habilidade de Perícia') {
            const habilidadePericia = this._fonteHabilidade as { fonte: 'Habilidade de Perícia'; idPericia: number; idPatente: number };
            return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === habilidadePericia.idPatente)!;  
        }

        return undefined;
    }

    get nomeExibicao(): string { return this.nome };

    static get filtroProps(): FiltroProps<Habilidade> {
        return new FiltroProps<Habilidade>(
            "Habibilidades",
            [
                new FiltroPropsItems<Habilidade>(
                    (habilidade) => habilidade.nomeExibicao.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase(),
                    'Nome da Habilidade',
                    'Procure pela Habilidade',
                    'text',
                    true,
                ),
                new FiltroPropsItems<Habilidade>(
                    (habilidade) => habilidade._habilidadeAtivaOuPassiva,
                    'Tipo de Habilidade',
                    'Selecione o Tipo',
                    'select',
                    true,
                    new OpcoesFiltro([{ id: 1, nome: 'Ativa'}, { id: 2, nome: 'Passiva' }]),
                ),
                new FiltroPropsItems<Habilidade>(
                    (habilidade) => habilidade.refOpcionalPericia?.id,
                    'Fonte da Habilidade',
                    'Selecione a Fonte da Habilidade',
                    'select',
                    true,
                    new OpcoesFiltrosCategorizadas(
                        [
                            { categoria: 'Habilidades de Perícia', opcoes: new OpcoesFiltro(getPersonagemFromContext().pericias.map(pericia => ({id:pericia.refPericia.id, nome: `Habilidades de ${pericia.refPericia.nomeAbrev}`}))), },
                            // { categoria: 'Habilidades Especiais', opcoes: new OpcoesFiltro([{}]), },
                        ]
                    ),
                ),
                new FiltroPropsItems<Habilidade>(
                    (habilidade) => habilidade.refOpcionalPatente?.id,
                    'Patente da Habilidade',
                    'Selecione a Patente da Habilidade',
                    'select',
                    true,
                    new OpcoesFiltro(SingletonHelper.getInstance().patentes_pericia.map(patente_pericia => ({ id: patente_pericia.id, nome: patente_pericia.nome }))),
                ),
            ]
        )
    }
}

export class HabilidadeAtiva extends Habilidade {
    public acoes: Acao[] = [];
    protected _habilidadeAtivaOuPassiva = 1 as const;

    adicionarAcoes(acoes: { props: ConstructorParameters<typeof Acao>, config?: (acao: Acao) => void }[]): this { return (adicionarAcoesUtil(this, this.acoes, acoes), this); }
}

export class HabilidadePassiva extends Habilidade {
    protected _modificadores: Modificador[] = [];
    get modificadores(): Modificador[] { return this._modificadores; }
    protected _habilidadeAtivaOuPassiva = 2 as const;

    adicionarModificadores(propsModificadores: ConstructorParameters<typeof Modificador>[0][]): this { return (adicionarModificadoresUtil(this, this._modificadores, propsModificadores), this); }
}

export type FonteHabilidade = { fonte: 'Habilidade de Perícia'; idPericia: number; idPatente: number } | { fonte: 'Habilidade Especial'; tipo: 'Mundana' | 'Paranormal' };

export const lista_geral_habilidades = (): Habilidade[] => {
    return [

        // ACRO //

        new HabilidadeAtiva('Movimento Acrobático', 'Seu próximo Deslocamento ultrapassa obstáculos de variadas alturas', { fonte: 'Habilidade de Perícia', idPericia: 1, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Movimento Acrobático', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 1, idPericia: 1 }] }], }]),
        new HabilidadePassiva('Impulso Rápido', 'A Ação Levantar se torna Ação Livre', { fonte: 'Habilidade de Perícia', idPericia: 1, idPatente: 2 }),
        new HabilidadePassiva('Acrobacia Aprimorada', 'Você recebe +5 ACRO na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 1, idPatente: 3 }),
        new HabilidadePassiva('Movimento Frenético', 'Aumenta seu Deslocamento em +3', { fonte: 'Habilidade de Perícia', idPericia: 1, idPatente: 3 }).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 3 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        new HabilidadePassiva('Movimento Não Linear', 'Você ignora Penalidades de Deslocamento Vertical até o início do seu próximo turno', { fonte: 'Habilidade de Perícia', idPericia: 1, idPatente: 4 }),

        // CRIM //

        new HabilidadeAtiva('Resolver Mecanismo', 'Você tenta Resolver um Mecanismo', { fonte: 'Habilidade de Perícia', idPericia: 2, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Resolver Mecanismo', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 1, idPericia: 2 }] }], }]),
        new HabilidadeAtiva('Surrupiar', 'Você retira um Item de um Local ou do Inventário de um Ser, sem ser Percebido', { fonte: 'Habilidade de Perícia', idPericia: 2, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Surrupiar', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 1, idPericia: 2 }] }], }]),
        new HabilidadePassiva('Olho Treinado', 'Ao falhar em um uso de Resolver Mecanismo, você sabe aproximadamente a Diferença de Dificuldade', { fonte: 'Habilidade de Perícia', idPericia: 2, idPatente: 2 }),
        new HabilidadePassiva('Crime Aprimorado', 'Você recebe +5 CRIM na sua próxima tentativa para essa mesma Ação', { fonte: 'Habilidade de Perícia', idPericia: 2, idPatente: 3 }),
        // new ('', '', new RequisitoFicha((personagem: Personagem) => { 
        //     return personagem.pericias.some(pericia => pericia.refPericia.id === 2 && pericia.refPatente.id >= 4);
        // })),

        // FURT //

        new HabilidadeAtiva('Esconder', 'Te torna Despercebido contra seres que não tem Linha de Visão de você', { fonte: 'Habilidade de Perícia', idPericia: 3, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Esconder', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 1, idPericia: 3 }] }], }]),
        new HabilidadePassiva('Gatuno', 'Uma vez por turno, você pode utilizar a Ação Esconder como Ação Livre', { fonte: 'Habilidade de Perícia', idPericia: 3, idPatente: 2 }),
        // new HabilidadeAtiva('Ataque Furtivo', 'Esse ataque recebe (P.FURT * 10)% de Variância reduzida', { fonte: 'Habilidade de Perícia', idPericia: 3, idPatente: 3 }),
        new HabilidadePassiva('Rastejando nas Sombras', 'Anula as Penalidades de Deslocamento do estado Escondido', { fonte: 'Habilidade de Perícia', idPericia: 3, idPatente: 4 }),

        // INIC //

        new HabilidadePassiva('Próativo', 'Define sua Ordem de Ação em Turnos de Combate', { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 1 }),
        new HabilidadeAtiva('Saque Rápido', 'Realiza uma Ação de Sacar ou Ação de Guardar', { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 2 }),
        // new Habilidade('Preparar Ação Simples', '', { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 2 }),
        new HabilidadePassiva('Iniciativa Aprimorada', 'Você recebe +5 INIC na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 3 }),
        // new Habilidade('Preparar Ação Complexa', '', { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 3 }),
        new HabilidadePassiva('Saque Súbito', 'Melhora a Ação Saque Rápido', { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 4 }),

        // PONT //

        new HabilidadePassiva('Realizar Ataque a Distância', 'Você pode executar Ataques com Armas de Ataque a Distância', { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 1 }),
        new HabilidadePassiva('Proficiência com Armas a Distância Simples', 'Você pode utilizar Armas de Ataque a Distância Simples', { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 2 }),
        new HabilidadePassiva('Ponto Cego', 'Você recebe uma Vantagem quando atacando um Alvo estando em Posição de Vantagem', { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 2 }),
        new HabilidadePassiva('Proficiência com Armas a Distância Complexas', 'Você pode utilizar Armas de Ataque a Distância Complexas', { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 3 }),
        new HabilidadeAtiva('Mirar', 'Você remove Penalidades de Linha de Fogo em seu próximo Ataque', { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 3 }),
        new HabilidadePassiva('Proficiência com Armas a Distância Especiais', 'Você pode utilizar Armas de Ataque a Distância Especiais', { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 4 }),
        new HabilidadePassiva('Analista de Armas a Distância', 'Você sabe dizer a Patente e Categoria de uma Arma de Ataque a Distância na qual tem Visão', { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 4 }),

        // REFL //

        new HabilidadeAtiva('Reagir com Reflexo', 'Você soma seu Bônus de REFL na sua Defesa contra um Ataque', { fonte: 'Habilidade de Perícia', idPericia: 6, idPatente: 1 }),
        new HabilidadeAtiva('Pular na Frente', 'Você recebe um Ataque no lugar de um Alvo', { fonte: 'Habilidade de Perícia', idPericia: 6, idPatente: 2 }),
        new HabilidadeAtiva('Reflexo Aprimorado', 'Você recebe +5 REFL na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 6, idPatente: 3 }),
        new HabilidadePassiva('Potencializar Esquiva', 'Você substitui o Bônus de Reagir com Reflexo por um Teste REFL para somar na sua Defesa. Isso consome uma Ação de Movimento do seu próximo Turno', { fonte: 'Habilidade de Perícia', idPericia: 6, idPatente: 3 }),
        new HabilidadePassiva('Instinto de Batalha', 'Você recebe uma Reação Adicional', { fonte: 'Habilidade de Perícia', idPericia: 6, idPatente: 4 }).adicionarModificadores([{ nome: 'Instinto de Batalha', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 58, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 1 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),

        // ATLE //

        new HabilidadeAtiva('Manobra de Combate', 'Você realiza uma das Manobras de Combate contra o Alvo', { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Manobra de Combate', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 2, idPericia: 7 }] }], }]),
        new HabilidadePassiva('Proficiência com Proteções Simples', 'Você pode utilizar Proteções Simples', { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 2 }),
        new HabilidadeAtiva('Ação Rápida', 'Você recebe uma Ação de Movimento Extra', { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 2 }).adicionarAcoes([
            {
                props: [{ nome: 'Ação Rápida', idTipoAcao: 1, }, {
                    dadosComportamentoDificuldadeAcao: [{ idPericia: 7, idAtributo: 2 }, { dificuldadeInicial: 10, modificadorDificuldadeInicial: 3, listaModificadoresDificuldade: [2] }],
                }],
                config: (acao) => {
                    acao.adicionarLogicaExecucao(() => {
                        getPersonagemFromContext().estatisticasBuffaveis.execucoes.find(execucao => execucao.refTipoExecucao.id === 3)!.numeroAcoesAtuais++;
                    })
                }
            }
        ]),
        new HabilidadePassiva('Proficiência com Proteções Complexas', 'Você pode utilizar Proteções Complexas', { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 3 }),
        new HabilidadePassiva('Atletismo Aprimorado', 'Você recebe +5 ATLE na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 3 }),
        new HabilidadeAtiva('Explosão de Adrenalina', 'Você Anula as Penalidades de Deslocamento por Sobrepeso até o Início do seu próximo Turno', { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 3 }),
        new HabilidadePassiva('Proficiência com Proteções Especiais', 'Você pode utilizar Proteções Especiais', { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 4 }),
        new HabilidadeAtiva('Esforço Máximo', 'Você recebe +1 de AGI, FOR ou VIG, enquanto mantem o Efeito', { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 4 }),

        // LUTA //

        new HabilidadePassiva('Realizar Ataque Corpo-a-Corpo', 'Você pode executar Ataques com Armas de Ataque Corpo-a-Corpo', { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 1 }),
        new HabilidadePassiva('Proficiência com Armas Corpo-a-Corpo Simples', 'Você pode utilizar Armas de Ataque a Corpo-a-Corpo Simples', { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 2 }),
        new HabilidadePassiva('Flanquear', 'Você recebe uma Vantagem quando atacando um Alvo estando em Posição de Vantagem', { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 2 }),
        new HabilidadePassiva('Proficiência com Armas Corpo-a-Corpo Complexas', 'Você pode utilizar Armas de Ataque a Corpo-a-Corpo Complexas', { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 3 }),
        // new HabilidadeAtiva('Parry', '', { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 3 }),
        new HabilidadePassiva('Proficiência com Armas Corpo-a-Corpo Especiais', 'Você pode utilizar Armas de Ataque a Corpo-a-Corpo Especiais', { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 4 }),
        new HabilidadePassiva('Analista de Armas Corpo-a-Corpo', 'Você sabe dizer a Patente e Categoria de uma Arma de Ataque a Corpo-a-Corpo na qual tem Visão', { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 4 }),

        // ADES //

        new HabilidadeAtiva('Comunicação Instintiva', 'Você se comunica com um Ser Racional', { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Comunicação Instintiva', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 9 }] }], }]),
        new HabilidadeAtiva('Domesticar', 'Você melhora o Nível de Domesticação de um Ser Racional', { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Domesticar', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 9 }] }], }]),
        new HabilidadeAtiva('Comando Simples', 'Você Comanda um Ser Domesticado', { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 2 }),
        new HabilidadePassiva('Adestramento Aprimorado', 'Você recebe +5 ADES na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 3 }),
        new HabilidadeAtiva('Comando Avançado', 'Você Comanda um Ser Domesticado', { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 3 }),
        new HabilidadePassiva('Especialidade', 'Um Ser Domesticado pode escolher uma Especialidade', { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 4 }),

        // ARTE //

        new HabilidadeAtiva('Execução Artística', 'Você realiza um trabalho ou execução artística', { fonte: 'Habilidade de Perícia', idPericia: 10, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Execução Artística', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 10 }] }], }]),
        new HabilidadePassiva('No Holofote', 'Você reduz V.ARTE de todos os testes de inimigos', { fonte: 'Habilidade de Perícia', idPericia: 10, idPatente: 2 }),
        new HabilidadePassiva('Graciosidade', 'Seu Teste recebe P.ARTE como bônus', { fonte: 'Habilidade de Perícia', idPericia: 10, idPatente: 3 }),
        new HabilidadeAtiva('Arte Acolhedora', 'Você realiza um Teste ARTE para Acalmar', { fonte: 'Habilidade de Perícia', idPericia: 10, idPatente: 3 }).adicionarAcoes([{ props: [{ nome: 'Arte Acolhedora', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 10 }] }], }]),
        new HabilidadePassiva('Criatividade Produtiva', 'Reduz o uso de uma Habilidade de ARTE em um passo (uma vez por turno)', { fonte: 'Habilidade de Perícia', idPericia: 10, idPatente: 4 }),

        // ATUA //

        new HabilidadeAtiva('Sabichão', 'Você relembra de informações de um assunto e traça paralelos com acontecimentos ou informações relevantes', { fonte: 'Habilidade de Perícia', idPericia: 11, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Sabichão', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 11 }] }], }]),
        new HabilidadePassiva('Por Dentro das Novidades', 'Quando de frente com um assunto que você não conhece, com o tempo e condições necessárias (explicitadas pelo mestre), você sabe onde pode encontrar fontes de informações sobre', { fonte: 'Habilidade de Perícia', idPericia: 11, idPatente: 2 }),
        new HabilidadePassiva('Atualidades Aprimorada', 'Você recebe +5 ATUA na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 11, idPatente: 3 }),
        new HabilidadePassiva('Noticia do Dia', 'Uma vez por dia, você procura e encontra informações sobre locais e acontecimentos distantes. A dificuldade da situação aumenta o tempo necessário para execução', { fonte: 'Habilidade de Perícia', idPericia: 11, idPatente: 3 }),
        new HabilidadeAtiva('Procurando Respostas', 'Você continuamente junta informações por um período de tempo, acumulando testes entre usos até esgotar essa fonte de informação', { fonte: 'Habilidade de Perícia', idPericia: 11, idPatente: 4 }).adicionarAcoes([{ props: [{ nome: 'Procurando Respostas', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 11 }] }], }]),

        // CIEN //

        new HabilidadePassiva('Manuseio de Substâncias Mundanas', 'Permite uso de Substâncias Simples', { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 1 }),
        new HabilidadeAtiva('Conhecimento Científico', 'Você analisa e recebe informações sobre um material ciêntifico', { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Conhecimento Científico', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 12 }] }], }]),
        new HabilidadePassiva('Manuseio de Substâncias Simples', 'Permite criação de Substâncias Simples e uso de Substâncias Complexas', { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 2 }),
        new HabilidadeAtiva('Domínio Científico', 'Você utiliza materiais e ferramentas para confecção de uma substância ciêntifica', { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Domínio Científico', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 12 }] }], }]),
        new HabilidadePassiva('Manuseio de Substâncias Complexas', 'Permite criação de Substâncias Complexas e uso de Substâncias Especiais', { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 3 }),
        new HabilidadePassiva('Estação de Trabalho Científica', 'Você passa uma grande quantidade de tempo para construir um local apropriado para a confecção de substâncias melhores', { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 3 }),
        new HabilidadePassiva('Manuseio de Substâncias Especiais', 'Permite criação de Substâncias Especiais', { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 4 }),
        new HabilidadePassiva('Abundância Científica', 'Você extrai possíveis materiais ciêntificos de objetos ou materiais', { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 4 }),

        // ENGE //

        new HabilidadeAtiva('Manutenção', 'Usa de recursos de manutenção para evitar danos permantentes em objetos', { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Manutenção', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 13 }] }], }]),
        new HabilidadeAtiva('Confecção', 'Cria e troca características de objetos', { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Confecção', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 13 }] }], }]),
        new HabilidadePassiva('Estação de Trabalho Metalurgica', 'Você passa uma grande quantidade de tempo para construir um local apropriado para a confecção de itens melhores', { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 3 }),
        new HabilidadeAtiva('Desmantelar', 'Destroi itens e recupera seus materiais de construção', { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 3 }).adicionarAcoes([{ props: [{ nome: 'Desmantelar', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 13 }] }], }]),
        new HabilidadePassiva('Criatividade Instável', 'Cria características de Arma', { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 4 }),

        // INVE //

        new HabilidadeAtiva('Procurar por Pistas', 'Recebe informações escondidas', { fonte: 'Habilidade de Perícia', idPericia: 14, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Procurar por Pistas', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 14 }] }], }]),
        new HabilidadePassiva('Opinião Auxiliar', 'Faz com que um Aliado tenha o seu B.INVE (só pode usar em Cena de Investigação)', { fonte: 'Habilidade de Perícia', idPericia: 14, idPatente: 2 }),
        new HabilidadePassiva('Conhecimento Especializado', 'Você pode utilizar de outras Perícias como um teste de INIC, sob aprovação do Mestre', { fonte: 'Habilidade de Perícia', idPericia: 14, idPatente: 2 }),
        new HabilidadePassiva('Investigação Otimizada', 'Você possui uma Ação Investigativa Adicional', { fonte: 'Habilidade de Perícia', idPericia: 14, idPatente: 3 }),
        new HabilidadeAtiva('Na Pista Certa', 'Você recebe as informações de sua investigação e uma dica que o leva para a próxima informação, se houver', { fonte: 'Habilidade de Perícia', idPericia: 14, idPatente: 4 }).adicionarAcoes([{ props: [{ nome: 'Na Pista Certa', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 14 }] }], }]),

        // MEDI //

        new HabilidadeAtiva('Estancar', 'Diminui a Dificuldade de Primeiro Socorros de um alvo Morrendo', { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Estancar', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 15 }] }], }]),
        new HabilidadeAtiva('Primeiros Socorros', 'Você recupera 1 P.V. do alvo e retira o estado Morrendo', { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Primeiros Socorros', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 15 }] }], }]),
        new HabilidadeAtiva('Fechar Ferida', 'Você recupera B.MEDI P.V.s do alvo', { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 2 }),
        new HabilidadePassiva('Medicina Aprimorada', 'Você recebe +5 MEDI na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 3 }),
        new HabilidadeAtiva('Tratamento Intensivo', 'Você recupera metade dos PVs do alvo e remove suas Condições Negativas. O tempo necessário de ação é relativo ao nível dos danos do alvos, e ambos alvo e usuário não podem agir durante a duração', { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 3 }),
        new HabilidadeAtiva('Cuidados Médicos', 'Você melhora os usos de Fechar Ferida', { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 4 }),
        new HabilidadeAtiva('Cirurgia Improvisada', 'Você trata feridas graves, como amputações. O tempo necessário de ação é relativo ao nível dos danos do alvos, e ambos alvo e usuário não podem agir durante a duração', { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 4 }),

        // OCUL //

        new HabilidadeAtiva('Sentir Anomalia', 'Você recebe informações sobre Auras próximas de você', { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Sentir Anomalia', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 16 }] }], }]),
        new HabilidadeAtiva('Expandir Aura', 'Você espande sua Aura para seus arredores', { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 2 }),
        new HabilidadeAtiva('Identificar Símbolo', 'Você recebe informações sobre um Símbolo', { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Identificar Símbolo', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 16 }] }], }]),
        new HabilidadeAtiva('Memória do Outro Lado', 'Você recebe informações sobre uma Criatura', { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Memória do Outro Lado', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 16 }] }], }]),
        new HabilidadePassiva('Ocultismo Aprimorado', 'Você recebe +5 OCUL na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 3 }),
        new HabilidadeAtiva('Fortalecer Aura', 'Você e todos os seus aliados recebem P.OCUL como resistência paranormal bônus por INT turnos', { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 3 }),
        new HabilidadeAtiva('Sentir Membrana', 'Você recebe informações sobre a Membrana do Ambiente', { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 4 }).adicionarAcoes([{ props: [{ nome: 'Sentir Membrana', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 16 }] }], }]),
        new HabilidadePassiva('Ação Ritualística', 'Você Recebe uma Ação Ritualística Bônus', { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 4 }),

        // SOBR //

        new HabilidadeAtiva('Meios de Sobreviver', 'Você aplica conhecimentos naturais, como comportamento animal, seguir pegadas, entre outros', { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Meios de Sobreviver', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 17 }] }], }]),
        new HabilidadeAtiva('Improvisar Ferramenta', 'Você temporariamente cria, concerta ou improvisa uma ferramenta ou situação para um problema. A qualidade e efetividade do resultado nunca será tão alto quanto de um item especifico para a situação', { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Improvisar Ferramenta', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 17 }] }], }]),
        new HabilidadePassiva('Sobrevivência Aprimorada', 'Você recebe +5 SOBR na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 3 }),
        new HabilidadeAtiva('Armar Armadilha', 'Você constroi uma armadilha improvisada na sua posição atual. Quando um alvo despercebido que falhar um teste PERC se mover por cima da armadilha, fica imóvel e precisa de uma ação completa para se soltar', { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 3 }).adicionarAcoes([{ props: [{ nome: 'Armar Armadilha', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 17 }] }], }]),
        new HabilidadePassiva('Instinto de Caçador', 'Você evita o efeito de uma falha uma de teste SOBR uma vez por cena, postergando a falha e tentando novamente no próximo turno', { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 4 }),
        new HabilidadeAtiva('Improvisar Ambiente', 'Você improvisa e/ou soluciona uma condição negativa com materiais comuns, como diminuir efeitos naturais, de mobilidade ou de perigo de vida', { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 4 }).adicionarAcoes([{ props: [{ nome: 'Improvisar Ambiente', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 17 }] }], }]),

        // TATI //

        new HabilidadeAtiva('Analisar Terreno', 'Você identifica possíveis Efeitos Positivos ou Negativos em um ambiente', { fonte: 'Habilidade de Perícia', idPericia: 18, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Analisar Terreno', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 18 }] }], }]),
        new HabilidadeAtiva('Analisar Fraqueza', 'Você descobre qual a menor e maior perícias de resistência do alvo. Cada vez que usar, você pode escolher 1 tipo de R.D. para saber o valor atual', { fonte: 'Habilidade de Perícia', idPericia: 18, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Analisar Fraqueza', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 18 }] }], }]),
        new HabilidadeAtiva('Estrategista do Grupo', 'Você e todos os seus aliados recebem P.TATI como defesa bônus por INT turnos', { fonte: 'Habilidade de Perícia', idPericia: 18, idPatente: 3 }),
        new HabilidadePassiva('Táticas de Combate', 'Você recebe uma Reação Adicional', { fonte: 'Habilidade de Perícia', idPericia: 18, idPatente: 4 }).adicionarModificadores([{ nome: 'Táticas de Combate', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 58, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 1 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),

        // TECN //

        new HabilidadeAtiva('Manusear Maquinário', 'Você utiliza de um sistema digital', { fonte: 'Habilidade de Perícia', idPericia: 19, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Manusear Maquinário', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 19 }] }], }]),
        new HabilidadeAtiva('Hacker', 'Você realiza um teste para invadir um sistema digital. Se você não tiver sucesso, você ao menos sabe a DT do teste', { fonte: 'Habilidade de Perícia', idPericia: 19, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Hacker', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 19 }] }], }]),
        new HabilidadeAtiva('Improvisar Equipamentos', 'Você monta um sistema digital temporario', { fonte: 'Habilidade de Perícia', idPericia: 19, idPatente: 3 }).adicionarAcoes([{ props: [{ nome: 'Improvisar Equipamentos', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 19 }] }], }]),
        new HabilidadeAtiva('Preparar Mecanismo', 'Você monta um mecanismo automático', { fonte: 'Habilidade de Perícia', idPericia: 19, idPatente: 4 }).adicionarAcoes([{ props: [{ nome: 'Preparar Mecanismo', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 3, idPericia: 19 }] }], }]),

        // DIPL //

        new HabilidadeAtiva('Melhorar Relacionamento', 'Você melhora seu nível de relacionamento com esse ser', { fonte: 'Habilidade de Perícia', idPericia: 20, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Melhorar Relacionamento', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 4, idPericia: 20 }] }], }]),
        new HabilidadeAtiva('Acalmar', 'Você retira um Ser de Enlouquecendo', { fonte: 'Habilidade de Perícia', idPericia: 20, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Acalmar', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 44, idPericia: 20 }] }], }]),
        new HabilidadePassiva('Voz da Paz', 'Se você falhar, recebe +5 DIPL na próxima tentativa, acumulando entre usos', { fonte: 'Habilidade de Perícia', idPericia: 20, idPatente: 3 }),
        new HabilidadePassiva('Ressoar da Alma', 'Você dobra a melhoria do Nível de Relacionamento ou da redução do Nível de Medo quando usando DIPL', { fonte: 'Habilidade de Perícia', idPericia: 20, idPatente: 4 }),

        // ENGA //

        new HabilidadeAtiva('Esconder Informação', 'Você realiza ações ou redige informação que não condizem com a verdade', { fonte: 'Habilidade de Perícia', idPericia: 21, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Esconder Informação', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 4, idPericia: 21 }] }], }]),
        new HabilidadeAtiva('Disfarce Realista', 'Você estuda e replica um padrão de uniforme ou identificação', { fonte: 'Habilidade de Perícia', idPericia: 21, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Disfarce Realista', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 44, idPericia: 21 }] }], }]),
        new HabilidadePassiva('Ventriloquismo', 'Você simula a voz de alguém que já ouviu, em condição e distâncias variadas, recebendo +10 ENGA enquanto não descoberto', { fonte: 'Habilidade de Perícia', idPericia: 21, idPatente: 3 }),
        // new HabilidadePassiva('Na palma da minha mão', '', { fonte: 'Habilidade de Perícia', idPericia: 21, idPatente: 4 }),

        // INTI //

        new HabilidadeAtiva('Intimidar', 'O Alvo possui uma desvantagem contra qualquer teste que realize contra você até o início do seu próximo turno', { fonte: 'Habilidade de Perícia', idPericia: 22, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Intimidar', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 4, idPericia: 22 }] }], }]),
        new HabilidadePassiva('Alguem do seu Tamanho', 'Você pode Reagir a um Intimidar, também executando um Intimidar no alvo', { fonte: 'Habilidade de Perícia', idPericia: 22, idPatente: 2 }),
        new HabilidadePassiva('Intimidação Aprimorada', 'Você recebe +5 INTI na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 22, idPatente: 3 }),
        new HabilidadePassiva('Vai encarar', 'Intimidar passa a durar P.INTI turnos', { fonte: 'Habilidade de Perícia', idPericia: 22, idPatente: 3 }),
        new HabilidadePassiva('Presença Amedrontadora', 'Intimidar passa a custar Ação de Movimento', { fonte: 'Habilidade de Perícia', idPericia: 22, idPatente: 4 }),

        // INTU //

        new HabilidadeAtiva('Julgar', 'Você ', { fonte: 'Habilidade de Perícia', idPericia: 23, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Julgar', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 4, idPericia: 23 }] }], }]),
        // new HabilidadePassiva('Argumentação Conjunta', '', { fonte: 'Habilidade de Perícia', idPericia: 23, idPatente: 2 }),
        new HabilidadePassiva('Intuição Aprimorada', 'Você recebe +5 INTU na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 23, idPatente: 3 }),
        new HabilidadePassiva('Verdade à Tona', 'Julgar com sucesso um Ser aplica -5 ENGA até o fim da cena', { fonte: 'Habilidade de Perícia', idPericia: 23, idPatente: 3 }),
        // new HabilidadePassiva('Devorador de Mentiras', '', { fonte: 'Habilidade de Perícia', idPericia: 23, idPatente: 4 }),

        // PERC //

        new HabilidadeAtiva('Analisar Arredores', 'Você recebe informações sobre algo na qual tenha linha de visão', { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 1 }).adicionarAcoes([{ props: [{ nome: 'Analisar Arredores', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 4, idPericia: 24 }] }], }]),
        new HabilidadeAtiva('Analisar Comportamento', 'Você recebe informações sobre um Ser ou uma Ação desse Ser', { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 2 }).adicionarAcoes([{ props: [{ nome: 'Analisar Comportamento', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 4, idPericia: 24 }] }], }]),
        new HabilidadePassiva('Percepção Aprimorada', 'Você recebe +5 PERC na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 3 }),
        new HabilidadeAtiva('Chamar por Atenção', 'Personagens aliados que realizarem PERC no mesmo alvo que você, compartilham o maior bônus de PERC entre vocês', { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 3 }),
        new HabilidadePassiva('Olhos na Nuca', 'Você tem um segundo teste contra efeitos que requerem você Despercebido', { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 4 }),
        new HabilidadePassiva('Detecção Infalível', 'Você pode usar a habilidade Analisar Comportamento como Reação a uma Ação acontecendo em Alcance Médio', { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 4 }),

        // VONT //

        new HabilidadePassiva('Mente Resistente', 'Você reage a um Efeito Negativo usando VONT', { fonte: 'Habilidade de Perícia', idPericia: 25, idPatente: 1 }),
        new HabilidadePassiva('Afeição Paranormal', 'Você recebe uma Vantagem quando resistindo a Presença Pertubadora de um Elemento Pertencente', { fonte: 'Habilidade de Perícia', idPericia: 25, idPatente: 2 }),
        new HabilidadePassiva('Vontade Aprimorada', 'Você recebe +5 VONT na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 25, idPatente: 3 }),
        new HabilidadePassiva('Mente Inabalável', 'Você recebe uma Vantagem quando resistindo a Dano Mental', { fonte: 'Habilidade de Perícia', idPericia: 25, idPatente: 3 }),
        new HabilidadeAtiva('Estabilidade Mental', 'Você permanece com 1 P.S.', { fonte: 'Habilidade de Perícia', idPericia: 25, idPatente: 4 }).adicionarAcoes([{ props: [{ nome: 'Estabilidade Mental', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 4, idPericia: 25 }] }], }]),

        // FORT //

        new HabilidadePassiva('Corpo Resistente', 'Você reage a um Efeito Negativo usando FORT', { fonte: 'Habilidade de Perícia', idPericia: 26, idPatente: 1 }),
        new HabilidadePassiva('Reagir com Fortitude', 'Você soma seu Bônus de FORT na sua Defesa contra um Ataque', { fonte: 'Habilidade de Perícia', idPericia: 26, idPatente: 1 }),
        new HabilidadeAtiva('Aprimorar Resistência', 'Você recebe R.D. a um Tipo de Dano Mundano até o início do seu próximo Turno', { fonte: 'Habilidade de Perícia', idPericia: 26, idPatente: 2 }),
        new HabilidadePassiva('Fortitude Aprimorada', 'Você recebe +5 FORT na sua próxima tentativa de uma Ação Falha', { fonte: 'Habilidade de Perícia', idPericia: 26, idPatente: 3 }),
        new HabilidadeAtiva('Negar a Morte', 'Você permanece com 1 P.V.', { fonte: 'Habilidade de Perícia', idPericia: 26, idPatente: 4 }).adicionarAcoes([{ props: [{ nome: 'Negar a Morte', idTipoAcao: 1 }, { dadosComportamentoDificuldadeAcao: [{ idAtributo: 5, idPericia: 26 }] }], }]),

        // // Classes //

        // new HabilidadePassiva('Amante de Armas', 'Você recebe a Patente da Perícia de sua Arma como Pontos de Características bônus', new RequisitoFicha((personagem: Personagem) => {
        //     return personagem.detalhes.refClasse.id === 2
        // })).adicionarModificadores([{ nome: 'Amante de Armas', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 63, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 1 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),
        // new HabilidadePassiva('O Melhor da Turma', 'Você recebe o Atributo da Perícia como Bônus da Perícia', new RequisitoFicha((personagem: Personagem) => {
        //     return personagem.detalhes.refClasse.id === 3
        // })),
        // new HabilidadePassiva('Constituição Paranormal', 'Reduz o Gasto de P.E. de Rituais', new RequisitoFicha((personagem: Personagem) => {
        //     return personagem.detalhes.refClasse.id === 4
        // })).adicionarModificadores([{ nome: 'Constituição Paranormal', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 62, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: getPersonagemFromContext().pericias.find(pericia => pericia.refPericia.id === 16)?.valorNivelPatente } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),
        // new HabilidadePassiva('Mente Corrompida', 'Aumenta +5 OCUL', new RequisitoFicha((personagem: Personagem) => {
        //     return personagem.detalhes.refClasse.id === 4
        // })).adicionarModificadores([{ nome: 'Mente Corrompida', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 24, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 5 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),
        // new HabilidadePassiva('Ocultismo Morfológico', '', new RequisitoFicha((personagem: Personagem) => {
        //     return personagem.detalhes.refClasse.id === 4
        // })),

        // // Habilidades Especiais //

        new HabilidadePassiva('Experiência com Armas', 'Você recebe um Ponto de Característica de Arma Bônus', { fonte: 'Habilidade Especial', tipo: 'Mundana' }).adicionarModificadores([{ nome: 'Experiência com Armas', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 63, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 1 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),
    ];
}