import type { ArteDeCapa } from './arteDeCapa.types';

const CHAVE_STORAGE_ARTES_DE_CAPA = 'udm.editor3d.artesDeCapa';

export function listaArtesDeCapa(): ArteDeCapa[] {
    if (typeof window === 'undefined') return [];
    try {
        const bruto = window.localStorage.getItem(CHAVE_STORAGE_ARTES_DE_CAPA);
        if (!bruto) return [];
        const dados = JSON.parse(bruto) as ArteDeCapa[];
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
};

export function salvaArteDeCapa(arte: ArteDeCapa): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CHAVE_STORAGE_ARTES_DE_CAPA, JSON.stringify([...listaArtesDeCapa(), arte]));
};

export function obtemUltimaArteDeCapa(): ArteDeCapa | null {
    const todas = listaArtesDeCapa();
    return todas.length > 0 ? todas[todas.length - 1] : null;
};
