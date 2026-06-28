import { BufferGeometry, Float32BufferAttribute } from 'three';

export type Vetor3Malha = [number, number, number];
export type FaceMalhaLocal = { id: string; nome: string; indicesVertices: number[]; };
export type MalhaEditavelLocal = { vertices: Vetor3Malha[]; faces: FaceMalhaLocal[]; proximoIdFace: number; };

function face(id: number, nome: string, indices: number[]): FaceMalhaLocal { return { id: `f${id}`, nome, indicesVertices: indices }; };

// Cubo de aresta 1 centrado na origem: 8 vértices, 6 faces quad (winding CCW visto de fora → normais para fora).
export function criaMalhaCubo(): MalhaEditavelLocal {
    const h = 0.5;
    const vertices: Vetor3Malha[] = [
        [-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h],
        [-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h],
    ];
    const faces: FaceMalhaLocal[] = [
        face(1, 'Frente', [4, 5, 6, 7]),
        face(2, 'Trás', [1, 0, 3, 2]),
        face(3, 'Direita', [5, 1, 2, 6]),
        face(4, 'Esquerda', [0, 4, 7, 3]),
        face(5, 'Topo', [7, 6, 2, 3]),
        face(6, 'Base', [0, 1, 5, 4]),
    ];
    return { vertices, faces, proximoIdFace: 7 };
};

// Cilindro raio 0.5, altura 1: anel inferior (0..n-1) + anel superior (n..2n-1), N quads laterais + 2 tampas n-gon.
export function criaMalhaCilindro(segmentos = 24): MalhaEditavelLocal {
    const r = 0.5;
    const h = 0.5;
    const vertices: Vetor3Malha[] = [];
    for (let i = 0; i < segmentos; i++) { const a = (i / segmentos) * Math.PI * 2; vertices.push([Math.cos(a) * r, -h, Math.sin(a) * r]); }
    for (let i = 0; i < segmentos; i++) { const a = (i / segmentos) * Math.PI * 2; vertices.push([Math.cos(a) * r, h, Math.sin(a) * r]); }

    const faces: FaceMalhaLocal[] = [];
    let idFace = 0;
    for (let i = 0; i < segmentos; i++) {
        const i2 = (i + 1) % segmentos;
        idFace += 1;
        faces.push(face(idFace, `Lateral ${idFace}`, [i, segmentos + i, segmentos + i2, i2]));
    }
    idFace += 1;
    const tampaTopo: number[] = [];
    for (let i = segmentos - 1; i >= 0; i--) tampaTopo.push(segmentos + i);
    faces.push(face(idFace, 'Tampa Superior', tampaTopo));
    idFace += 1;
    const tampaBase: number[] = [];
    for (let i = 0; i < segmentos; i++) tampaBase.push(i);
    faces.push(face(idFace, 'Tampa Inferior', tampaBase));

    return { vertices, faces, proximoIdFace: idFace + 1 };
};

// Constrói a geometria de render a partir da malha: posições por vértice, faces via fan-triangulation, normais calculadas.
export function criaGeometriaDeMalha(malha: MalhaEditavelLocal): BufferGeometry {
    const posicoes: number[] = [];
    for (const vertice of malha.vertices) posicoes.push(vertice[0], vertice[1], vertice[2]);

    const indices: number[] = [];
    for (const faceMalha of malha.faces) {
        const ids = faceMalha.indicesVertices;
        for (let i = 1; i + 1 < ids.length; i += 1) indices.push(ids[0], ids[i], ids[i + 1]);
    }

    const geometria = new BufferGeometry();
    geometria.setAttribute('position', new Float32BufferAttribute(posicoes, 3));
    geometria.setIndex(indices);
    geometria.computeVertexNormals();
    return geometria;
};

export type ArestaMalhaLocal = { id: string; a: number; b: number; };

// Arestas únicas da malha (cada aresta compartilhada por 2 faces aparece uma vez), com chave normalizada min-max.
export function arestasDaMalha(malha: MalhaEditavelLocal): ArestaMalhaLocal[] {
    const vistas = new Map<string, ArestaMalhaLocal>();
    for (const face of malha.faces) {
        const ids = face.indicesVertices;
        for (let i = 0; i < ids.length; i += 1) {
            const a = ids[i];
            const b = ids[(i + 1) % ids.length];
            const chave = a < b ? `${a}-${b}` : `${b}-${a}`;
            if (!vistas.has(chave)) vistas.set(chave, { id: chave, a, b });
        }
    }
    return [...vistas.values()];
};

export function centroideDaMalha(malha: MalhaEditavelLocal, indices: readonly number[]): Vetor3Malha {
    let x = 0;
    let y = 0;
    let z = 0;
    for (const indice of indices) { x += malha.vertices[indice][0]; y += malha.vertices[indice][1]; z += malha.vertices[indice][2]; }
    const total = indices.length || 1;
    return [x / total, y / total, z / total];
};

// Extrude de uma face: duplica seus vértices, cria a face-tampa nova + faces laterais (quads) ligando antiga↔nova. A face original é removida (vira interior).
export function extrudaFace(malha: MalhaEditavelLocal, idFace: string): { malha: MalhaEditavelLocal; idNovaFace: string; indicesNovaFace: number[]; } {
    const face = malha.faces.find(item => item.id === idFace);
    if (!face) return { malha, idNovaFace: idFace, indicesNovaFace: [] };

    const baseIndice = malha.vertices.length;
    const novosVertices: Vetor3Malha[] = face.indicesVertices.map(indice => [malha.vertices[indice][0], malha.vertices[indice][1], malha.vertices[indice][2]]);
    const vertices: Vetor3Malha[] = [...malha.vertices, ...novosVertices];
    const indicesNovaFace = face.indicesVertices.map((_, posicao) => baseIndice + posicao);

    let proximoIdFace = malha.proximoIdFace;
    const faces: FaceMalhaLocal[] = malha.faces.filter(item => item.id !== idFace);

    const idNovaFace = `f${proximoIdFace}`;
    proximoIdFace += 1;
    faces.push({ id: idNovaFace, nome: 'Extrude Tampa', indicesVertices: indicesNovaFace });

    const total = face.indicesVertices.length;
    for (let i = 0; i < total; i += 1) {
        const i2 = (i + 1) % total;
        const vi = face.indicesVertices[i];
        const vi2 = face.indicesVertices[i2];
        const ni = indicesNovaFace[i];
        const ni2 = indicesNovaFace[i2];
        faces.push({ id: `f${proximoIdFace}`, nome: `Extrude Lateral ${i + 1}`, indicesVertices: [vi, vi2, ni2, ni] });
        proximoIdFace += 1;
    }

    return { malha: { vertices, faces, proximoIdFace }, idNovaFace, indicesNovaFace };
};

function faceContemArestaConsecutiva(face: FaceMalhaLocal, x: number, y: number): boolean {
    const ids = face.indicesVertices;
    for (let i = 0; i < ids.length; i += 1) {
        const p = ids[i];
        const q = ids[(i + 1) % ids.length];
        if ((p === x && q === y) || (p === y && q === x)) return true;
    }
    return false;
};

// Vizinho de `v` numa face que não é `oposto` (usado nas faces de borda da aresta, onde v e oposto são adjacentes).
function vizinhoOpostoNaFace(face: FaceMalhaLocal, v: number, oposto: number): number {
    const ids = face.indicesVertices;
    const p = ids.indexOf(v);
    const n = ids.length;
    const prev = ids[(p - 1 + n) % n];
    const next = ids[(p + 1) % n];
    return prev === oposto ? next : prev;
};

// Bevel/chamfer de 1 aresta manifold (a,b): recua os extremos dentro de cada face adjacente, cria a face do chanfro e fecha as faces vizinhas.
export function chanframaAresta(malha: MalhaEditavelLocal, a: number, b: number, amount: number): { malha: MalhaEditavelLocal; indicesChanfro: number[] } {
    const facesAresta = malha.faces.filter(face => faceContemArestaConsecutiva(face, a, b));
    if (facesAresta.length !== 2) return { malha, indicesChanfro: [] };
    const f1 = facesAresta[0];
    const f2 = facesAresta[1];

    function recua(origem: number, alvo: number): Vetor3Malha {
        const po = malha.vertices[origem];
        const pa = malha.vertices[alvo];
        return [po[0] + amount * (pa[0] - po[0]), po[1] + amount * (pa[1] - po[1]), po[2] + amount * (pa[2] - po[2])];
    };

    const base = malha.vertices.length;
    const vA1 = base;
    const vA2 = base + 1;
    const vB1 = base + 2;
    const vB2 = base + 3;
    const vertices: Vetor3Malha[] = [
        ...malha.vertices,
        recua(a, vizinhoOpostoNaFace(f1, a, b)),
        recua(a, vizinhoOpostoNaFace(f2, a, b)),
        recua(b, vizinhoOpostoNaFace(f1, b, a)),
        recua(b, vizinhoOpostoNaFace(f2, b, a)),
    ];

    function trocaSimples(face: FaceMalhaLocal, paraA: number, paraB: number): FaceMalhaLocal {
        return { ...face, indicesVertices: face.indicesVertices.map(idx => idx === a ? paraA : idx === b ? paraB : idx) };
    };

    function expandeFaceVizinha(face: FaceMalhaLocal): FaceMalhaLocal {
        const ids = face.indicesVertices;
        const novo: number[] = [];
        for (let i = 0; i < ids.length; i += 1) {
            const v = ids[i];
            if (v !== a && v !== b) { novo.push(v); continue; }
            const prev = ids[(i - 1 + ids.length) % ids.length];
            const ladoF1 = v === a ? vA1 : vB1;
            const ladoF2 = v === a ? vA2 : vB2;
            if (faceContemArestaConsecutiva(f1, prev, v)) novo.push(ladoF1, ladoF2);
            else novo.push(ladoF2, ladoF1);
        }
        return { ...face, indicesVertices: novo };
    };

    let proximoIdFace = malha.proximoIdFace;
    const faces: FaceMalhaLocal[] = malha.faces.map(face => {
        if (face.id === f1.id) return trocaSimples(face, vA1, vB1);
        if (face.id === f2.id) return trocaSimples(face, vA2, vB2);
        if (face.indicesVertices.includes(a) || face.indicesVertices.includes(b)) return expandeFaceVizinha(face);
        return face;
    });

    const indicesChanfro = [vA1, vA2, vB2, vB1];
    faces.push({ id: `f${proximoIdFace}`, nome: 'Chanfro', indicesVertices: indicesChanfro });
    proximoIdFace += 1;

    return { malha: { vertices, faces, proximoIdFace }, indicesChanfro };
};
