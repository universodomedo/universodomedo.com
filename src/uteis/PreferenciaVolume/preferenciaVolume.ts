import type { NivelVolume } from 'Redux/slices/audioPaginaSlice';

const CHAVE = 'udm.nivelVolume';
const NIVEIS_VALIDOS: readonly NivelVolume[] = ['SILENCIOSO', 'MINIMO', 'BAIXO', 'MODERADO', 'ALTO', 'MAXIMO'];
// Migração de nomes antigos persistidos antes dos 6 níveis (o 'MEDIO' virou 'MODERADO'); os demais nomes legados seguem válidos.
const NIVEL_LEGADO_PARA_ATUAL: Record<string, NivelVolume> = { MEDIO: 'MODERADO' };

export function lerNivelVolumeSalvo(): NivelVolume | null {
    if (typeof window === 'undefined') return null;
    const salvo = window.localStorage.getItem(CHAVE);
    if (!salvo) return null;
    const convertido = NIVEL_LEGADO_PARA_ATUAL[salvo] ?? salvo;
    return (NIVEIS_VALIDOS as readonly string[]).includes(convertido) ? (convertido as NivelVolume) : null;
};

export function salvarNivelVolume(nivel: NivelVolume): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CHAVE, nivel);
};
