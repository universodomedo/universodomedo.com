import type { ModoEditor3D, TipoModoEditor3D } from './editor3D.modo.tipos';

export function criaModoInativoEditor3D(): ModoEditor3D {
    return { tipo: 'NENHUM' };
};

export function modoEditor3DEstaAtivo(modo: ModoEditor3D): boolean {
    return modo.tipo !== 'NENHUM';
};

export function obtemIdObjetoModoEditor3D(modo: ModoEditor3D): string | null {
    if (modo.tipo === 'NENHUM') return null;

    return modo.idObjeto;
};

export function obtemClasseCursorModoEditor3D(tipo: TipoModoEditor3D): 'GRAB' | 'ROTATE' | 'SCALE' | null {
    if (tipo === 'GRAB') return 'GRAB';
    if (tipo === 'ROTATE') return 'ROTATE';
    if (tipo === 'SCALE') return 'SCALE';

    return null;
};