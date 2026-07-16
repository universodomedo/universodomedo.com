import { GraphqlTypesEventoUsuario, GraphqlTypesUsuarioTutorial } from 'types-nora-api';

import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';

// Etapa 14: selects mínimos da Central. O servidor já escopa por usuário autenticado (sem where/id do cliente). Não pede render-ready/passos (a abertura é por WS).
export const SELECT_EVENTO_CENTRAL = { id: true, tipo: true, titulo: true, mensagem: true, formato: true, dataCriacao: true, dataLeitura: true, dataConclusao: true, pendente: true } as const;
export const SELECT_TUTORIAL_CENTRAL = { id: true, dataDesbloqueio: true, dataPrimeiraAbertura: true, dataUltimaAbertura: true, dataConclusao: true, pendente: true, concluido: true, tutorial: { id: true, chaveTutorial: true, nome: true, ativo: true } } as const;

export type EventoUsuarioRegistro = GraphqlTypesEventoUsuario.Resultado<typeof SELECT_EVENTO_CENTRAL>;
export type UsuarioTutorialRegistro = GraphqlTypesUsuarioTutorial.Resultado<typeof SELECT_TUTORIAL_CENTRAL>;

export type AcaoTutorialCentral = 'abrir' | 'continuar' | 'reabrir';

// Item base discriminado pronto para render: o componente não interpreta DTO/datas/estado; só renderiza.
export type CentralItemEvento = { tipoItem: 'evento'; chave: string; id: number; titulo: string; mensagem: string; rotuloFormato: string; dataFormatada: string; dataOrdenacao: number; lido: boolean; pendente: boolean; podeMarcarComoLido: boolean };
export type CentralItemTutorial = { tipoItem: 'tutorial'; chave: string; idUsuarioTutorial: number; titulo: string; dataFormatada: string; dataOrdenacao: number; pendente: boolean; concluido: boolean; acao: AcaoTutorialCentral; rotuloAcao: string };
export type CentralItem = CentralItemEvento | CentralItemTutorial;

// Mapeamento fechado e explícito de formato → rótulo humano; default neutro 'Evento' defensivo p/ formato gerado futuro.
function rotuloFormato(formato: EventoUsuarioRegistro['formato']): string {
    switch (formato) {
        case 'simples': return 'Evento';
        case 'convite_sessao': return 'Convite';
        case 'sistema': return 'Sistema';
        case 'tutorial': return 'Tutorial';
        case 'marcacao_card': return 'Marcação';
        case 'atividade_card': return 'Atividade';
        default: return 'Evento';
    }
};

function instanteOuZero(data: Date | null): number { return data ? new Date(data).getTime() : 0; };

export function eventoParaItemCentral(evento: EventoUsuarioRegistro): CentralItemEvento {
    const lido = evento.dataLeitura !== null;
    return { tipoItem: 'evento', chave: `evento-${evento.id}`, id: evento.id, titulo: evento.titulo, mensagem: evento.mensagem, rotuloFormato: rotuloFormato(evento.formato), dataFormatada: formataData(evento.dataCriacao, 'dd/MM/yyyy HH:mm'), dataOrdenacao: instanteOuZero(evento.dataCriacao), lido, pendente: evento.pendente, podeMarcarComoLido: !lido };
};

// Ação derivada do estado do vínculo (regra de exibição; pendência/conclusão vêm do backend). Nunca aberto => Abrir; aberto e não concluído => Continuar; concluído => Reabrir.
function acaoTutorial(vinculo: UsuarioTutorialRegistro): AcaoTutorialCentral {
    if (vinculo.concluido) return 'reabrir';
    if (vinculo.dataPrimeiraAbertura !== null) return 'continuar';
    return 'abrir';
};

const ROTULO_ACAO_TUTORIAL: Record<AcaoTutorialCentral, string> = { abrir: 'Abrir Tutorial', continuar: 'Continuar Tutorial', reabrir: 'Reabrir Tutorial' };

// Data de referência por estado (exibição + ordenação). dataDesbloqueio (sempre presente) garante valor e ordenação válida para Tutorial nunca aberto.
function dataReferenciaTutorial(vinculo: UsuarioTutorialRegistro): Date {
    if (vinculo.concluido) return vinculo.dataConclusao ?? vinculo.dataUltimaAbertura ?? vinculo.dataPrimeiraAbertura ?? vinculo.dataDesbloqueio;
    if (vinculo.dataPrimeiraAbertura !== null) return vinculo.dataUltimaAbertura ?? vinculo.dataPrimeiraAbertura ?? vinculo.dataDesbloqueio;
    return vinculo.dataDesbloqueio;
};

export function tutorialParaItemCentral(vinculo: UsuarioTutorialRegistro): CentralItemTutorial {
    const acao = acaoTutorial(vinculo);
    const dataReferencia = dataReferenciaTutorial(vinculo);
    return { tipoItem: 'tutorial', chave: `tutorial-${vinculo.id}`, idUsuarioTutorial: vinculo.id, titulo: vinculo.tutorial.nome, dataFormatada: formataData(dataReferencia, 'dd/MM/yyyy HH:mm'), dataOrdenacao: new Date(dataReferencia).getTime(), pendente: vinculo.pendente, concluido: vinculo.concluido, acao, rotuloAcao: ROTULO_ACAO_TUTORIAL[acao] };
};
