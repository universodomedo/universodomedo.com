import type { ProgramaEditor3D } from './editor3D.webgl.programa';
import type { Vetor3 } from '../editor/editor3D.tipos';

export interface MaterialEditor3D {
    readonly corBase: Vetor3;
    readonly corLuz: Vetor3;
    readonly alpha: number;
    readonly usaIluminacao: boolean;
};

function criaVetorUniformeMaterialEditor3D(vetor: Vetor3): Float32Array { return new Float32Array([vetor[0], vetor[1], vetor[2]]); };

export function criaMaterialEditor3D(corBase: Vetor3, corLuz: Vetor3, usaIluminacao: boolean, alpha = 1): MaterialEditor3D { return { corBase, corLuz, alpha, usaIluminacao }; };

// Ponto central de aplicacao de material/shader do Editor 3D.
export function aplicaMaterialEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, material: MaterialEditor3D): void {
    gl.uniform3fv(programa.uCorBase, criaVetorUniformeMaterialEditor3D(material.corBase));
    gl.uniform3fv(programa.uCorLuz, criaVetorUniformeMaterialEditor3D(material.corLuz));
    gl.uniform1f(programa.uAlpha, material.alpha);
    gl.uniform1f(programa.uUsaIluminacao, material.usaIluminacao ? 1 : 0);
};
