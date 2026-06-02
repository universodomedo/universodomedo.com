import type { MaterialVisualEditor3D } from './editor3D.materialVisual.tipos';
import type { ShaderEditor3D } from './editor3D.shader.tipos';
import type { TipoMalhaEditor3D, Vetor3 } from './editor3D.tipos';

interface ConfiguracaoPresetObjetoCenaEditor3D {
    readonly key: string;
    readonly nome: string;
    readonly tipoMalha: TipoMalhaEditor3D;
    readonly quantidadeVertices: number;
    readonly escala: Vetor3;
    readonly materialVisual: MaterialVisualEditor3D;
    readonly shader: ShaderEditor3D;
};

export const presetsObjetosCenaEditor3D = [
    { key: 'MOEDA_OURO', nome: 'Moeda de Ouro', tipoMalha: 'CILINDRO_3D', quantidadeVertices: 32, escala: [1, 1, 0.12], materialVisual: 'OURO', shader: 'PADRAO' },
] as const satisfies readonly ConfiguracaoPresetObjetoCenaEditor3D[];

export type PresetObjetoCenaEditor3D = typeof presetsObjetosCenaEditor3D[number]['key'];
export type DefinicaoPresetObjetoCenaEditor3D = typeof presetsObjetosCenaEditor3D[number];

export function obtemDefinicaoPresetObjetoCenaEditor3D(preset: PresetObjetoCenaEditor3D): DefinicaoPresetObjetoCenaEditor3D {
    const definicao = presetsObjetosCenaEditor3D.find(presetAtual => presetAtual.key === preset);

    if (definicao !== undefined) return definicao;

    throw new Error(`Preset de objeto do Editor 3D sem definicao central: ${preset}`);
};
