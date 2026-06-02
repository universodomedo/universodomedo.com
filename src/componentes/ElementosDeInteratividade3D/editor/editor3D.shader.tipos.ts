export const shadersEditor3D = [
    { key: 'PADRAO', nome: 'PADRAO', modoWebGL: 0 },
    { key: 'SEM_ILUMINACAO', nome: 'SEM_ILUMINACAO', modoWebGL: 0 },
    { key: 'NORMALS', nome: 'NORMALS', modoWebGL: 1 },
] as const;

export type ShaderEditor3D = typeof shadersEditor3D[number]['key'];
export type DefinicaoShaderEditor3D = typeof shadersEditor3D[number];
export type ModoWebGLShaderEditor3D = DefinicaoShaderEditor3D['modoWebGL'];

export function obtemDefinicaoShaderEditor3D(shader: ShaderEditor3D): DefinicaoShaderEditor3D {
    const definicao = shadersEditor3D.find(shaderAtual => shaderAtual.key === shader);

    if (definicao !== undefined) return definicao;

    throw new Error(`Shader do Editor 3D sem definicao central: ${shader}`);
};
