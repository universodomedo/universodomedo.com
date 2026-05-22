import { adicionaTrianguloEditor3D, adicionaVerticeEditor3D, criaFaceEditor3D, criaGeometriaEditor3D, criaPontosCirculoEditor3D, normalizaVetorEditor3D } from '../editor3D.geometria.base';
import type { FaceGeometriaEditor3D, GeometriaEditor3D, TrianguloFaceEditor3D } from '../editor3D.geometria.types';
import type { Vetor3 } from '../../editor/editor3D.tipos';

function adicionaLateralCilindro(vertices: number[], normais: number[], atualX: number, atualY: number, proximoX: number, proximoY: number): TrianguloFaceEditor3D[] {
    const normalAtual = normalizaVetorEditor3D(atualX, atualY, 0);
    const normalProximo = normalizaVetorEditor3D(proximoX, proximoY, 0);
    const a: Vetor3 = [atualX, atualY, 0.45];
    const b: Vetor3 = [atualX, atualY, -0.45];
    const c: Vetor3 = [proximoX, proximoY, -0.45];
    const d: Vetor3 = [proximoX, proximoY, 0.45];

    adicionaVerticeEditor3D(vertices, normais, a, normalAtual);
    adicionaVerticeEditor3D(vertices, normais, b, normalAtual);
    adicionaVerticeEditor3D(vertices, normais, c, normalProximo);
    adicionaVerticeEditor3D(vertices, normais, a, normalAtual);
    adicionaVerticeEditor3D(vertices, normais, c, normalProximo);
    adicionaVerticeEditor3D(vertices, normais, d, normalProximo);

    return [[a, b, c], [a, c, d]];
};

export function criaGeometriaCilindroEditor3D(quantidadeVertices: number): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const faces: FaceGeometriaEditor3D[] = [];
    const triangulosTopo: TrianguloFaceEditor3D[] = [];
    const triangulosBaixo: TrianguloFaceEditor3D[] = [];
    const pontos = criaPontosCirculoEditor3D(quantidadeVertices);
    const raio = 0.48;
    const centroTopo: Vetor3 = [0, 0, 0.45];
    const centroBaixo: Vetor3 = [0, 0, -0.45];

    for (let indice = 0; indice < pontos.length; indice++) {
        const atual = pontos[indice];
        const proximo = pontos[(indice + 1) % pontos.length];
        const atualX = atual.x * raio;
        const atualY = atual.y * raio;
        const proximoX = proximo.x * raio;
        const proximoY = proximo.y * raio;
        const atualTopo: Vetor3 = [atualX, atualY, 0.45];
        const proximoTopo: Vetor3 = [proximoX, proximoY, 0.45];
        const atualBaixo: Vetor3 = [atualX, atualY, -0.45];
        const proximoBaixo: Vetor3 = [proximoX, proximoY, -0.45];

        adicionaTrianguloEditor3D(vertices, normais, centroTopo, atualTopo, proximoTopo, [0, 0, 1]);
        adicionaTrianguloEditor3D(vertices, normais, centroBaixo, proximoBaixo, atualBaixo, [0, 0, -1]);
        triangulosTopo.push([centroTopo, atualTopo, proximoTopo]);
        triangulosBaixo.push([centroBaixo, proximoBaixo, atualBaixo]);
        faces.push(criaFaceEditor3D(`cilindro-lateral-${indice + 1}`, `Side ${indice + 1}`, adicionaLateralCilindro(vertices, normais, atualX, atualY, proximoX, proximoY)));
    }

    faces.unshift(criaFaceEditor3D('cilindro-topo', 'Top', triangulosTopo));
    faces.unshift(criaFaceEditor3D('cilindro-baixo', 'Bottom', triangulosBaixo));

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS', faces);
}