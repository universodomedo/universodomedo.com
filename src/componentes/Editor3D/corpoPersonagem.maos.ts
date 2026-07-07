import { subdivideMalhaCatmullClark, type FaceMalhaLocal, type MalhaEditavelLocal, type Vetor3Malha } from './editor3D.malha';

// Mão do Personagem MODELADA como em um editor de verdade (Maya/Blender): gaiolas de quads — palma + 4 dedos + polegar,
// cada dedo uma forma própria (segmento afunilado) — suavizadas por superfície de subdivisão Catmull-Clark.
// Dimensões em metros, espaço local: origem no punho, dedos para -Y, polegar para +Z (frente); simétrica em X (serve às duas mãos).

type SecaoCage = readonly [number, number];

function normaliza(vetor: Vetor3Malha): Vetor3Malha {
    const comprimento = Math.hypot(vetor[0], vetor[1], vetor[2]) || 1;
    return [vetor[0] / comprimento, vetor[1] / comprimento, vetor[2] / comprimento];
};

function cruzado(a: Vetor3Malha, b: Vetor3Malha): Vetor3Malha { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; };

// Segmento-gaiola: caixa afunilada com N seções (anéis de 4 vértices perpendiculares à direção), fechada por tampas — winding igual ao do cilindro.
function criaSegmentoCage(base: Vetor3Malha, direcao: Vetor3Malha, comprimento: number, secoes: readonly SecaoCage[]): MalhaEditavelLocal {
    const eixo = normaliza(direcao);
    const referencia: Vetor3Malha = Math.abs(eixo[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    const lado1 = normaliza(cruzado(eixo, referencia));
    const lado2 = cruzado(eixo, lado1);

    const vertices: Vetor3Malha[] = [];
    for (let anel = 0; anel < secoes.length; anel++) {
        const t = anel / (secoes.length - 1);
        const centro: Vetor3Malha = [base[0] + eixo[0] * comprimento * t, base[1] + eixo[1] * comprimento * t, base[2] + eixo[2] * comprimento * t];
        const [meia1, meia2] = secoes[anel];
        const cantos: readonly [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
        for (const [sinal1, sinal2] of cantos) vertices.push([centro[0] + lado1[0] * meia1 * sinal1 + lado2[0] * meia2 * sinal2, centro[1] + lado1[1] * meia1 * sinal1 + lado2[1] * meia2 * sinal2, centro[2] + lado1[2] * meia1 * sinal1 + lado2[2] * meia2 * sinal2]);
    }

    const faces: FaceMalhaLocal[] = [];
    let idFace = 0;
    for (let anel = 0; anel < secoes.length - 1; anel++) {
        for (let canto = 0; canto < 4; canto++) {
            const proximo = (canto + 1) % 4;
            idFace += 1;
            faces.push({ id: `f${idFace}`, nome: `Lateral ${idFace}`, indicesVertices: [anel * 4 + canto, (anel + 1) * 4 + canto, (anel + 1) * 4 + proximo, anel * 4 + proximo] });
        }
    }
    idFace += 1;
    faces.push({ id: `f${idFace}`, nome: 'Base', indicesVertices: [0, 1, 2, 3] });
    idFace += 1;
    const topo = (secoes.length - 1) * 4;
    faces.push({ id: `f${idFace}`, nome: 'Ponta', indicesVertices: [topo + 3, topo + 2, topo + 1, topo] });

    return { vertices, faces, proximoIdFace: idFace + 1 };
};

// Une gaiolas independentes numa malha só (cascas desconexas convivem na mesma malha e subdividem juntas).
function fundeMalhasCage(malhas: readonly MalhaEditavelLocal[]): MalhaEditavelLocal {
    const vertices: Vetor3Malha[] = [];
    const faces: FaceMalhaLocal[] = [];
    let idFace = 0;
    for (const malha of malhas) {
        const base = vertices.length;
        for (const vertice of malha.vertices) vertices.push(vertice);
        for (const face of malha.faces) { idFace += 1; faces.push({ id: `f${idFace}`, nome: face.nome, indicesVertices: face.indicesVertices.map(indice => base + indice) }); }
    }
    return { vertices, faces, proximoIdFace: idFace + 1 };
};

// Gaiola da mão: palma trapezoidal + 4 dedos em leque (mindinho→indicador) + polegar angulado para a frente.
export function criaMalhaMaoCorpoPersonagem(): MalhaEditavelLocal {
    const partes: MalhaEditavelLocal[] = [];
    partes.push(criaSegmentoCage([0, 0, 0], [0, -1, 0], 0.095, [[0.03, 0.014], [0.044, 0.017], [0.046, 0.015]]));

    const dedos: readonly { readonly z: number; readonly comprimento: number }[] = [
        { z: -0.034, comprimento: 0.05 },
        { z: -0.0115, comprimento: 0.064 },
        { z: 0.0115, comprimento: 0.07 },
        { z: 0.034, comprimento: 0.062 },
    ];
    for (const dedo of dedos) partes.push(criaSegmentoCage([0, -0.088, dedo.z], [0, -1, dedo.z * 1.4], dedo.comprimento, [[0.0085, 0.0075], [0.0075, 0.0068], [0.0055, 0.005]]));

    partes.push(criaSegmentoCage([0, -0.035, 0.042], [0, -0.62, 0.78], 0.055, [[0.01, 0.009], [0.0085, 0.008], [0.0065, 0.006]]));

    return fundeMalhasCage(partes);
};

// Malha final da mão (gaiola suavizada por 2 iterações de Catmull-Clark), pronta para virar geometria com normais suaves.
export function criaMalhaMaoSuavizadaCorpoPersonagem(): MalhaEditavelLocal { return subdivideMalhaCatmullClark(criaMalhaMaoCorpoPersonagem(), 2); };
