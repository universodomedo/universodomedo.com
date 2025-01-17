// #region Imports
import { adicionarAcoesUtil, Acao, RequisitoFicha, Personagem, CustoExecucao, FiltroProps, FiltroPropsItems, EmbrulhoComportamentoHabilidade, Modificador, adicionarModificadoresUtil, OpcoesFiltro, OpcoesFiltrosCategorizadas, Pericia, PatentePericia, Proficiencia, DadosGenericosHabilidade, DadosGenericosHabilidadeParams } from 'Types/classes/index.ts';

import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
// #endregion

export abstract class Habilidade {
    public dados: DadosGenericosHabilidade;
    public comportamentos: EmbrulhoComportamentoHabilidade = new EmbrulhoComportamentoHabilidade();

    public requisitoFicha?: RequisitoFicha;
    public dadosProficiencia?: ConstructorParameters<typeof Proficiencia>[0];
    private _fonteHabilidade: FonteHabilidade;

    public svg: string = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+';
    protected abstract _habilidadeAtivaOuPassiva: 1 | 2;

    constructor({ dadosGenericosHabilidade, fonteHabilidade, requisitoFicha, dadosProficiencia }: { dadosGenericosHabilidade: DadosGenericosHabilidadeParams, fonteHabilidade: FonteHabilidade, requisitoFicha?: RequisitoFicha, dadosProficiencia?: ConstructorParameters<typeof Proficiencia>[0] }) {
        this.dados = new DadosGenericosHabilidade(dadosGenericosHabilidade);

        this._fonteHabilidade = fonteHabilidade;
        if (fonteHabilidade.fonte === 'Habilidade de Perícia') {
            const habilidadePericia = this._fonteHabilidade as { fonte: 'Habilidade de Perícia'; idPericia: number; idPatente: number };
            this.requisitoFicha = new RequisitoFicha((personagem: Personagem) => {
                return personagem.pericias.some(pericia =>
                    pericia.refPericia.id === habilidadePericia.idPericia &&
                    pericia.refPatente.id >= habilidadePericia.idPatente
                );
            });
        } else {
            if (requisitoFicha !== undefined) this.requisitoFicha = requisitoFicha;
        }

        if (dadosProficiencia !== undefined) this.dadosProficiencia = dadosProficiencia;
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

    get nomeExibicao(): string { return this.dados.nome };

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
                    new OpcoesFiltro([{ id: 1, nome: 'Ativa' }, { id: 2, nome: 'Passiva' }]),
                ),
                new FiltroPropsItems<Habilidade>(
                    (habilidade) => habilidade.refOpcionalPericia?.id,
                    'Fonte da Habilidade',
                    'Selecione a Fonte da Habilidade',
                    'select',
                    true,
                    new OpcoesFiltrosCategorizadas(
                        [
                            { categoria: 'Habilidades de Perícia', opcoes: new OpcoesFiltro(getPersonagemFromContext().pericias.map(pericia => ({ id: pericia.refPericia.id, nome: `Habilidades de ${pericia.refPericia.nomeAbrev}` }))), },
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

    adicionarAcoes(acoes: { props: ConstructorParameters<typeof Acao>[0], config?: (acao: Acao) => void }[]): this { return (adicionarAcoesUtil(this, this.acoes, acoes), this); }
}

export class HabilidadePassiva extends Habilidade {
    protected _modificadores: Modificador[] = [];
    get modificadores(): Modificador[] { return this._modificadores; }
    protected _habilidadeAtivaOuPassiva = 2 as const;

    adicionarModificadores(propsModificadores: ConstructorParameters<typeof Modificador>[0][]): this { return (adicionarModificadoresUtil(this, this._modificadores, propsModificadores), this); }
}

export type FonteHabilidade = { fonte: 'Habilidade de Perícia'; idPericia: number; idPatente: number } | { fonte: 'Habilidade Especial'; tipo: 'Classe' | 'Mundana' | 'Paranormal' };

export const lista_geral_habilidades = (): Habilidade[] => {
    return [

        // ACRO //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Movimento Acrobático', descricao: 'Seu próximo Deslocamento ultrapassa obstáculos de variadas alturas' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 1, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Movimento Acrobático', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 1, idPericia: 1 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Impulso Rápido', descricao: 'A Ação Levantar se torna Ação Livre' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 1, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Acrobacia Aprimorada', descricao: 'Você recebe +5 ACRO na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 1, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Movimento Frenético', descricao: 'Aumenta seu Deslocamento em +3' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 1, idPatente: 3 }, }).adicionarModificadores([{ nome: 'Movimento Frenético', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 53, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 3 } }], dadosComportamentos: { dadosComportamentoPassivo: [false] } }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Movimento Não Linear', descricao: 'Você ignora Penalidades de Deslocamento Vertical até o início do seu próximo turno' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 1, idPatente: 4 }, }),

        // CRIM //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Resolver Mecanismo', descricao: 'Você tenta Resolver um Mecanismo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 2, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Resolver Mecanismo', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 1, idPericia: 2 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Surrupiar', descricao: 'Você retira um Item de um Local ou do Inventário de um Ser, sem ser Percebido' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 2, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Surrupiar', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 1, idPericia: 2 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Olho Treinado', descricao: 'Ao falhar em um uso de Resolver Mecanismo, você sabe aproximadamente a Diferença de Dificuldade' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 2, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Crime Aprimorado', descricao: 'Você recebe +5 CRIM na sua próxima tentativa para essa mesma Ação' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 2, idPatente: 3 }, }),
        // new ('', '', new RequisitoFicha((personagem: Personagem) => { 
        //     return personagem.pericias.some(pericia => pericia.refPericia.id === 2 && pericia.refPatente.id >= 4);
        // })),

        // FURT //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Esconder', descricao: 'Te torna Despercebido contra seres que não tem Linha de Visão de você' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 3, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Esconder', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 1, idPericia: 3 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Gatuno', descricao: 'Uma vez por turno, você pode utilizar a Ação Esconder como Ação Livre' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 3, idPatente: 2 }, }),
        // new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Ataque Furtivo', descricao: 'Esse ataque recebe (P.FURT * 10)% de Variância reduzida' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 3, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Rastejando nas Sombras', descricao: 'Anula as Penalidades de Deslocamento do estado Escondido' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 3, idPatente: 4 }, }),

        // INIC //

        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Próativo', descricao: 'Define sua Ordem de Ação em Turnos de Combate' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 1 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Saque Rápido', descricao: 'Realiza uma Ação de Sacar ou Ação de Guardar' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 2 }, }),
        // new Habilidade('P{ dadosGenericosHabilidade: { nome: reparar Ação Simples', descricao: '' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Iniciativa Aprimorada', descricao: 'Você recebe +5 INIC na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 3 }, }),
        // new Habilidade('P{ dadosGenericosHabilidade: { nome: reparar Ação Complexa', descricao: '' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Saque Súbito', descricao: 'Melhora a Ação Saque Rápido' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 4, idPatente: 4 }, }),

        // PONT //

        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Realizar Ataque a Distância', descricao: 'Você pode executar Ataques com Armas de Ataque a Distância' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 1 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Armas de Ataque à Distância Simples', descricao: 'Você pode utilizar Armas de Ataque a Distância Simples' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 2 }, dadosProficiencia: { idTipoProficiencia: 2, idNivelProficiencia: 1 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Ponto Cego', descricao: 'Você recebe uma Vantagem quando atacando um Alvo estando em Posição de Vantagem' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Armas de Ataque à Distância Complexas', descricao: 'Você pode utilizar Armas de Ataque a Distância Complexas' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 3 }, dadosProficiencia: { idTipoProficiencia: 2, idNivelProficiencia: 2 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Mirar', descricao: 'Você remove Penalidades de Linha de Fogo em seu próximo Ataque' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Armas de Ataque à Distância Especiais', descricao: 'Você pode utilizar Armas de Ataque a Distância Especiais' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 4 }, dadosProficiencia: { idTipoProficiencia: 2, idNivelProficiencia: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Analista de Armas a Distância', descricao: 'Você sabe dizer a Patente e Categoria de uma Arma de Ataque a Distância na qual tem Visão' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 5, idPatente: 4 }, }),

        // REFL //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Reagir com Reflexo', descricao: 'Você soma seu Bônus de REFL na sua Defesa contra um Ataque' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 6, idPatente: 1 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Pular na Frente', descricao: 'Você recebe um Ataque no lugar de um Alvo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 6, idPatente: 2 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Reflexo Aprimorado', descricao: 'Você recebe +5 REFL na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 6, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Potencializar Esquiva', descricao: 'Você substitui o Bônus de Reagir com Reflexo por um Teste REFL para somar na sua Defesa. Isso consome uma Ação de Movimento do seu próximo Turno' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 6, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Instinto de Batalha', descricao: 'Você recebe uma Reação Adicional' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 6, idPatente: 4 }, }).adicionarModificadores([{ nome: 'Instinto de Batalha', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 58, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 1 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),

        // ATLE //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Manobra de Combate', descricao: 'Você realiza uma das Manobras de Combate contra o Alvo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Manobra de Combate', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 2, idPericia: 7 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Proteções Simples', descricao: 'Você pode utilizar Proteções Simples' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 2 }, dadosProficiencia: { idTipoProficiencia: 3, idNivelProficiencia: 1 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Ação Rápida', descricao: 'Você recebe uma Ação de Movimento Extra' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 2 }, }).adicionarAcoes([{
            props: { dadosGenericosAcao: { nome: 'Ação Rápida', idTipoAcao: 1, }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 2, idPericia: 7 }, dadosDificuldadeDinamica: { dificuldadeInicial: 10, modificadorDificuldadeInicial: 3, listaModificadoresDificuldade: [2] } }, } },
            config: (acao) => {
                acao.adicionarLogicaExecucao(() => {
                    getPersonagemFromContext().estatisticasBuffaveis.execucoes.find(execucao => execucao.refTipoExecucao.id === 3)!.numeroAcoesAtuais++;
                })
            }
        }
        ]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Proteções Complexas', descricao: 'Você pode utilizar Proteções Complexas' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 3 }, dadosProficiencia: { idTipoProficiencia: 3, idNivelProficiencia: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Atletismo Aprimorado', descricao: 'Você recebe +5 ATLE na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Explosão de Adrenalina', descricao: 'Você Anula as Penalidades de Deslocamento por Sobrepeso até o Início do seu próximo Turno' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Proteções Especiais', descricao: 'Você pode utilizar Proteções Especiais' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 4 }, dadosProficiencia: { idTipoProficiencia: 3, idNivelProficiencia: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Esforço Máximo', descricao: 'Você recebe +1 de AGI, FOR ou VIG, enquanto mantem o Efeito' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 7, idPatente: 4 }, }),

        // LUTA //

        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Realizar Ataque Corpo-a-Corpo', descricao: 'Você pode executar Ataques com Armas de Ataque Corpo-a-Corpo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 1 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Armas Corpo-a-Corpo Simples', descricao: 'Você pode utilizar Armas de Ataque a Corpo-a-Corpo Simples' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 2 }, dadosProficiencia: { idTipoProficiencia: 1, idNivelProficiencia: 1 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Flanquear', descricao: 'Você recebe uma Vantagem quando atacando um Alvo estando em Posição de Vantagem' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Armas Corpo-a-Corpo Complexas', descricao: 'Você pode utilizar Armas de Ataque a Corpo-a-Corpo Complexas' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 3 }, dadosProficiencia: { idTipoProficiencia: 1, idNivelProficiencia: 2 }, }),
        // new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Parry', descricao: '' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Armas Corpo-a-Corpo Especiais', descricao: 'Você pode utilizar Armas de Ataque a Corpo-a-Corpo Especiais' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 4 }, dadosProficiencia: { idTipoProficiencia: 1, idNivelProficiencia: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Analista de Armas Corpo-a-Corpo', descricao: 'Você sabe dizer a Patente e Categoria de uma Arma de Ataque a Corpo-a-Corpo na qual tem Visão' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 8, idPatente: 4 }, }),

        // ADES //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Comunicação Instintiva', descricao: 'Você se comunica com um Ser Racional' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Comunicação Instintiva', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 9 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Domesticar', descricao: 'Você melhora o Nível de Domesticação de um Ser Racional' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Domesticar', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 9 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Comando Simples', descricao: 'Você Comanda um Ser Domesticado' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Adestramento Aprimorado', descricao: 'Você recebe +5 ADES na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Comando Avançado', descricao: 'Você Comanda um Ser Domesticado' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Especialidade', descricao: 'Um Ser Domesticado pode escolher uma Especialidade' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 9, idPatente: 4 }, }),

        // ARTE //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Execução Artística', descricao: 'Você realiza um trabalho ou execução artística' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 10, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Execução Artística', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 10 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'No Holofote', descricao: 'Você reduz V.ARTE de todos os testes de inimigos' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 10, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Graciosidade', descricao: 'Seu Teste recebe P.ARTE como bônus' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 10, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Arte Acolhedora', descricao: 'Você realiza um Teste ARTE para Acalmar' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 10, idPatente: 3 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Arte Acolhedora', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 10 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Criatividade Produtiva', descricao: 'Reduz o uso de uma Habilidade de ARTE em um passo (uma vez por turno)' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 10, idPatente: 4 }, }),

        // ATUA //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Sabichão', descricao: 'Você relembra de informações de um assunto e traça paralelos com acontecimentos ou informações relevantes' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 11, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Sabichão', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 11 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Por Dentro das Novidades', descricao: 'Quando de frente com um assunto que você não conhece, com o tempo e condições necessárias (explicitadas pelo mestre), você sabe onde pode encontrar fontes de informações sobre' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 11, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Atualidades Aprimorada', descricao: 'Você recebe +5 ATUA na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 11, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Noticia do Dia', descricao: 'Uma vez por dia, você procura e encontra informações sobre locais e acontecimentos distantes. A dificuldade da situação aumenta o tempo necessário para execução' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 11, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Procurando Respostas', descricao: 'Você continuamente junta informações por um período de tempo, acumulando testes entre usos até esgotar essa fonte de informação' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 11, idPatente: 4 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Procurando Respostas', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 11 } } } }, }]),

        // CIEN //

        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Substâncias Mundanas', descricao: 'Permite uso de Substâncias Simples' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 1 }, dadosProficiencia: { idTipoProficiencia: 4, idNivelProficiencia: 1 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Conhecimento Científico', descricao: 'Você analisa e recebe informações sobre um material ciêntifico' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Conhecimento Científico', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 12 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Substâncias Simples', descricao: 'Permite criação de Substâncias Simples e uso de Substâncias Complexas' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 2 }, dadosProficiencia: { idTipoProficiencia: 4, idNivelProficiencia: 2 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Domínio Científico', descricao: 'Você utiliza materiais e ferramentas para confecção de uma substância ciêntifica' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Domínio Científico', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 12 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Substâncias Complexas', descricao: 'Permite criação de Substâncias Complexas e uso de Substâncias Especiais' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 3 }, dadosProficiencia: { idTipoProficiencia: 4, idNivelProficiencia: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Estação de Trabalho Científica', descricao: 'Você passa uma grande quantidade de tempo para construir um local apropriado para a confecção de substâncias melhores' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Substâncias Especiais', descricao: 'Permite criação de Substâncias Especiais' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 4 }, dadosProficiencia: { idTipoProficiencia: 4, idNivelProficiencia: 4 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Abundância Científica', descricao: 'Você extrai possíveis materiais ciêntificos de objetos ou materiais' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 12, idPatente: 4 }, }),

        // ENGE //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Manutenção', descricao: 'Usa de recursos de manutenção para evitar danos permantentes em objetos' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Manutenção', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 13 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Confecção Simples', descricao: 'Você pode confeccionar Itens Simples' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 2 }, dadosProficiencia: { idTipoProficiencia: 5, idNivelProficiencia: 1 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Confecção', descricao: 'Cria e troca características de objetos' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Confecção', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 13 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Confecção Complexa', descricao: 'Você pode confeccionar Itens Complexos' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 3 }, dadosProficiencia: { idTipoProficiencia: 5, idNivelProficiencia: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Estação de Trabalho Metalurgica', descricao: 'Você passa uma grande quantidade de tempo para construir um local apropriado para a confecção de itens melhores' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Desmantelar', descricao: 'Destroi itens e recupera seus materiais de construção' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 3 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Desmantelar', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 13 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Proficiência com Confecção Especial', descricao: 'Você pode confeccionar Itens Especiais' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 4 }, dadosProficiencia: { idTipoProficiencia: 5, idNivelProficiencia: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Criatividade Instável', descricao: 'Cria características de Arma' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 13, idPatente: 4 }, }),

        // INVE //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Procurar por Pistas', descricao: 'Recebe informações escondidas' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 14, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Procurar por Pistas', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 14 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Opinião Auxiliar', descricao: 'Faz com que um Aliado tenha o seu B.INVE (só pode usar em Cena de Investigação)' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 14, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Conhecimento Especializado', descricao: 'Você pode utilizar de outras Perícias como um teste de INIC, sob aprovação do Mestre' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 14, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Investigação Otimizada', descricao: 'Você possui uma Ação Investigativa Adicional' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 14, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Na Pista Certa', descricao: 'Você recebe as informações de sua investigação e uma dica que o leva para a próxima informação, se houver' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 14, idPatente: 4 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Na Pista Certa', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 14 } } } }, }]),

        // MEDI //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Estancar', descricao: 'Diminui a Dificuldade de Primeiro Socorros de um alvo Morrendo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Estancar', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 15 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Primeiros Socorros', descricao: 'Você recupera 1 P.V. do alvo e retira o estado Morrendo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Primeiros Socorros', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 15 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Fechar Ferida', descricao: 'Você recupera B.MEDI P.V.s do alvo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Medicina Aprimorada', descricao: 'Você recebe +5 MEDI na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Tratamento Intensivo', descricao: 'Você recupera metade dos PVs do alvo e remove suas Condições Negativas. O tempo necessário de ação é relativo ao nível dos danos do alvos, e ambos alvo e usuário não podem agir durante a duração' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Cuidados Médicos', descricao: 'Você melhora os usos de Fechar Ferida' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 4 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Cirurgia Improvisada', descricao: 'Você trata feridas graves, como amputações. O tempo necessário de ação é relativo ao nível dos danos do alvos, e ambos alvo e usuário não podem agir durante a duração' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 15, idPatente: 4 }, }),

        // OCUL //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Sentir Anomalia', descricao: 'Você recebe informações sobre Auras próximas de você' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Sentir Anomalia', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 16 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Ligação de Primeiro Círculo', descricao: 'Você pode criar Rituais de Primeiro Círculo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 2 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Expandir Aura', descricao: 'Você espande sua Aura para seus arredores' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 2 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Identificar Símbolo', descricao: 'Você recebe informações sobre um Símbolo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Identificar Símbolo', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 16 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Memória do Outro Lado', descricao: 'Você recebe informações sobre uma Criatura' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Memória do Outro Lado', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 16 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Ligação de Segundo Círculo', descricao: 'Você pode criar Rituais de Segundo Círculo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Ocultismo Aprimorado', descricao: 'Você recebe +5 OCUL na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Fortalecer Aura', descricao: 'Você e todos os seus aliados recebem P.OCUL como resistência paranormal bônus por INT turnos' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Ligação de Terceiro Círculo', descricao: 'Você pode criar Rituais de Terceiro Círculo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 4 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Sentir Membrana', descricao: 'Você recebe informações sobre a Membrana do Ambiente' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 4 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Sentir Membrana', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 16 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Ação Ritualística', descricao: 'Você Recebe uma Ação Ritualística Bônus' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 16, idPatente: 4 }, }),

        // SOBR //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Meios de Sobreviver', descricao: 'Você aplica conhecimentos naturais, como comportamento animal, seguir pegadas, entre outros' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Meios de Sobreviver', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 17 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Improvisar Ferramenta', descricao: 'Você temporariamente cria, concerta ou improvisa uma ferramenta ou situação para um problema. A qualidade e efetividade do resultado nunca será tão alto quanto de um item especifico para a situação' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Improvisar Ferramenta', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 17 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Sobrevivência Aprimorada', descricao: 'Você recebe +5 SOBR na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Armar Armadilha', descricao: 'Você constroi uma armadilha improvisada na sua posição atual. Quando um alvo despercebido que falhar um teste PERC se mover por cima da armadilha, fica imóvel e precisa de uma ação completa para se soltar' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 3 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Armar Armadilha', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 17 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Instinto de Caçador', descricao: 'Você evita o efeito de uma falha uma de teste SOBR uma vez por cena, postergando a falha e tentando novamente no próximo turno' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 4 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Improvisar Ambiente', descricao: 'Você improvisa e/ou soluciona uma condição negativa com materiais comuns, como diminuir efeitos naturais, de mobilidade ou de perigo de vida' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 17, idPatente: 4 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Improvisar Ambiente', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 17 } } } }, }]),

        // TATI //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Analisar Terreno', descricao: 'Você identifica possíveis Efeitos Positivos ou Negativos em um ambiente' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 18, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Analisar Terreno', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 18 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Analisar Fraqueza', descricao: 'Você descobre qual a menor e maior perícias de resistência do alvo. Cada vez que usar, você pode escolher 1 tipo de R.D. para saber o valor atual' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 18, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Analisar Fraqueza', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 18 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Estrategista do Grupo', descricao: 'Você e todos os seus aliados recebem P.TATI como defesa bônus por INT turnos' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 18, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Táticas de Combate', descricao: 'Você recebe uma Reação Adicional' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 18, idPatente: 4 }, }).adicionarModificadores([{ nome: 'Táticas de Combate', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 58, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 1 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),

        // TECN //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Manusear Maquinário', descricao: 'Você utiliza de um sistema digital' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 19, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Manusear Maquinário', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 19 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Hacker', descricao: 'Você realiza um teste para invadir um sistema digital. Se você não tiver sucesso, você ao menos sabe a DT do teste' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 19, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Hacker', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 19 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Improvisar Equipamentos', descricao: 'Você monta um sistema digital temporario' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 19, idPatente: 3 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Improvisar Equipamentos', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 19 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Preparar Mecanismo', descricao: 'Você monta um mecanismo automático' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 19, idPatente: 4 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Preparar Mecanismo', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 3, idPericia: 19 } } } }, }]),

        // DIPL //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Melhorar Relacionamento', descricao: 'Você melhora seu nível de relacionamento com esse ser' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 20, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Melhorar Relacionamento', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 4, idPericia: 20 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Acalmar', descricao: 'Você retira um Ser de Enlouquecendo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 20, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Acalmar', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 44, idPericia: 20 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Voz da Paz', descricao: 'Se você falhar, recebe +5 DIPL na próxima tentativa, acumulando entre usos' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 20, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Ressoar da Alma', descricao: 'Você dobra a melhoria do Nível de Relacionamento ou da redução do Nível de Medo quando usando DIPL' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 20, idPatente: 4 }, }),

        // ENGA //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Esconder Informação', descricao: 'Você realiza ações ou redige informação que não condizem com a verdade' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 21, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Esconder Informação', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 4, idPericia: 21 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Disfarce Realista', descricao: 'Você estuda e replica um padrão de uniforme ou identificação' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 21, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Disfarce Realista', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 44, idPericia: 21 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Ventriloquismo', descricao: 'Você simula a voz de alguém que já ouviu, em condição e distâncias variadas, recebendo +10 ENGA enquanto não descoberto' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 21, idPatente: 3 }, }),
        // new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Na palma da minha mão', descricao: '' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 21, idPatente: 4 }, }),

        // INTI //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Intimidar', descricao: 'O Alvo possui uma desvantagem contra qualquer teste que realize contra você até o início do seu próximo turno' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 22, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Intimidar', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 4, idPericia: 22 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Alguem do seu Tamanho', descricao: 'Você pode Reagir a um Intimidar, também executando um Intimidar no alvo' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 22, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Intimidação Aprimorada', descricao: 'Você recebe +5 INTI na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 22, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Vai encarar', descricao: 'Intimidar passa a durar P.INTI turnos' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 22, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Presença Amedrontadora', descricao: 'Intimidar passa a custar Ação de Movimento' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 22, idPatente: 4 }, }),

        // INTU //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Julgar', descricao: 'Você tenta desvendar uma Ação de Esconder Informação' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 23, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Julgar', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 4, idPericia: 23 } } } }, }]),
        // new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Argumentação Conjunta', '' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 23, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Intuição Aprimorada', descricao: 'Você recebe +5 INTU na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 23, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Verdade à Tona', descricao: 'Julgar com sucesso um Ser aplica -5 ENGA até o fim da cena' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 23, idPatente: 3 }, }),
        // new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Devorador de Mentiras', descricao: '' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 23, idPatente: 4 }, }),

        // PERC //

        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Analisar Arredores', descricao: 'Você recebe informações sobre algo na qual tenha linha de visão' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 1 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Analisar Arredores', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 4, idPericia: 24 } } } }, }]),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Analisar Comportamento', descricao: 'Você recebe informações sobre um Ser ou uma Ação desse Ser' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 2 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Analisar Comportamento', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 4, idPericia: 24 } } } }, }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Percepção Aprimorada', descricao: 'Você recebe +5 PERC na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Chamar por Atenção', descricao: 'Personagens aliados que realizarem PERC no mesmo alvo que você, compartilham o maior bônus de PERC entre vocês' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Olhos na Nuca', descricao: 'Você tem um segundo teste contra efeitos que requerem você Despercebido' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 4 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Detecção Infalível', descricao: 'Você pode usar a habilidade Analisar Comportamento como Reação a uma Ação acontecendo em Alcance Médio' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 24, idPatente: 4 }, }),

        // VONT //

        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Mente Resistente', descricao: 'Você reage a um Efeito Negativo usando VONT' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 25, idPatente: 1 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Afeição Paranormal', descricao: 'Você recebe uma Vantagem quando resistindo a Presença Pertubadora de um Elemento Pertencente' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 25, idPatente: 2 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Vontade Aprimorada', descricao: 'Você recebe +5 VONT na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 25, idPatente: 3 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Mente Inabalável', descricao: 'Você recebe uma Vantagem quando resistindo a Dano Mental' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 25, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Estabilidade Mental', descricao: 'Você permanece com 1 P.S.' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 25, idPatente: 4 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Estabilidade Mental', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 4, idPericia: 25 } } } }, }]),

        // FORT //

        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Corpo Resistente', descricao: 'Você reage a um Efeito Negativo usando FORT' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 26, idPatente: 1 }, }),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Reagir com Fortitude', descricao: 'Você soma seu Bônus de FORT na sua Defesa contra um Ataque' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 26, idPatente: 1 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Aprimorar Resistência', descricao: 'Você recebe R.D. a um Tipo de Dano Mundano até o início do seu próximo Turno' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 26, idPatente: 2 } }).adicionarAcoes([{
            props: { dadosGenericosAcao: { nome: 'Aprimorar Resistência', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 5, idPericia: 26 }, dadosDificuldadeDinamica: { dificuldadeInicial: 15, modificadorDificuldadeInicial: 2 } } } },
            config: (acao) => {
                acao.adicionarModificadores([{ nome: 'Resistência Aprimorada', idDuracao: 3, quantidadeDuracaoMaxima: 1, dadosComportamentos: { dadosComportamentoAtivo: [] }, dadosEfeitos: [{ idLinhaEfeito: 33, idTipoEfeito: 1, dadosValoresEfeitos: { valorBonusAdicional: 1 } }] }])
            }
        }]),
        new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Fortitude Aprimorada', descricao: 'Você recebe +5 FORT na sua próxima tentativa de uma Ação Falha' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 26, idPatente: 3 }, }),
        new HabilidadeAtiva({ dadosGenericosHabilidade: { nome: 'Negar a Morte', descricao: 'Você permanece com 1 P.V.' }, fonteHabilidade: { fonte: 'Habilidade de Perícia', idPericia: 26, idPatente: 4 }, }).adicionarAcoes([{ props: { dadosGenericosAcao: { nome: 'Negar a Morte', idTipoAcao: 1 }, dadosComportamentos: { dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 5, idPericia: 26 } } } }, }]),

        // // Classes //

        new HabilidadePassiva({
            dadosGenericosHabilidade: { nome: 'Amante de Armas', descricao: 'Suas Armas recebem o Nível de Patente da Perícia como Pontos de Característica Bônus' }, fonteHabilidade: { fonte: 'Habilidade Especial', tipo: 'Classe' }, requisitoFicha: new RequisitoFicha((personagem: Personagem) => {
                return personagem.detalhes.refClasse.id === 2;
            })
        }).adicionarModificadores([
            { nome: 'Amante de Armas de Ataque Corpo-a-Corpo', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 63, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: getPersonagemFromContext().pericias.find(pericia => pericia.refPericia.id === 8)!.valorNivelPatente } }], dadosComportamentos: { dadosComportamentoPassivo: [] } },
            { nome: 'Amante de Armas de Ataque à Distância', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 64, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: getPersonagemFromContext().pericias.find(pericia => pericia.refPericia.id === 5)!.valorNivelPatente } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }
        ]),

        new HabilidadePassiva({
            dadosGenericosHabilidade: { nome: 'O Melhor da Turma', descricao: 'Você recebe o Atributo da Perícia como Bônus da Perícia' }, fonteHabilidade: { fonte: 'Habilidade Especial', tipo: 'Classe' }, requisitoFicha: new RequisitoFicha((personagem: Personagem) => {
                return personagem.detalhes.refClasse.id === 3;
            })
        }).adicionarModificadores([
            { nome: 'O Mais Ágil da Turma', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosComportamentos: { dadosComportamentoPassivo: [] }, dadosEfeitos: SingletonHelper.getInstance().pericias.filter(pericia => pericia.refAtributo.id === 1).map(pericia => ({ idLinhaEfeito: pericia.refLinhaEfeito.id, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === pericia.refAtributo.id)!.valorTotal } })) },
            { nome: 'O Mais Forte da Turma', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosComportamentos: { dadosComportamentoPassivo: [] }, dadosEfeitos: SingletonHelper.getInstance().pericias.filter(pericia => pericia.refAtributo.id === 2).map(pericia => ({ idLinhaEfeito: pericia.refLinhaEfeito.id, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === pericia.refAtributo.id)!.valorTotal } })) },
            { nome: 'O Mais Inteligente da Turma', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosComportamentos: { dadosComportamentoPassivo: [] }, dadosEfeitos: SingletonHelper.getInstance().pericias.filter(pericia => pericia.refAtributo.id === 3).map(pericia => ({ idLinhaEfeito: pericia.refLinhaEfeito.id, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === pericia.refAtributo.id)!.valorTotal } })) },
            { nome: 'O Mais Perspicaz da Turma', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosComportamentos: { dadosComportamentoPassivo: [] }, dadosEfeitos: SingletonHelper.getInstance().pericias.filter(pericia => pericia.refAtributo.id === 4).map(pericia => ({ idLinhaEfeito: pericia.refLinhaEfeito.id, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === pericia.refAtributo.id)!.valorTotal } })) },
            { nome: 'O Mais Vigoroso da Turma', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosComportamentos: { dadosComportamentoPassivo: [] }, dadosEfeitos: SingletonHelper.getInstance().pericias.filter(pericia => pericia.refAtributo.id === 5).map(pericia => ({ idLinhaEfeito: pericia.refLinhaEfeito.id, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === pericia.refAtributo.id)!.valorTotal } })) },
        ]),

        new HabilidadePassiva({
            dadosGenericosHabilidade: { nome: 'Constituição Paranormal', descricao: 'Você recebe sua P.OCUL como Redução de Gasto de P.E. em Rituais' }, fonteHabilidade: { fonte: 'Habilidade Especial', tipo: 'Classe' }, requisitoFicha: new RequisitoFicha((personagem: Personagem) => {
                return personagem.detalhes.refClasse.id === 4;
            })
        }).adicionarModificadores([{ nome: 'Constituição Paranormal', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 62, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: getPersonagemFromContext().pericias.find(pericia => pericia.refPericia.id === 16)?.valorNivelPatente } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),

        new HabilidadePassiva({
            dadosGenericosHabilidade: { nome: 'Mente Corrompida', descricao: 'Aumenta +5 OCUL' }, fonteHabilidade: { fonte: 'Habilidade Especial', tipo: 'Classe' }, requisitoFicha: new RequisitoFicha((personagem: Personagem) => {
                return personagem.detalhes.refClasse.id === 4;
            })
        }).adicionarModificadores([{ nome: 'Mente Corrompida', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 24, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 5 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),

        // // Habilidades Especiais //

        // new HabilidadePassiva({ dadosGenericosHabilidade: { nome: 'Experiência com Armas', descricao: 'Você recebe um Ponto de Característica de Arma Bônus' }, fonteHabilidade: { fonte: 'Habilidade Especial', tipo: 'Mundana' }, }).adicionarModificadores([{ nome: 'Experiência com Armas', idDuracao: 5, quantidadeDuracaoMaxima: 1, dadosEfeitos: [{ idLinhaEfeito: 63, idTipoEfeito: 4, dadosValoresEfeitos: { valorBonusAdicional: 1 } }], dadosComportamentos: { dadosComportamentoPassivo: [] } }]),
    ];
}