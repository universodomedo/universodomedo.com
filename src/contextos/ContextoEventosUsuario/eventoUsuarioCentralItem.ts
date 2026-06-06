import { EventoUsuarioDto, EventoUsuarioFormato, TUTORIAIS_USUARIO, PassoTutorialUsuario, CHAVE_TUTORIAL_CENTRAL } from 'types-nora-api';

import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';
import { ALVO_VISUAL_CENTRAL_BOTAO } from './alvoVisualTutorial';

// Modelo de apresentação pronto para render: o componente não interpreta formato/dados/datas.
export type EventoUsuarioCentralItem = {
    id: number;
    titulo: string;
    mensagem: string;
    rotuloFormato: string;
    rotuloLeitura: string;
    dataCriacaoFormatada: string;
    lido: boolean;
    podeMarcarComoLido: boolean;
    textoAuxiliar: string | null;
    podeAbrirTutorial: boolean;
    rotuloAcaoTutorial: string | null;
    alvoVisual: string | null;
    possuiAlvoVisual: boolean;
    passos: readonly PassoTutorialUsuario[];
    concluido: boolean;
    rotuloConclusao: string | null;
    pendente: boolean;
};

// Mapeamento fechado e explícito de formato → rótulo humano; default neutro 'Evento' defensivo p/ formato gerado futuro.
function rotuloFormato(formato: EventoUsuarioFormato): string {
    switch (formato) {
        case 'simples': return 'Evento';
        case 'convite_sessao': return 'Convite';
        case 'sistema': return 'Sistema';
        case 'tutorial': return 'Tutorial';
        default: return 'Evento';
    }
};

// Texto auxiliar mínimo apenas para o tutorial inicial da central (complemento no card; não overlay/modal/tooltip/tour).
function textoAuxiliar(evento: EventoUsuarioDto): string | null {
    if (evento.formato === 'tutorial' && evento.dados?.chaveTutorial === CHAVE_TUTORIAL_CENTRAL) return 'Esta central reúne avisos, pendências e orientações importantes da plataforma.';
    return null;
};

// Alvo visual do tutorial: SÓ o alvo conhecido desta etapa — nunca repassa dados.alvoVisual adiante como seletor livre.
function alvoVisualDoEvento(evento: EventoUsuarioDto): string | null {
    if (evento.formato !== 'tutorial') return null;
    if (evento.dados?.alvoVisual === ALVO_VISUAL_CENTRAL_BOTAO) return ALVO_VISUAL_CENTRAL_BOTAO;
    if (evento.dados?.chaveTutorial === CHAVE_TUTORIAL_CENTRAL) return ALVO_VISUAL_CENTRAL_BOTAO;
    return null;
};

// Etapa 16: passos do tutorial resolvidos do contrato gerado por chaveTutorial (SSOT no backend). Não-tutorial/chave desconhecida => sem passos.
function passosDoEvento(evento: EventoUsuarioDto): readonly PassoTutorialUsuario[] {
    if (evento.formato !== 'tutorial') return [];
    const chave = evento.dados?.chaveTutorial;
    return typeof chave === 'string' ? (TUTORIAIS_USUARIO[chave] ?? []) : [];
};

export function paraItemCentral(evento: EventoUsuarioDto): EventoUsuarioCentralItem {
    const lido = !!evento.dataLeitura;
    const ehTutorial = evento.formato === 'tutorial';
    const concluido = !!evento.dataConclusao;
    const alvoVisual = alvoVisualDoEvento(evento);
    const passos = passosDoEvento(evento);
    // Etapa 15: pendência por tipo — tutorial pende até concluir; não-tutorial pende até ler.
    const pendente = ehTutorial ? !concluido : !lido;
    return { id: evento.id, titulo: evento.titulo, mensagem: evento.mensagem, rotuloFormato: rotuloFormato(evento.formato), rotuloLeitura: lido ? 'lido' : 'não lido', dataCriacaoFormatada: formataData(evento.dataCriacao, 'dd/MM/yyyy HH:mm'), lido, podeMarcarComoLido: !lido && !ehTutorial, textoAuxiliar: textoAuxiliar(evento), podeAbrirTutorial: ehTutorial && !concluido && passos.length > 0, rotuloAcaoTutorial: ehTutorial && !concluido ? 'Ver orientação' : null, alvoVisual, possuiAlvoVisual: alvoVisual !== null, passos, concluido, rotuloConclusao: ehTutorial && concluido ? 'concluído' : null, pendente };
};
