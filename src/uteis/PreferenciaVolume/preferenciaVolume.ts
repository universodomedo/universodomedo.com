import type { NivelVolume } from 'Redux/slices/audioPaginaSlice';

const CHAVE = 'udm.nivelVolume';
const NIVEIS_VALIDOS: readonly NivelVolume[] = ['BAIXO', 'MEDIO', 'ALTO', 'MAXIMO'];

export function lerNivelVolumeSalvo(): NivelVolume | null {
    if (typeof window === 'undefined') return null;
    const salvo = window.localStorage.getItem(CHAVE);
    return salvo && (NIVEIS_VALIDOS as readonly string[]).includes(salvo) ? (salvo as NivelVolume) : null;
};

export function salvarNivelVolume(nivel: NivelVolume): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CHAVE, nivel);
};
