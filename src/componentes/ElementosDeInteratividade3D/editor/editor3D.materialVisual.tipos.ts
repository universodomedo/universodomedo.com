export const materiaisVisuaisEditor3D = [
    { key: 'OURO', nome: 'OURO', corBase: [1, 0.64, 0.14], corLuz: [1, 0.95, 0.42] },
] as const;

export type MaterialVisualEditor3D = typeof materiaisVisuaisEditor3D[number]['key'];
export type DefinicaoMaterialVisualEditor3D = typeof materiaisVisuaisEditor3D[number];

export function obtemDefinicaoMaterialVisualEditor3D(materialVisual: MaterialVisualEditor3D): DefinicaoMaterialVisualEditor3D {
    const definicao = materiaisVisuaisEditor3D.find(materialVisualAtual => materialVisualAtual.key === materialVisual);

    if (definicao !== undefined) return definicao;

    throw new Error(`Material visual do Editor 3D sem definicao central: ${materialVisual}`);
};
