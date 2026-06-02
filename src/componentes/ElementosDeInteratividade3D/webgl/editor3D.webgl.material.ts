import type { ProgramaEditor3D } from './editor3D.webgl.programa';
import type { Vetor3 } from '../editor/editor3D.tipos';
import { obtemDefinicaoShaderEditor3D, type ModoWebGLShaderEditor3D, type ShaderEditor3D } from '../editor/editor3D.shader.tipos';

export interface MaterialEditor3D {
    readonly corBase: Vetor3;
    readonly corLuz: Vetor3;
    readonly alpha: number;
    readonly usaIluminacao: boolean;
    readonly shader: ShaderEditor3D;
};

function criaVetorUniformeMaterialEditor3D(vetor: Vetor3): Float32Array { return new Float32Array([vetor[0], vetor[1], vetor[2]]); };

export function criaMaterialEditor3D(corBase: Vetor3, corLuz: Vetor3, usaIluminacao: boolean, alpha = 1): MaterialEditor3D { return { corBase, corLuz, alpha, usaIluminacao, shader: 'PADRAO' }; };

export function criaMaterialSemIluminacaoEditor3D(corBase: Vetor3, corLuz: Vetor3, alpha = 1): MaterialEditor3D { return { corBase, corLuz, alpha, usaIluminacao: false, shader: 'SEM_ILUMINACAO' }; };

export function criaMaterialNormalsEditor3D(corBase: Vetor3, corLuz: Vetor3, alpha = 1): MaterialEditor3D { return { corBase, corLuz, alpha, usaIluminacao: false, shader: 'NORMALS' }; };

function aplicaUniformesMaterialEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, material: MaterialEditor3D, usaIluminacao: boolean): void {
    const modoShader: ModoWebGLShaderEditor3D = obtemDefinicaoShaderEditor3D(material.shader).modoWebGL;

    gl.uniform3fv(programa.uCorBase, criaVetorUniformeMaterialEditor3D(material.corBase));
    gl.uniform3fv(programa.uCorLuz, criaVetorUniformeMaterialEditor3D(material.corLuz));
    gl.uniform1f(programa.uAlpha, material.alpha);
    gl.uniform1f(programa.uUsaIluminacao, usaIluminacao ? 1 : 0);
    gl.uniform1f(programa.uModoShader, modoShader);
};

function aplicaMaterialPadraoEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, material: MaterialEditor3D): void {
    aplicaUniformesMaterialEditor3D(gl, programa, material, material.usaIluminacao);
};

function aplicaMaterialSemIluminacaoEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, material: MaterialEditor3D): void {
    aplicaUniformesMaterialEditor3D(gl, programa, material, false);
};

function aplicaMaterialNormalsEditor3D(gl: WebGLRenderingContext, programa: ProgramaEditor3D, material: MaterialEditor3D): void {
    aplicaUniformesMaterialEditor3D(gl, programa, material, false);
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
