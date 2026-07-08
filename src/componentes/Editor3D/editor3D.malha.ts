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

// Esfera UV raio 0.5: polo sul + anéis intermediários + polo norte; fans triangulares nos polos e quads entre anéis (winding consistente com o cilindro).
export function criaMalhaEsfera(segmentos = 16): MalhaEditavelLocal {
    const r = 0.5;
    const aneis = Math.max(3, Math.round(segmentos / 2));
    const vertices: Vetor3Malha[] = [[0, -r, 0]];
    for (let i = 1; i < aneis; i++) {
        const teta = (i / aneis) * Math.PI;
        const y = -Math.cos(teta) * r;
        const raioAnel = Math.sin(teta) * r;
        for (let j = 0; j < segmentos; j++) { const a = (j / segmentos) * Math.PI * 2; vertices.push([Math.cos(a) * raioAnel, y, Math.sin(a) * raioAnel]); }
    }
    vertices.push([0, r, 0]);

    const indiceAnel = (i: number, j: number): number => 1 + (i - 1) * segmentos + (j % segmentos);
    const poloSul = 0;
    const poloNorte = vertices.length - 1;
    const faces: FaceMalhaLocal[] = [];
    let idFace = 0;
    for (let j = 0; j < segmentos; j++) { idFace += 1; faces.push(face(idFace, `Polo Sul ${j + 1}`, [poloSul, indiceAnel(1, j), indiceAnel(1, j + 1)])); }
    for (let i = 1; i < aneis - 1; i++) {
        for (let j = 0; j < segmentos; j++) { idFace += 1; faces.push(face(idFace, `Gomo ${idFace}`, [indiceAnel(i, j), indiceAnel(i + 1, j), indiceAnel(i + 1, j + 1), indiceAnel(i, j + 1)])); }
    }
    for (let j = 0; j < segmentos; j++) { idFace += 1; faces.push(face(idFace, `Polo Norte ${j + 1}`, [poloNorte, indiceAnel(aneis - 1, j + 1), indiceAnel(aneis - 1, j)])); }

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

// Teto de níveis de subdivisão de exibição por objeto (cada nível multiplica as faces por ~4; 3 é o limite prático em JS).
export const MAXIMO_SUBDIVISAO_MALHA_EDITOR3D = 3;

// Superfície de subdivisão Catmull-Clark (o mecanismo Maya/Blender de forma orgânica): cada n-gon vira n quads e a malha
// converge para uma superfície lisa — modela-se a GAIOLA simples (caixas/segmentos) e a subdivisão entrega a organicidade.
// Suporta malhas fechadas (e bordas, com regra de midpoint); múltiplas cascas desconexas na mesma malha funcionam.
export function subdivideMalhaCatmullClark(malha: MalhaEditavelLocal, iteracoes = 1): MalhaEditavelLocal {
    let atual = malha;
    for (let n = 0; n < iteracoes; n++) atual = subdivideUmaVezCatmullClark(atual);
    return atual;
};

function subdivideUmaVezCatmullClark(malha: MalhaEditavelLocal): MalhaEditavelLocal {
    const antigos = malha.vertices;
    const facesAntigas = malha.faces;
    const pontosFace: Vetor3Malha[] = facesAntigas.map(face => centroideDaMalha(malha, face.indicesVertices));

    type ArestaSubdivisao = { a: number; b: number; facesIncidentes: number[]; indicePonto: number; };
    const arestasPorChave = new Map<string, ArestaSubdivisao>();
    const chaveAresta = (a: number, b: number): string => a < b ? `${a}-${b}` : `${b}-${a}`;
    facesAntigas.forEach((face, indiceFace) => {
        const ids = face.indicesVertices;
        for (let i = 0; i < ids.length; i++) {
            const chave = chaveAresta(ids[i], ids[(i + 1) % ids.length]);
            let aresta = arestasPorChave.get(chave);
            if (!aresta) { aresta = { a: ids[i], b: ids[(i + 1) % ids.length], facesIncidentes: [], indicePonto: -1 }; arestasPorChave.set(chave, aresta); }
            aresta.facesIncidentes.push(indiceFace);
        }
    });

    const facesDoVertice: number[][] = antigos.map(() => []);
    facesAntigas.forEach((face, indiceFace) => { for (const v of face.indicesVertices) facesDoVertice[v].push(indiceFace); });
    const arestasDoVertice: ArestaSubdivisao[][] = antigos.map(() => []);
    for (const aresta of arestasPorChave.values()) { arestasDoVertice[aresta.a].push(aresta); arestasDoVertice[aresta.b].push(aresta); }

    const soma = (destino: Vetor3Malha, origem: readonly [number, number, number]): void => { destino[0] += origem[0]; destino[1] += origem[1]; destino[2] += origem[2]; };
    const vertices: Vetor3Malha[] = [];

    // Vértices originais reposicionados: (F + 2R + (n-3)P) / n, com F = média dos pontos de face e R = média dos meios das arestas incidentes.
    for (let v = 0; v < antigos.length; v++) {
        const valencia = arestasDoVertice[v].length;
        if (valencia === 0) { vertices.push([antigos[v][0], antigos[v][1], antigos[v][2]]); continue; }
        const mediaFaces: Vetor3Malha = [0, 0, 0];
        for (const indiceFace of facesDoVertice[v]) soma(mediaFaces, pontosFace[indiceFace]);
        const totalFaces = facesDoVertice[v].length || 1;
        const mediaMeios: Vetor3Malha = [0, 0, 0];
        for (const aresta of arestasDoVertice[v]) soma(mediaMeios, [(antigos[aresta.a][0] + antigos[aresta.b][0]) / 2, (antigos[aresta.a][1] + antigos[aresta.b][1]) / 2, (antigos[aresta.a][2] + antigos[aresta.b][2]) / 2]);
        const novo: Vetor3Malha = [0, 0, 0];
        for (let eixo = 0; eixo < 3; eixo++) novo[eixo] = (mediaFaces[eixo] / totalFaces + 2 * (mediaMeios[eixo] / valencia) + (valencia - 3) * antigos[v][eixo]) / valencia;
        vertices.push(novo);
    }

    const baseFaces = vertices.length;
    for (const ponto of pontosFace) vertices.push([ponto[0], ponto[1], ponto[2]]);

    for (const aresta of arestasPorChave.values()) {
        aresta.indicePonto = vertices.length;
        const meio: Vetor3Malha = [(antigos[aresta.a][0] + antigos[aresta.b][0]) / 2, (antigos[aresta.a][1] + antigos[aresta.b][1]) / 2, (antigos[aresta.a][2] + antigos[aresta.b][2]) / 2];
        if (aresta.facesIncidentes.length === 2) {
            const f1 = pontosFace[aresta.facesIncidentes[0]];
            const f2 = pontosFace[aresta.facesIncidentes[1]];
            vertices.push([(antigos[aresta.a][0] + antigos[aresta.b][0] + f1[0] + f2[0]) / 4, (antigos[aresta.a][1] + antigos[aresta.b][1] + f1[1] + f2[1]) / 4, (antigos[aresta.a][2] + antigos[aresta.b][2] + f1[2] + f2[2]) / 4]);
        } else {
            vertices.push(meio);
        }
    }

    const faces: FaceMalhaLocal[] = [];
    let idFace = 0;
    facesAntigas.forEach((face, indiceFace) => {
        const ids = face.indicesVertices;
        const total = ids.length;
        for (let i = 0; i < total; i++) {
            const arestaSeguinte = arestasPorChave.get(chaveAresta(ids[i], ids[(i + 1) % total]));
            const arestaAnterior = arestasPorChave.get(chaveAresta(ids[(i - 1 + total) % total], ids[i]));
            if (!arestaSeguinte || !arestaAnterior) continue;
            idFace += 1;
            faces.push({ id: `f${idFace}`, nome: face.nome, indicesVertices: [ids[i], arestaSeguinte.indicePonto, baseFaces + indiceFace, arestaAnterior.indicePonto] });
        }
    });

    return { vertices, faces, proximoIdFace: idFace + 1 };
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

// Remove vértices órfãos (não referenciados por nenhuma face) e remapeia os índices das faces.
function removeVerticesOrfaosDaMalha(vertices: readonly Vetor3Malha[], faces: readonly FaceMalhaLocal[]): { vertices: Vetor3Malha[]; faces: FaceMalhaLocal[]; remapa: Map<number, number> } {
    const usados = new Set<number>();
    for (const face of faces) for (const indice of face.indicesVertices) usados.add(indice);
    const remapa = new Map<number, number>();
    const novos: Vetor3Malha[] = [];
    for (let i = 0; i < vertices.length; i += 1) { if (usados.has(i)) { remapa.set(i, novos.length); novos.push([vertices[i][0], vertices[i][1], vertices[i][2]]); } }
    return { vertices: novos, faces: faces.map(face => ({ ...face, indicesVertices: face.indicesVertices.map(indice => remapa.get(indice) ?? 0) })), remapa };
};

// Corte de anel (loop cut): insere um anel de arestas atravessando a sequência de QUADS perpendicular à aresta (a,b).
// Caminha de quad em quad pela aresta oposta até fechar o anel ou parar em borda/face não-quad (anel aberto); nas pontas
// abertas o ponto médio terminal é inserido também na face vizinha que interrompeu (tri/n-gon ganha um vértice — sem T-junction).
export function cortaAnelAresta(malha: MalhaEditavelLocal, a: number, b: number): { malha: MalhaEditavelLocal; indicesNovoAnel: number[] } | null {
    const chave = (x: number, y: number): string => x < y ? `${x}-${y}` : `${y}-${x}`;
    const facesPorAresta = new Map<string, FaceMalhaLocal[]>();
    for (const face of malha.faces) {
        const ids = face.indicesVertices;
        for (let i = 0; i < ids.length; i += 1) {
            const k = chave(ids[i], ids[(i + 1) % ids.length]);
            const lista = facesPorAresta.get(k);
            if (lista) lista.push(face); else facesPorAresta.set(k, [face]);
        }
    }

    function arestaOposta(face: FaceMalhaLocal, u: number, v: number): [number, number] | null {
        if (face.indicesVertices.length !== 4) return null;
        const ids = face.indicesVertices;
        const i = ids.findIndex((id, idx) => (id === u && ids[(idx + 1) % 4] === v) || (id === v && ids[(idx + 1) % 4] === u));
        if (i < 0) return null;
        return [ids[(i + 2) % 4], ids[(i + 3) % 4]];
    };

    // Sequência do anel: em anel aberto, arestas.length === quadsAnel.length + 1; fechado, comprimentos iguais.
    const arestas: [number, number][] = [[a, b]];
    const quadsAnel: FaceMalhaLocal[] = [];
    const arestasVisitadas = new Set<string>([chave(a, b)]);
    const quadsUsados = new Set<string>();
    let fechado = false;

    function caminhaDesde(acrescentaNoFim: boolean): void {
        let atual = acrescentaNoFim ? arestas[arestas.length - 1] : arestas[0];
        for (;;) {
            const proxima = (facesPorAresta.get(chave(atual[0], atual[1])) ?? []).find(face => !quadsUsados.has(face.id) && face.indicesVertices.length === 4);
            if (!proxima) return;
            const oposta = arestaOposta(proxima, atual[0], atual[1]);
            if (!oposta) return;
            quadsUsados.add(proxima.id);
            if (acrescentaNoFim) quadsAnel.push(proxima); else quadsAnel.unshift(proxima);
            if (chave(oposta[0], oposta[1]) === chave(a, b)) { fechado = true; return; }
            if (arestasVisitadas.has(chave(oposta[0], oposta[1]))) return;
            arestasVisitadas.add(chave(oposta[0], oposta[1]));
            if (acrescentaNoFim) arestas.push(oposta); else arestas.unshift(oposta);
            atual = oposta;
        }
    };

    caminhaDesde(true);
    if (!fechado) caminhaDesde(false);
    if (quadsAnel.length === 0) return null;

    const vertices: Vetor3Malha[] = malha.vertices.map(vertice => [vertice[0], vertice[1], vertice[2]]);
    const meioPorChave = new Map<string, number>();
    for (const [u, v] of arestas) {
        const k = chave(u, v);
        if (meioPorChave.has(k)) continue;
        meioPorChave.set(k, vertices.length);
        vertices.push([(vertices[u][0] + vertices[v][0]) / 2, (vertices[u][1] + vertices[v][1]) / 2, (vertices[u][2] + vertices[v][2]) / 2]);
    }

    let proximoIdFace = malha.proximoIdFace;
    const idsQuadsAnel = new Set(quadsAnel.map(face => face.id));
    const facesNovas: FaceMalhaLocal[] = [];
    for (let j = 0; j < quadsAnel.length; j += 1) {
        const quad = quadsAnel[j];
        const entrada = arestas[j];
        const ids = quad.indicesVertices;
        const i = ids.findIndex((id, idx) => { const seguinte = ids[(idx + 1) % 4]; return (id === entrada[0] && seguinte === entrada[1]) || (id === entrada[1] && seguinte === entrada[0]); });
        if (i < 0) continue;
        const p0 = ids[i];
        const p1 = ids[(i + 1) % 4];
        const p2 = ids[(i + 2) % 4];
        const p3 = ids[(i + 3) % 4];
        const m1 = meioPorChave.get(chave(p0, p1));
        const m2 = meioPorChave.get(chave(p2, p3));
        if (m1 === undefined || m2 === undefined) continue;
        facesNovas.push({ id: `f${proximoIdFace}`, nome: quad.nome, indicesVertices: [p0, m1, m2, p3] });
        proximoIdFace += 1;
        facesNovas.push({ id: `f${proximoIdFace}`, nome: quad.nome, indicesVertices: [m1, p1, p2, m2] });
        proximoIdFace += 1;
    }

    // Pontas do anel aberto: insere o ponto médio terminal na face vizinha não-quad (interior do anel já é consistente por construção).
    const facesAjustadas = malha.faces.filter(face => !idsQuadsAnel.has(face.id)).map(face => {
        if (fechado) return face;
        let ids = [...face.indicesVertices];
        for (const terminal of [arestas[0], arestas[arestas.length - 1]]) {
            const meio = meioPorChave.get(chave(terminal[0], terminal[1]));
            if (meio === undefined) continue;
            for (let i = 0; i < ids.length; i += 1) {
                if (chave(ids[i], ids[(i + 1) % ids.length]) === chave(terminal[0], terminal[1])) { ids = [...ids.slice(0, i + 1), meio, ...ids.slice(i + 1)]; break; }
            }
        }
        return ids.length === face.indicesVertices.length ? face : { ...face, indicesVertices: ids };
    });

    return { malha: { vertices, faces: [...facesAjustadas, ...facesNovas], proximoIdFace }, indicesNovoAnel: [...meioPorChave.values()] };
};

// Inset da face: encolhe a face em direção ao centróide criando uma moldura de quads (o "extrude sem altura + escala" da modelagem de gaiola).
export function insetaFace(malha: MalhaEditavelLocal, idFace: string, fator = 0.3): { malha: MalhaEditavelLocal; idNovaFace: string; indicesNovaFace: number[] } {
    const face = malha.faces.find(item => item.id === idFace);
    if (!face) return { malha, idNovaFace: idFace, indicesNovaFace: [] };

    const centro = centroideDaMalha(malha, face.indicesVertices);
    const base = malha.vertices.length;
    const novosVertices: Vetor3Malha[] = face.indicesVertices.map(indice => { const v = malha.vertices[indice]; return [v[0] + fator * (centro[0] - v[0]), v[1] + fator * (centro[1] - v[1]), v[2] + fator * (centro[2] - v[2])]; });
    const vertices: Vetor3Malha[] = [...malha.vertices, ...novosVertices];
    const indicesNovaFace = face.indicesVertices.map((_, posicao) => base + posicao);

    let proximoIdFace = malha.proximoIdFace;
    const faces: FaceMalhaLocal[] = malha.faces.filter(item => item.id !== idFace);
    const idNovaFace = `f${proximoIdFace}`;
    proximoIdFace += 1;
    faces.push({ id: idNovaFace, nome: 'Inset', indicesVertices: indicesNovaFace });

    const total = face.indicesVertices.length;
    for (let i = 0; i < total; i += 1) {
        const i2 = (i + 1) % total;
        faces.push({ id: `f${proximoIdFace}`, nome: `Inset Moldura ${i + 1}`, indicesVertices: [face.indicesVertices[i], face.indicesVertices[i2], indicesNovaFace[i2], indicesNovaFace[i]] });
        proximoIdFace += 1;
    }

    return { malha: { vertices, faces, proximoIdFace }, idNovaFace, indicesNovaFace };
};

// Exclui faces por id; vértices órfãos são removidos com remapeamento. Bloqueado se a malha ficaria sem faces.
export function excluiFacesDaMalha(malha: MalhaEditavelLocal, idsFaces: readonly string[]): MalhaEditavelLocal | null {
    const alvo = new Set(idsFaces);
    const restantes = malha.faces.filter(face => !alvo.has(face.id));
    if (restantes.length === 0 || restantes.length === malha.faces.length) return null;

    const podados = removeVerticesOrfaosDaMalha(malha.vertices, restantes);
    return { vertices: podados.vertices, faces: podados.faces, proximoIdFace: malha.proximoIdFace };
};

// Exclui vértices: toda face que toca qualquer um deles some; órfãos removidos. Bloqueado se a malha ficaria sem faces.
export function excluiVerticesDaMalha(malha: MalhaEditavelLocal, indices: readonly number[]): MalhaEditavelLocal | null {
    const alvo = new Set(indices);
    const restantes = malha.faces.filter(face => !face.indicesVertices.some(indice => alvo.has(indice)));
    if (restantes.length === 0 || restantes.length === malha.faces.length) return null;

    const podados = removeVerticesOrfaosDaMalha(malha.vertices, restantes);
    return { vertices: podados.vertices, faces: podados.faces, proximoIdFace: malha.proximoIdFace };
};

// Espelha a malha no plano X=0 LOCAL e solda os vértices do plano (|x| < epsilon): o fluxo é modelar uma metade
// (removendo a face da costura com Excluir) e espelhar a outra. Faces espelhadas têm o winding invertido (reflexão
// troca a orientação); faces inteiramente no plano não são duplicadas.
export function espelhaMalhaX(malha: MalhaEditavelLocal, epsilon = 0.0001): MalhaEditavelLocal {
    const vertices: Vetor3Malha[] = malha.vertices.map(vertice => Math.abs(vertice[0]) < epsilon ? [0, vertice[1], vertice[2]] : [vertice[0], vertice[1], vertice[2]]);
    const espelhoDe = new Map<number, number>();
    const totalOriginais = vertices.length;
    for (let i = 0; i < totalOriginais; i += 1) {
        if (vertices[i][0] === 0) { espelhoDe.set(i, i); continue; }
        espelhoDe.set(i, vertices.length);
        vertices.push([-vertices[i][0], vertices[i][1], vertices[i][2]]);
    }

    let proximoIdFace = malha.proximoIdFace;
    const faces: FaceMalhaLocal[] = [...malha.faces];
    for (const face of malha.faces) {
        const idsEspelho = face.indicesVertices.map(indice => espelhoDe.get(indice) ?? indice);
        if (idsEspelho.every((id, i) => id === face.indicesVertices[i])) continue;
        faces.push({ id: `f${proximoIdFace}`, nome: `${face.nome} (espelho)`, indicesVertices: [...idsEspelho].reverse() });
        proximoIdFace += 1;
    }

    return { vertices, faces, proximoIdFace };
};

// Funde (weld) os vértices selecionados no centróide deles: faces degeneradas (índice repetido ou menos de 3 vértices) somem; órfãos removidos.
export function fundeVerticesDaMalha(malha: MalhaEditavelLocal, indices: readonly number[]): { malha: MalhaEditavelLocal; indiceFundido: number } | null {
    if (indices.length < 2) return null;

    const alvo = new Set(indices);
    const destino = Math.min(...indices);
    const centro: Vetor3Malha = [0, 0, 0];
    for (const indice of indices) { centro[0] += malha.vertices[indice][0]; centro[1] += malha.vertices[indice][1]; centro[2] += malha.vertices[indice][2]; }
    centro[0] /= indices.length;
    centro[1] /= indices.length;
    centro[2] /= indices.length;

    const vertices: Vetor3Malha[] = malha.vertices.map((vertice, i) => i === destino ? centro : [vertice[0], vertice[1], vertice[2]]);
    const faces: FaceMalhaLocal[] = [];
    for (const face of malha.faces) {
        const remapeados = face.indicesVertices.map(indice => alvo.has(indice) ? destino : indice);
        const compactados: number[] = [];
        for (const indice of remapeados) if (compactados[compactados.length - 1] !== indice) compactados.push(indice);
        while (compactados.length > 1 && compactados[0] === compactados[compactados.length - 1]) compactados.pop();
        if (compactados.length >= 3 && new Set(compactados).size === compactados.length) faces.push({ ...face, indicesVertices: compactados });
    }
    if (faces.length === 0) return null;

    const podados = removeVerticesOrfaosDaMalha(vertices, faces);
    const indiceFundido = podados.remapa.get(destino);
    if (indiceFundido === undefined) return null;

    return { malha: { vertices: podados.vertices, faces: podados.faces, proximoIdFace: malha.proximoIdFace }, indiceFundido };
};
