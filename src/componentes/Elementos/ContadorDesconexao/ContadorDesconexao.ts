'use client';

import { pluralize } from 'types-nora-api';

export interface ContadorDesconexaoProps {
    dataDesconexao: Date | string;
}

export function useContadorDesconexao({ dataDesconexao }: ContadorDesconexaoProps) {
    return { tempoDecorrido: formatarTempoDecorrido(dataDesconexao) };
}

export function ContadorDesconexao({ dataDesconexao }: ContadorDesconexaoProps) {
    const { tempoDecorrido } = useContadorDesconexao({ dataDesconexao });
    return tempoDecorrido;
}

function formatarTempoDecorrido(data: Date | string): string {
    const diff = Math.floor((Date.now() - new Date(data).getTime()) / 60000);
    if (diff < 1) return 'pouco tempo';
    if (diff < 60) return `${diff} ${pluralize(diff, 'minuto', 'minutos')}`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h} ${pluralize(h, 'hora', 'horas')}`;
    const d = Math.floor(h / 24);
    return `${d} ${pluralize(d, 'dia', 'dias')}`;
}