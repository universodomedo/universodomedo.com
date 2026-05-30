export const modosVisualizacaoViewportEditor3D = ['SOLIDO', 'ESTRUTURA', 'MATERIAIS', 'RENDERIZADO'] as const;

export type ModoVisualizacaoViewportEditor3D = typeof modosVisualizacaoViewportEditor3D[number];

export function modoVisualizacaoViewportPermiteXRayEditor3D(modo: ModoVisualizacaoViewportEditor3D): boolean { return modo === 'SOLIDO' || modo === 'ESTRUTURA'; }
