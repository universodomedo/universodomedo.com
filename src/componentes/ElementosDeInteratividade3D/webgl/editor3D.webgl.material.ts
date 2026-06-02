import type { ProgramaEditor3D } from './editor3D.webgl.programa';
import type { Vetor3 } from '../editor/editor3D.tipos';
import type { ShaderEditor3D } from '../editor/editor3D.shader.tipos';

const modoShaderPadraoEditor3D = 0;
const modoShaderNormalsEditor3D = 1;

export interface MaterialEditor3D {
    readonly corBase: Vetor3;
    readonly corLuz: Vetor3;
    readonly alpha: number;
    readonly usaIluminacao: boolean;
    readonly shader: ShaderEditor3D;
};

function criaVetorUniformeMaterialEditor3D(vetor: Vetor3): Float32Array { return new Float32Array([vetor[0], vetor[1], vetor[2]]); };
function aplicaModoShaderEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, modoShader: number): void { gl.uniform1f(programa.uModoShader, modoShader); };

export function criaMaterialEditor3D(corBase: Vetor3, corLuz: Vetor3, usaIluminacao: boolean, alpha = 1): MaterialEditor3D { return { corBase, corLuz, alpha, usaIluminacao, shader: 'PADRAO' }; };

export function criaMaterialSemIluminacaoEditor3D(corBase: Vetor3, corLuz: Vetor3, alpha = 1): MaterialEditor3D { return { corBase, corLuz, alpha, usaIluminacao: false, shader: 'SEM_ILUMINACAO' }; };

export function criaMaterialNormalsEditor3D(corBase: Vetor3, corLuz: Vetor3, alpha = 1): MaterialEditor3D { return { corBase, corLuz, alpha, usaIluminacao: false, shader: 'NORMALS' }; };

function aplicaUniformesMaterialEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, material: MaterialEditor3D, usaIluminacao: boolean, modoShader: number): void {
    gl.uniform3fv(programa.uCorBase, criaVetorUniformeMaterialEditor3D(material.corBase));
    gl.uniform3fv(programa.uCorLuz, criaVetorUniformeMaterialEditor3D(material.corLuz));
    gl.uniform1f(programa.uAlpha, material.alpha);
    gl.uniform1f(programa.uUsaIluminacao, usaIluminacao ? 1 : 0);
    aplicaModoShaderEditor3D(gl, programa, modoShader);
};

function aplicaMaterialPadraoEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, material: MaterialEditor3D): void {
    aplicaUniformesMaterialEditor3D(gl, programa, material, material.usaIluminacao, modoShaderPadraoEditor3D);
};

function aplicaMaterialSemIluminacaoEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, material: MaterialEditor3D): void {
    aplicaUniformesMaterialEditor3D(gl, programa, material, false, modoShaderPadraoEditor3D);
};

function aplicaMaterialNormalsEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, material: MaterialEditor3D): void {
    aplicaUniformesMaterialEditor3D(gl, programa, material, false, modoShaderNormalsEditor3D);
};

// Ponto central de aplicacao de material/shader do Editor 3D.
export function aplicaMaterialEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, material: MaterialEditor3D): void {
    switch (material.shader) {
        case 'PADRAO':
            aplicaMaterialPadraoEditor3D(gl, programa, material);
            break;
        case 'SEM_ILUMINACAO':
            aplicaMaterialSemIluminacaoEditor3D(gl, programa, material);
            break;
        case 'NORMALS':
            aplicaMaterialNormalsEditor3D(gl, programa, material);
            break;
        default:
            const shaderNaoConfigurado: never = material.shader;

            throw new Error(`Shader do Editor 3D sem aplicacao configurada: ${shaderNaoConfigurado}`);
    }
};
