import type { EixoEditor3D } from '../../editor/editor3D.tipos';

export function obtemEixoTeclaEditor3D(tecla: string): EixoEditor3D | null {
    const teclaNormalizada = tecla.toLowerCase();

    if (teclaNormalizada === 'x') return 'X';
    if (teclaNormalizada === 'y') return 'Y';
    if (teclaNormalizada === 'z') return 'Z';

    return null;
};