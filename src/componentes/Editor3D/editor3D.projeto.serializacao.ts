import { Color } from 'three';
import type { Mesh } from 'three';
import type { CenaCanonicaEditor3D, ObjetoCenaCanonicaEditor3D, TipoMalhaCenaCanonicaEditor3D, Vetor3CenaCanonicaEditor3D } from 'types-nora-api';

import type { MalhaEditavelLocal, Vetor3Malha } from './editor3D.malha';

export type TipoPrimitivaEditor3D = 'CUBO' | 'CILINDRO';
export type TransformEditor3D = { readonly posicao: [number, number, number]; readonly rotacao: [number, number, number]; readonly escala: [number, number, number]; };

const TIPO_MALHA_POR_PRIMITIVA: Record<TipoPrimitivaEditor3D, TipoMalhaCenaCanonicaEditor3D> = { CUBO: 'CUBO_3D', CILINDRO: 'CILINDRO_3D' };
const PRIMITIVA_POR_TIPO_MALHA: Partial<Record<TipoMalhaCenaCanonicaEditor3D, TipoPrimitivaEditor3D>> = { CUBO_3D: 'CUBO', CILINDRO_3D: 'CILINDRO' };

function corHexParaVetor3Editor3D(hex: string): Vetor3CenaCanonicaEditor3D { const cor = new Color(hex); return [cor.r, cor.g, cor.b]; };

// Sem cor/material por objeto editáveis ainda — base neutra cinza, luz neutra, shader padrão.
const COR_BASE_PADRAO_EDITOR_3D: Vetor3CenaCanonicaEditor3D = corHexParaVetor3Editor3D('#7484b4');
const COR_LUZ_PADRAO_EDITOR_3D: Vetor3CenaCanonicaEditor3D = [1, 1, 1];

export interface EntradaSerializacaoObjetoEditor3D {
    readonly id: number;
    readonly nome: string;
    readonly tipo: TipoPrimitivaEditor3D;
    readonly malha: MalhaEditavelLocal;
    readonly mesh: Mesh;
};

function serializaMalhaEditavel(malha: MalhaEditavelLocal): ObjetoCenaCanonicaEditor3D['malhaEditavel'] {
    return {
        vertices: malha.vertices.map(vertice => [vertice[0], vertice[1], vertice[2]] as Vetor3CenaCanonicaEditor3D),
        faces: malha.faces.map(face => ({ id: face.id, nome: face.nome, indicesVertices: [...face.indicesVertices] })),
        proximoIdFace: malha.proximoIdFace,
    };
};

function serializaObjetoEditor3D(entrada: EntradaSerializacaoObjetoEditor3D): ObjetoCenaCanonicaEditor3D {
    const mesh = entrada.mesh;
    mesh.updateMatrix();
    return {
        idLocal: String(entrada.id),
        nome: entrada.nome,
        tipo: TIPO_MALHA_POR_PRIMITIVA[entrada.tipo],
        quantidadeVertices: entrada.malha.vertices.length,
        posicao: [mesh.position.x, mesh.position.y, mesh.position.z],
        rotacao: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
        escala: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
        matrizBase: Array.from(mesh.matrix.elements),
        corBase: COR_BASE_PADRAO_EDITOR_3D,
        corLuz: COR_LUZ_PADRAO_EDITOR_3D,
        materialVisual: null,
        shader: 'PADRAO',
        visivel: mesh.visible,
        malhaEditavel: serializaMalhaEditavel(entrada.malha),
    };
};

export function serializaCenaCanonicaEditor3D(entradas: readonly EntradaSerializacaoObjetoEditor3D[]): CenaCanonicaEditor3D {
    return { versao: 1, objetos: entradas.map(serializaObjetoEditor3D) };
};

export interface ObjetoCarregadoEditor3D {
    readonly tipo: TipoPrimitivaEditor3D;
    readonly transform: TransformEditor3D;
    readonly malha?: MalhaEditavelLocal;
};

function desserializaMalhaEditavel(malha: NonNullable<ObjetoCenaCanonicaEditor3D['malhaEditavel']>): MalhaEditavelLocal {
    return {
        vertices: malha.vertices.map(vertice => [vertice[0], vertice[1], vertice[2]] as Vetor3Malha),
        faces: malha.faces.map(face => ({ id: face.id, nome: face.nome, indicesVertices: [...face.indicesVertices] })),
        proximoIdFace: malha.proximoIdFace,
    };
};

export function desserializaCenaCanonicaEditor3D(cena: CenaCanonicaEditor3D): ObjetoCarregadoEditor3D[] {
    const carregados: ObjetoCarregadoEditor3D[] = [];
    for (const objeto of cena.objetos) {
        const primitiva = PRIMITIVA_POR_TIPO_MALHA[objeto.tipo];
        if (!primitiva) continue;
        carregados.push({
            tipo: primitiva,
            transform: { posicao: [objeto.posicao[0], objeto.posicao[1], objeto.posicao[2]], rotacao: [objeto.rotacao[0], objeto.rotacao[1], objeto.rotacao[2]], escala: [objeto.escala[0], objeto.escala[1], objeto.escala[2]] },
            malha: objeto.malhaEditavel ? desserializaMalhaEditavel(objeto.malhaEditavel) : undefined,
        });
    }
    return carregados;
};
