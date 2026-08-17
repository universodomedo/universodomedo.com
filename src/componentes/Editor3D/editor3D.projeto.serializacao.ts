import { Color, Euler, Matrix4, Quaternion, Vector3 } from 'three';
import type { Mesh } from 'three';
import type { CameraCenaCanonicaEditor3D, CapaArteCenaCanonicaEditor3D, CenaCanonicaEditor3D, CorpoPersonagemCenaCanonicaEditor3D, ObjetoCenaCanonicaEditor3D, PecaPersonagemCenaCanonicaEditor3D, TextoCapaArteCenaCanonicaEditor3D, TipoMalhaCenaCanonicaEditor3D, TipoProjetoEditor3D, Vetor3CenaCanonicaEditor3D } from 'types-nora-api';

import type { MalhaEditavelLocal, Vetor3Malha } from './editor3D.malha';
import { corHexParaVetor3Editor3D, vetor3ParaCorHexEditor3D } from './editor3D.cor';

export type TipoPrimitivaEditor3D = 'CUBO' | 'CILINDRO' | 'ESFERA';
export type TransformEditor3D = { readonly posicao: [number, number, number]; readonly rotacao: [number, number, number]; readonly escala: [number, number, number]; };

// Câmera-output do projeto Capa de Arte: enquadra o render final. Mira em `alvo` (lookAt); aspecto é fixo pela saída 1280x720.
export type CameraEditor3D = { readonly posicao: [number, number, number]; readonly alvo: [number, number, number]; readonly fov: number; };
export const PERTO_CAMERA_CAPA_ARTE_EDITOR3D = 0.1;
export const LONGE_CAMERA_CAPA_ARTE_EDITOR3D = 200;
export const CAMERA_PADRAO_CAPA_ARTE_EDITOR3D: CameraEditor3D = { posicao: [6, -6, 4], alvo: [0, 0, 1], fov: 40 };

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

const TIPO_MALHA_POR_PRIMITIVA: Record<TipoPrimitivaEditor3D, TipoMalhaCenaCanonicaEditor3D> = { CUBO: 'CUBO_3D', CILINDRO: 'CILINDRO_3D', ESFERA: 'ESFERA_3D' };
const PRIMITIVA_POR_TIPO_MALHA: Partial<Record<TipoMalhaCenaCanonicaEditor3D, TipoPrimitivaEditor3D>> = { CUBO_3D: 'CUBO', CILINDRO_3D: 'CILINDRO', ESFERA_3D: 'ESFERA' };

// Cor base é editável por objeto (persiste em corBase); luz neutra e shader padrão seguem fixos.
export const COR_OBJETO_PADRAO_EDITOR3D = '#7484b4';
const COR_LUZ_PADRAO_EDITOR_3D: Vetor3CenaCanonicaEditor3D = [1, 1, 1];

export interface EntradaSerializacaoObjetoEditor3D {
    readonly id: number;
    readonly nome: string;
    readonly tipo: TipoPrimitivaEditor3D;
    readonly cor: string;
    readonly materiaisExtras: readonly { readonly nome: string; readonly cor: string }[];
    readonly idPeca: string | null;
    readonly malha: MalhaEditavelLocal;
    readonly subdivisao: number;
    readonly espessura: number;
    readonly mesh: Mesh;
};

function serializaMalhaEditavel(malha: MalhaEditavelLocal): ObjetoCenaCanonicaEditor3D['malhaEditavel'] {
    return {
        vertices: malha.vertices.map(vertice => [vertice[0], vertice[1], vertice[2]] as Vetor3CenaCanonicaEditor3D),
        faces: malha.faces.map(face => ({ id: face.id, nome: face.nome, indicesVertices: [...face.indicesVertices], ...(face.slotMaterial === undefined || face.slotMaterial <= 0 ? {} : { slotMaterial: face.slotMaterial }) })),
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
        corBase: corHexParaVetor3Editor3D(entrada.cor),
        corLuz: COR_LUZ_PADRAO_EDITOR_3D,
        materialVisual: null,
        shader: 'PADRAO',
        visivel: mesh.visible,
        idPeca: entrada.idPeca,
        malhaEditavel: serializaMalhaEditavel(entrada.malha),
        subdivisao: entrada.subdivisao,
        ...(entrada.espessura > 0 ? { espessura: entrada.espessura } : {}),
        ...(entrada.materiaisExtras.length > 0 ? { materiaisExtras: entrada.materiaisExtras.map(material => ({ nome: material.nome, cor: corHexParaVetor3Editor3D(material.cor) })) } : {}),
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

// Entrada de serialização a partir do ESTADO PURO (execução de Roteiro): mesmo shape da entrada por mesh, com o
// transform vindo do estado (transformInicial já assentado) e a visibilidade explícita — sem mesh viva envolvida.
export interface EntradaSerializacaoObjetoEstadoEditor3D {
    readonly id: number;
    readonly nome: string;
    readonly tipo: TipoPrimitivaEditor3D;
    readonly cor: string;
    readonly materiaisExtras: readonly { readonly nome: string; readonly cor: string }[];
    readonly idPeca: string | null;
    readonly malha: MalhaEditavelLocal;
    readonly subdivisao: number;
    readonly espessura: number;
    readonly transform: TransformEditor3D;
    readonly visivel: boolean;
};

// Espelho do serializaObjetoEditor3D para estado puro: a matriz é composta com a MESMA aritmética do updateMatrix da
// mesh (compose de posição/quaternion-de-Euler-XYZ/escala), para o serializado da reexecução bater byte a byte com o vivo.
function serializaObjetoEstadoEditor3D(entrada: EntradaSerializacaoObjetoEstadoEditor3D): ObjetoCenaCanonicaEditor3D {
    const matriz = new Matrix4().compose(new Vector3(entrada.transform.posicao[0], entrada.transform.posicao[1], entrada.transform.posicao[2]), new Quaternion().setFromEuler(new Euler(entrada.transform.rotacao[0], entrada.transform.rotacao[1], entrada.transform.rotacao[2], 'XYZ')), new Vector3(entrada.transform.escala[0], entrada.transform.escala[1], entrada.transform.escala[2]));
    return {
        idLocal: String(entrada.id),
        nome: entrada.nome,
        tipo: TIPO_MALHA_POR_PRIMITIVA[entrada.tipo],
        quantidadeVertices: entrada.malha.vertices.length,
        posicao: [entrada.transform.posicao[0], entrada.transform.posicao[1], entrada.transform.posicao[2]],
        rotacao: [entrada.transform.rotacao[0], entrada.transform.rotacao[1], entrada.transform.rotacao[2]],
        escala: [entrada.transform.escala[0], entrada.transform.escala[1], entrada.transform.escala[2]],
        matrizBase: Array.from(matriz.elements),
        corBase: corHexParaVetor3Editor3D(entrada.cor),
        corLuz: COR_LUZ_PADRAO_EDITOR_3D,
        materialVisual: null,
        shader: 'PADRAO',
        visivel: entrada.visivel,
        idPeca: entrada.idPeca,
        malhaEditavel: serializaMalhaEditavel(entrada.malha),
        subdivisao: entrada.subdivisao,
        ...(entrada.espessura > 0 ? { espessura: entrada.espessura } : {}),
        ...(entrada.materiaisExtras.length > 0 ? { materiaisExtras: entrada.materiaisExtras.map(material => ({ nome: material.nome, cor: corHexParaVetor3Editor3D(material.cor) })) } : {}),
    };
};

// Serialização da cena a partir do estado puro. Roteiros produzem projetos comuns (sem câmera/capa/personagem) — o
// ramo simples basta; os ramos especiais seguem exclusivos da serialização por mesh.
export function serializaCenaCanonicaDeEstadoEditor3D(entradas: readonly EntradaSerializacaoObjetoEstadoEditor3D[], tipoProjeto: TipoProjetoEditor3D): CenaCanonicaEditor3D {
    return { versao: 1, tipoProjeto, objetos: entradas.map(serializaObjetoEstadoEditor3D) };
};

// A cena é só geometria e material. Iluminação e fiação do MAPA vão na CAMADA DE JOGO, serializada à parte (editor3D.camadaJogo).
export function serializaCenaCanonicaEditor3D(entradas: readonly EntradaSerializacaoObjetoEditor3D[], tipoProjeto: TipoProjetoEditor3D, camera: CameraEditor3D | null, capaArte: CapaArteEditor3D | null, corpoPersonagem: CorpoPersonagemCenaCanonicaEditor3D | null, pecas: readonly PecaPersonagemCenaCanonicaEditor3D[]): CenaCanonicaEditor3D {
    const objetos = entradas.map(serializaObjetoEditor3D);
    if (tipoProjeto === 'CAPA_ARTE' && camera) return { versao: 1, tipoProjeto, objetos, camera: serializaCameraEditor3D(camera), capaArte: serializaCapaArteEditor3D(capaArte ?? CAPA_ARTE_PADRAO_EDITOR3D) };
    if (tipoProjeto === 'PERSONAGEM' && corpoPersonagem) return { versao: 1, tipoProjeto, objetos, corpoPersonagem, pecas: [...pecas] };
    return { versao: 1, tipoProjeto, objetos };
};

export interface ObjetoCarregadoEditor3D {
    readonly tipo: TipoPrimitivaEditor3D;
    readonly nome: string;
    readonly cor: string;
    readonly idPeca: string | null;
    readonly transform: TransformEditor3D;
    readonly malha?: MalhaEditavelLocal;
    readonly subdivisao: number;
    // Espessura de parede (Solidify de exibição), em metros. 0 = desligado. Persistência no contrato chega com o EDT-07.
    readonly espessura: number;
    // Slots de material adicionais (slot 0 = base = cor). Persistência no contrato chega com o EDT-07.
    readonly materiaisExtras: readonly { readonly nome: string; readonly cor: string }[];
};

function desserializaMalhaEditavel(malha: NonNullable<ObjetoCenaCanonicaEditor3D['malhaEditavel']>): MalhaEditavelLocal {
    return {
        vertices: malha.vertices.map(vertice => [vertice[0], vertice[1], vertice[2]] as Vetor3Malha),
        faces: malha.faces.map(face => ({ id: face.id, nome: face.nome, indicesVertices: [...face.indicesVertices], ...(face.slotMaterial === undefined ? {} : { slotMaterial: face.slotMaterial }) })),
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
            nome: objeto.nome,
            cor: vetor3ParaCorHexEditor3D(objeto.corBase),
            idPeca: objeto.idPeca ?? null,
            transform: { posicao: [objeto.posicao[0], objeto.posicao[1], objeto.posicao[2]], rotacao: [objeto.rotacao[0], objeto.rotacao[1], objeto.rotacao[2]], escala: [objeto.escala[0], objeto.escala[1], objeto.escala[2]] },
            malha: objeto.malhaEditavel ? desserializaMalhaEditavel(objeto.malhaEditavel) : undefined,
            subdivisao: objeto.subdivisao ?? 0,
            espessura: objeto.espessura ?? 0,
            materiaisExtras: (objeto.materiaisExtras ?? []).map(material => ({ nome: material.nome, cor: vetor3ParaCorHexEditor3D(material.cor) })),
        });
    }
    return carregados;
};

export function tipoProjetoDaCena(cena: CenaCanonicaEditor3D): TipoProjetoEditor3D { return cena.tipoProjeto ?? 'PADRAO'; };

export function pecasDaCena(cena: CenaCanonicaEditor3D): PecaPersonagemCenaCanonicaEditor3D[] { return cena.pecas ? [...cena.pecas] : []; };

export function corpoPersonagemDaCena(cena: CenaCanonicaEditor3D): CorpoPersonagemCenaCanonicaEditor3D | null { return cena.corpoPersonagem ?? null; };

export function cameraDaCena(cena: CenaCanonicaEditor3D): CameraEditor3D | null {
    if (!cena.camera) return null;
    return { posicao: [cena.camera.posicao[0], cena.camera.posicao[1], cena.camera.posicao[2]], alvo: [cena.camera.alvo[0], cena.camera.alvo[1], cena.camera.alvo[2]], fov: cena.camera.fov };
};

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
