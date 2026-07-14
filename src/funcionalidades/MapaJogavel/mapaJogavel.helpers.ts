import type { CenaCanonicaEditor3D, ObjetoCenaCanonicaEditor3D } from 'types-nora-api';

// O mapa jogável vive em DUAS convenções ao mesmo tempo:
// - a CENA do projeto MAPA (metros, XZ livre em torno da origem do Editor 3D);
// - o MAPA LÓGICO da Partida (milímetros, x∈[0..largura], y∈[0..altura]).
// A ponte é o bbox XZ da cena: o canto mínimo do bbox é a ORIGEM lógica (0,0); x lógico = X da cena; y lógico = Z da cena.
// Em ALTURA não há ponte nenhuma: o grid do Editor 3D (y=0 da cena) É o chão do jogo — o que o autor pousa no grid,
// pousa no chão lógico. Nunca realinhar pelo Y do bbox (fazia objeto pousado no grid flutuar em jogo).
export const MILIMETROS_POR_METRO_MAPA = 1000;

export type DimensoesMapaJogavel = {
    larguraMilimetros: number;
    alturaMilimetros: number;
    // Canto mínimo do bbox XZ em METROS da cena — a origem lógica (0,0) do mapa.
    origemXMetros: number;
    origemZMetros: number;
};

// Aplica a matrizBase (column-major, a matriz composta do objeto gravada na serialização) a um vértice local da gaiola.
function aplicaMatrizBase(matriz: readonly number[], vertice: readonly [number, number, number]): [number, number, number] {
    const [x, y, z] = vertice;
    return [
        matriz[0] * x + matriz[4] * y + matriz[8] * z + matriz[12],
        matriz[1] * x + matriz[5] * y + matriz[9] * z + matriz[13],
        matriz[2] * x + matriz[6] * y + matriz[10] * z + matriz[14],
    ];
};

function verticesMundoDoObjeto(objeto: ObjetoCenaCanonicaEditor3D): [number, number, number][] {
    if (!objeto.malhaEditavel) return [];
    return objeto.malhaEditavel.vertices.map(vertice => aplicaMatrizBase(objeto.matrizBase, [vertice[0], vertice[1], vertice[2]]));
};

// Elemento do mapa (objeto autorado no Editor 3D) traduzido pro espaço LÓGICO da Partida: posição = centro do bbox XZ (mm),
// dimensões = extensão do bbox (mm). É a ponte de autoria "objeto do mapa → interagível do config" — nada é digitado à mão.
export type ElementoDoMapaJogavel = {
    idLocal: string;
    nome: string;
    posicao: { x: number; y: number };
    larguraMilimetros: number;
    alturaMilimetros: number;
    profundidadeMilimetros: number;
};

export function elementosDoMapa(cena: CenaCanonicaEditor3D): ElementoDoMapaJogavel[] {
    const dimensoes = dimensoesMapaDaCena(cena);
    if (dimensoes === null) return [];

    const elementos: ElementoDoMapaJogavel[] = [];
    for (const objeto of cena.objetos) {
        const vertices = verticesMundoDoObjeto(objeto);
        if (vertices.length === 0) continue;
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        let minZ = Infinity;
        let maxZ = -Infinity;
        for (const [x, y, z] of vertices) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }
        elementos.push({
            idLocal: String(objeto.idLocal),
            nome: objeto.nome,
            posicao: { x: Math.round(((minX + maxX) / 2 - dimensoes.origemXMetros) * MILIMETROS_POR_METRO_MAPA), y: Math.round(((minZ + maxZ) / 2 - dimensoes.origemZMetros) * MILIMETROS_POR_METRO_MAPA) },
            larguraMilimetros: Math.round((maxX - minX) * MILIMETROS_POR_METRO_MAPA),
            alturaMilimetros: Math.round((maxY - minY) * MILIMETROS_POR_METRO_MAPA),
            profundidadeMilimetros: Math.round((maxZ - minZ) * MILIMETROS_POR_METRO_MAPA),
        });
    }
    return elementos;
};

// Dimensões lógicas do mapa derivadas do bbox XZ da cena (arredondadas a mm inteiro — o runtime valida inteiro).
export function dimensoesMapaDaCena(cena: CenaCanonicaEditor3D): DimensoesMapaJogavel | null {
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const objeto of cena.objetos) {
        for (const [x, , z] of verticesMundoDoObjeto(objeto)) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }
    }
    if (!Number.isFinite(minX) || maxX - minX <= 0 || maxZ - minZ <= 0) return null;
    return {
        larguraMilimetros: Math.round((maxX - minX) * MILIMETROS_POR_METRO_MAPA),
        alturaMilimetros: Math.round((maxZ - minZ) * MILIMETROS_POR_METRO_MAPA),
        origemXMetros: minX,
        origemZMetros: minZ,
    };
};
