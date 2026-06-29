import { Color } from 'three';
import type { Mesh } from 'three';
import type { CameraCenaCanonicaEditor3D, CapaArteCenaCanonicaEditor3D, CenaCanonicaEditor3D, ObjetoCenaCanonicaEditor3D, TextoCapaArteCenaCanonicaEditor3D, TipoMalhaCenaCanonicaEditor3D, TipoProjetoEditor3D, Vetor3CenaCanonicaEditor3D } from 'types-nora-api';

import type { MalhaEditavelLocal, Vetor3Malha } from './editor3D.malha';

export type TipoPrimitivaEditor3D = 'CUBO' | 'CILINDRO';
export type TransformEditor3D = { readonly posicao: [number, number, number]; readonly rotacao: [number, number, number]; readonly escala: [number, number, number]; };

// Câmera-output do projeto Capa de Arte: enquadra o render final. Mira em `alvo` (lookAt); aspecto é fixo pela saída 1280x720.
export type CameraEditor3D = { readonly posicao: [number, number, number]; readonly alvo: [number, number, number]; readonly fov: number; };
export const PERTO_CAMERA_CAPA_ARTE_EDITOR3D = 0.1;
export const LONGE_CAMERA_CAPA_ARTE_EDITOR3D = 200;
export const CAMERA_PADRAO_CAPA_ARTE_EDITOR3D: CameraEditor3D = { posicao: [5, 3.5, 6], alvo: [0, 1, 0], fov: 40 };

// Texto da Capa de Arte: objeto 3D filho da câmera-output (transform em espaço da câmera + cor de material), editável como qualquer objeto. Renderizado em camada separada para poder ser exibido/ocultado.
export type TextoCapaArteEditor3D = { readonly texto: string; readonly posicao: [number, number, number]; readonly rotacao: [number, number, number]; readonly escala: [number, number, number]; readonly cor: string; };
export type CapaArteEditor3D = { readonly titulo: TextoCapaArteEditor3D; readonly assinatura: TextoCapaArteEditor3D; };
// Default posiciona o texto à frente da câmera (-Z local), cor branca.
export const TEXTO_CAPA_ARTE_PADRAO_EDITOR3D: TextoCapaArteEditor3D = { texto: '', posicao: [0, 0.2, -5], rotacao: [0, 0, 0], escala: [1, 1, 1], cor: '#ffffff' };
export const CAPA_ARTE_PADRAO_EDITOR3D: CapaArteEditor3D = { titulo: TEXTO_CAPA_ARTE_PADRAO_EDITOR3D, assinatura: TEXTO_CAPA_ARTE_PADRAO_EDITOR3D };

const ASPECTO_CAPA_ARTE_EDITOR3D = 1280 / 720;

// Restringe a posição do texto ao frustum da câmera-output na profundidade atual (z sempre < 0 = à frente): para o título NÃO existe cena fora da área da câmera. Movimento error/context-safe.
export function restringeTextoNaCameraEditor3D(posicao: [number, number, number], fov: number): [number, number, number] {
    const z = Math.min(-0.2, posicao[2]);
    const profundidade = -z;
    const meiaAltura = profundidade * Math.tan((fov * Math.PI) / 360);
    const meiaLargura = meiaAltura * ASPECTO_CAPA_ARTE_EDITOR3D;
    const x = Math.max(-meiaLargura, Math.min(meiaLargura, posicao[0]));
    const y = Math.max(-meiaAltura, Math.min(meiaAltura, posicao[1]));
    return [x, y, z];
};

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

function serializaCameraEditor3D(camera: CameraEditor3D): CameraCenaCanonicaEditor3D {
    return { posicao: [...camera.posicao], alvo: [...camera.alvo], fov: camera.fov, perto: PERTO_CAMERA_CAPA_ARTE_EDITOR3D, longe: LONGE_CAMERA_CAPA_ARTE_EDITOR3D };
};

function serializaTextoCapaArteEditor3D(texto: TextoCapaArteEditor3D): TextoCapaArteCenaCanonicaEditor3D {
    return { texto: texto.texto.trim(), posicao: [...texto.posicao], rotacao: [...texto.rotacao], escala: [...texto.escala], cor: corHexParaVetor3Editor3D(texto.cor) };
};

function serializaCapaArteEditor3D(capaArte: CapaArteEditor3D): CapaArteCenaCanonicaEditor3D {
    return { titulo: serializaTextoCapaArteEditor3D(capaArte.titulo), assinatura: serializaTextoCapaArteEditor3D(capaArte.assinatura) };
};

export function serializaCenaCanonicaEditor3D(entradas: readonly EntradaSerializacaoObjetoEditor3D[], tipoProjeto: TipoProjetoEditor3D, camera: CameraEditor3D | null, capaArte: CapaArteEditor3D | null): CenaCanonicaEditor3D {
    const objetos = entradas.map(serializaObjetoEditor3D);
    if (tipoProjeto === 'CAPA_ARTE' && camera) return { versao: 1, tipoProjeto, objetos, camera: serializaCameraEditor3D(camera), capaArte: serializaCapaArteEditor3D(capaArte ?? CAPA_ARTE_PADRAO_EDITOR3D) };
    return { versao: 1, tipoProjeto, objetos };
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

export function tipoProjetoDaCena(cena: CenaCanonicaEditor3D): TipoProjetoEditor3D { return cena.tipoProjeto ?? 'PADRAO'; };

export function cameraDaCena(cena: CenaCanonicaEditor3D): CameraEditor3D | null {
    if (!cena.camera) return null;
    return { posicao: [cena.camera.posicao[0], cena.camera.posicao[1], cena.camera.posicao[2]], alvo: [cena.camera.alvo[0], cena.camera.alvo[1], cena.camera.alvo[2]], fov: cena.camera.fov };
};

function vetor3ParaCorHexEditor3D(cor: Vetor3CenaCanonicaEditor3D): string { return `#${new Color(cor[0], cor[1], cor[2]).getHexString()}`; };

// Tolerante ao formato antigo (título era string) e a campos ausentes.
function desserializaTextoCapaArteEditor3D(texto: TextoCapaArteCenaCanonicaEditor3D | string | null | undefined): TextoCapaArteEditor3D {
    if (typeof texto === 'string') return { ...TEXTO_CAPA_ARTE_PADRAO_EDITOR3D, texto };
    if (!texto || typeof texto !== 'object') return TEXTO_CAPA_ARTE_PADRAO_EDITOR3D;
    return {
        texto: texto.texto ?? '',
        posicao: texto.posicao ? [texto.posicao[0], texto.posicao[1], texto.posicao[2]] : [...TEXTO_CAPA_ARTE_PADRAO_EDITOR3D.posicao],
        rotacao: texto.rotacao ? [texto.rotacao[0], texto.rotacao[1], texto.rotacao[2]] : [...TEXTO_CAPA_ARTE_PADRAO_EDITOR3D.rotacao],
        escala: texto.escala ? [texto.escala[0], texto.escala[1], texto.escala[2]] : [...TEXTO_CAPA_ARTE_PADRAO_EDITOR3D.escala],
        cor: texto.cor ? vetor3ParaCorHexEditor3D(texto.cor) : TEXTO_CAPA_ARTE_PADRAO_EDITOR3D.cor,
    };
};

export function capaArteDaCena(cena: CenaCanonicaEditor3D): CapaArteEditor3D {
    if (!cena.capaArte) return CAPA_ARTE_PADRAO_EDITOR3D;
    return { titulo: desserializaTextoCapaArteEditor3D(cena.capaArte.titulo), assinatura: desserializaTextoCapaArteEditor3D(cena.capaArte.assinatura) };
};
