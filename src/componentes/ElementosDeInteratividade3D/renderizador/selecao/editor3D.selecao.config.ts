import type { Vetor3 } from '../../editor/editor3D.tipos';

export interface ConfigSelecaoEditor3D {
    readonly escala: number;
    readonly corBase: Vetor3;
    readonly corLuz: Vetor3;
    readonly alpha: number;
};

export const selecaoObjetoEditor3D: ConfigSelecaoEditor3D = {
    escala: 1.018,
    corBase: [0.14, 0.72, 1],
    corLuz: [0.62, 0.92, 1],
    alpha: 0.34,
};

export const selecaoModoEditor3D: ConfigSelecaoEditor3D = {
    escala: 1.018,
    corBase: [0.96, 0.96, 0.96],
    corLuz: [1, 1, 1],
    alpha: 0.38,
};