import { EventoUsuarioDto, EventoUsuarioFormato } from 'types-nora-api';

import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';

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
    if (evento.formato === 'tutorial' && evento.dados?.chaveTutorial === 'central_eventos_minima_v1') return 'Esta central reúne avisos, pendências e orientações importantes da plataforma.';
    return null;
};

export function paraItemCentral(evento: EventoUsuarioDto): EventoUsuarioCentralItem {
    const lido = !!evento.dataLeitura;
    const ehTutorial = evento.formato === 'tutorial';
    return { id: evento.id, titulo: evento.titulo, mensagem: evento.mensagem, rotuloFormato: rotuloFormato(evento.formato), rotuloLeitura: lido ? 'lido' : 'não lido', dataCriacaoFormatada: formataData(evento.dataCriacao, 'dd/MM/yyyy HH:mm'), lido, podeMarcarComoLido: !lido, textoAuxiliar: textoAuxiliar(evento), podeAbrirTutorial: ehTutorial, rotuloAcaoTutorial: ehTutorial ? 'Ver orientação' : null };
};
