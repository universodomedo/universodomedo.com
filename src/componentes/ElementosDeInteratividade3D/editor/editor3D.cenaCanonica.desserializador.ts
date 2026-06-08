import type { CenaCanonicaEditor3D, FaceMalhaEditavelCenaCanonicaEditor3D, MalhaEditavelCenaCanonicaEditor3D, ObjetoCenaCanonicaEditor3D, Vetor3CenaCanonicaEditor3D } from 'types-nora-api/shared';
import type { FaceMalhaEditavelEditor3D, MalhaEditavelEditor3D, ObjetoCenaEditor3D, Vetor3 } from './editor3D.tipos';

export interface CenaCanonicaReconstruidaEditor3D {
    readonly objetos: ObjetoCenaEditor3D[];
    readonly idsObjetosOcultosManualmente: string[];
    readonly proximoId: number;
};

function clonaVetor3Editor3D(vetor: Vetor3CenaCanonicaEditor3D): Vetor3 { return [vetor[0], vetor[1], vetor[2]]; };

function desserializaMatrizBaseEditor3D(matriz: readonly number[]): Float32Array {
    if (!Array.isArray(matriz) || matriz.length !== 16) throw new Error('Cena canonica invalida para reconstruir: matrizBase deve ter dezesseis componentes.');

    matriz.forEach((valor, indice) => {
        if (typeof valor !== 'number' || !Number.isFinite(valor)) throw new Error(`Cena canonica invalida para reconstruir: matrizBase[${indice}] deve ser numero finito.`);
    });

    return new Float32Array(matriz);
};

function desserializaFaceMalhaEditavelEditor3D(face: FaceMalhaEditavelCenaCanonicaEditor3D): FaceMalhaEditavelEditor3D {
    return { id: face.id, nome: face.nome, indicesVertices: [...face.indicesVertices] };
};

function desserializaMalhaEditavelEditor3D(malha: MalhaEditavelCenaCanonicaEditor3D | undefined): MalhaEditavelEditor3D | null {
    if (malha === undefined) return null;

    return {
        vertices: malha.vertices.map(clonaVetor3Editor3D),
        faces: malha.faces.map(desserializaFaceMalhaEditavelEditor3D),
        proximoIdFace: malha.proximoIdFace,
    };
};

function desserializaObjetoCenaCanonicaEditor3D(objeto: ObjetoCenaCanonicaEditor3D, versaoGeometria: number): ObjetoCenaEditor3D {
    return {
        id: objeto.idLocal,
        nome: objeto.nome,
        tipo: objeto.tipo,
        quantidadeVertices: objeto.quantidadeVertices,
        posicao: clonaVetor3Editor3D(objeto.posicao),
        rotacao: clonaVetor3Editor3D(objeto.rotacao),
        escala: clonaVetor3Editor3D(objeto.escala),
        matrizBase: desserializaMatrizBaseEditor3D(objeto.matrizBase),
        malhaEditavel: desserializaMalhaEditavelEditor3D(objeto.malhaEditavel),
        versaoGeometria,
        corBase: clonaVetor3Editor3D(objeto.corBase),
        corLuz: clonaVetor3Editor3D(objeto.corLuz),
        materialVisual: objeto.materialVisual,
        shader: objeto.shader,
    };
};

function obtemNumeroIdLocalCenaCanonicaEditor3D(idLocal: string): number | null {
    const prefixo = 'malha-';

    if (!idLocal.startsWith(prefixo)) return null;

    const numero = Number(idLocal.slice(prefixo.length));

    return Number.isInteger(numero) && numero > 0 ? numero : null;
};

function calculaProximoIdCenaCanonicaEditor3D(cena: CenaCanonicaEditor3D): number {
    const maiorId = cena.objetos.reduce((maior, objeto) => {
        const numero = obtemNumeroIdLocalCenaCanonicaEditor3D(objeto.idLocal);

        return numero === null ? maior : Math.max(maior, numero);
    }, 0);

    return Math.max(1, maiorId + 1);
};

function validaIdsLocaisUnicosCenaCanonicaEditor3D(cena: CenaCanonicaEditor3D): void {
    const ids = new Set<string>();

    cena.objetos.forEach(objeto => {
        if (ids.has(objeto.idLocal)) throw new Error(`Cena canonica invalida para reconstruir: idLocal duplicado [${objeto.idLocal}].`);

        ids.add(objeto.idLocal);
    });
};

export function desserializaCenaCanonicaParaEditor3D(cena: CenaCanonicaEditor3D, versaoGeometriaBase: number): CenaCanonicaReconstruidaEditor3D {
    validaIdsLocaisUnicosCenaCanonicaEditor3D(cena);

    return {
        objetos: cena.objetos.map((objeto, indice) => desserializaObjetoCenaCanonicaEditor3D(objeto, versaoGeometriaBase + indice + 1)),
        idsObjetosOcultosManualmente: cena.objetos.filter(objeto => !objeto.visivel).map(objeto => objeto.idLocal),
        proximoId: calculaProximoIdCenaCanonicaEditor3D(cena),
    };
}