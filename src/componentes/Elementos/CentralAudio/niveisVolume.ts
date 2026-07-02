import type { NivelVolume } from 'Redux/slices/audioPaginaSlice';

// Apresentação dos níveis de volume: ordem no trilho + rótulo + cor do ponto/rótulo.
// Fonte ÚNICA da apresentação (o ganho de áudio vive no slice). Estrutura pensada para vir do banco em breve —
// quando isso acontecer, só esta lista troca de origem (ex.: uma leitura GraphQL), sem espalhar cor pelo CSS.
export interface NivelVolumeApresentacao {
    nivel: NivelVolume;
    label: string;
    cor: string;
};

// Espectro pedido: cinza mudo → lilás no Mínimo → roxo no Moderado → dourado até o Máximo.
export const NIVEIS_VOLUME_APRESENTACAO: NivelVolumeApresentacao[] = [
    { nivel: 'SILENCIOSO', label: 'Silencioso', cor: '#8b8792' },
    { nivel: 'MINIMO', label: 'Mínimo', cor: '#ebb2ff' },
    { nivel: 'BAIXO', label: 'Baixo', cor: '#d99cf1' },
    { nivel: 'MODERADO', label: 'Moderado', cor: '#c480e8' },
    { nivel: 'ALTO', label: 'Alto', cor: '#cda765' },
    { nivel: 'MAXIMO', label: 'Máximo', cor: '#a37b3e' },
];

export const ULTIMO_INDICE_NIVEL_VOLUME = NIVEIS_VOLUME_APRESENTACAO.length - 1;

// Gradiente do trilho montado a partir das cores da config (um stop por ponto) — nada de cor solta.
export const GRADIENTE_NIVEIS_VOLUME = `linear-gradient(90deg, ${NIVEIS_VOLUME_APRESENTACAO.map((item, indice) => `${item.cor} ${(indice / ULTIMO_INDICE_NIVEL_VOLUME) * 100}%`).join(', ')})`;
