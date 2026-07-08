import { TIPOS_INTERACAO } from 'types-nora-api';

// Cores da identidade p/ os tipos de interação (paleta paranormal + status que o jogo já usa); fallback = ouro de marca.
const CORES_TIPO_INTERACAO: Record<string, string> = {
    [TIPOS_INTERACAO.DANIFICAVEL.chave]: '#DB4747',
    [TIPOS_INTERACAO.VISUAL.chave]: '#c787ff',
    [TIPOS_INTERACAO.AUDIVEL.chave]: '#ff56eb',
    [TIPOS_INTERACAO.OUFATIVA.chave]: '#BEAA46',
};

export const COR_TIPO_PADRAO = '#B79051';

export function corDoTipoInteracao(nomeInteracao?: string): string { return (nomeInteracao !== undefined ? CORES_TIPO_INTERACAO[nomeInteracao] : undefined) ?? COR_TIPO_PADRAO; };
