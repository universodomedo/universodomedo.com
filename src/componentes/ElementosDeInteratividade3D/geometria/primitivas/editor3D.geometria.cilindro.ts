import { adicionaTrianguloEditor3D, adicionaVerticeEditor3D, criaGeometriaEditor3D, criaPontosCirculoEditor3D, normalizaVetorEditor3D } from '../editor3D.geometria.base';
import type { GeometriaEditor3D } from '../editor3D.geometria.types';

function adicionaLateralCilindro(vertices: number[], normais: number[], atualX: number, atualY: number, proximoX: number, proximoY: number): void {
    const normalAtual = normalizaVetorEditor3D(atualX, atualY, 0);
    const normalProximo = normalizaVetorEditor3D(proximoX, proximoY, 0);

    adicionaVerticeEditor3D(vertices, normais, [atualX, atualY, 0.45], normalAtual);
    adicionaVerticeEditor3D(vertices, normais, [atualX, atualY, -0.45], normalAtual);
    adicionaVerticeEditor3D(vertices, normais, [proximoX, proximoY, -0.45], normalProximo);
    adicionaVerticeEditor3D(vertices, normais, [atualX, atualY, 0.45], normalAtual);
    adicionaVerticeEditor3D(vertices, normais, [proximoX, proximoY, -0.45], normalProximo);
    adicionaVerticeEditor3D(vertices, normais, [proximoX, proximoY, 0.45], normalProximo);
};

export function criaGeometriaCilindroEditor3D(quantidadeVertices: number): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const pontos = criaPontosCirculoEditor3D(quantidadeVertices);
    const raio = 0.48;

    for (let indice = 0; indice < pontos.length; indice++) {
        const atual = pontos[indice];
        const proximo = pontos[(indice + 1) % pontos.length];
        const atualX = atual.x * raio;
        const atualY = atual.y * raio;
        const proximoX = proximo.x * raio;
        const proximoY = proximo.y * raio;

        adicionaTrianguloEditor3D(vertices, normais, [0, 0, 0.45], [atualX, atualY, 0.45], [proximoX, proximoY, 0.45], [0, 0, 1]);
        adicionaTrianguloEditor3D(vertices, normais, [0, 0, -0.45], [proximoX, proximoY, -0.45], [atualX, atualY, -0.45], [0, 0, -1]);
        adicionaLateralCilindro(vertices, normais, atualX, atualY, proximoX, proximoY);
    }

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS');
};