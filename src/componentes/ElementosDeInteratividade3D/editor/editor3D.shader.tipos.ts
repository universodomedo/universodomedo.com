export const shadersEditor3D = [
    { key: 'PADRAO', nome: 'PADRAO' },
    { key: 'SEM_ILUMINACAO', nome: 'SEM_ILUMINACAO' },
    { key: 'NORMALS', nome: 'NORMALS' },
] as const;

export type ShaderEditor3D = typeof shadersEditor3D[number]['key'];
