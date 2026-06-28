export const LARGURA_ARTE_DE_CAPA = 1280 as const;
export const ALTURA_ARTE_DE_CAPA = 720 as const;

export type OrigemArteDeCapa = 'SNAPSHOT_3D' | 'CANVAS_2D';

export type ArteDeCapa = {
    readonly id: string;
    readonly tipo: 'ARTE_CAPA';
    readonly largura: typeof LARGURA_ARTE_DE_CAPA;
    readonly altura: typeof ALTURA_ARTE_DE_CAPA;
    readonly imagem: string;
    readonly origem: OrigemArteDeCapa;
    readonly criadoEmMs: number;
};
