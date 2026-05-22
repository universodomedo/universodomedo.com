import { adicionaLinhaEditor3D, adicionaVerticeEditor3D, criaGeometriaEditor3D } from '../editor3D.geometria.base';
import { corEixoXBase, corEixoXLuz, corEixoYBase, corEixoYLuz, corEixoZBase, corEixoZLuz } from './editor3D.geometria.guiaCores';
import type { GeometriaEditor3D, GuiaEditor3D } from '../editor3D.geometria.types';
import type { Vetor3 } from '../../editor/editor3D.tipos';

function atenuaCorEixoNegativo(cor: Vetor3): Vetor3 { return [cor[0] * 0.42, cor[1] * 0.42, cor[2] * 0.42]; };

function criaCoresEixo(eixo: 'X' | 'Y' | 'Z', negativo = false): { readonly corBase: Vetor3; readonly corLuz: Vetor3 } {
    if (eixo === 'X') return { corBase: negativo ? atenuaCorEixoNegativo(corEixoXBase) : corEixoXBase, corLuz: negativo ? atenuaCorEixoNegativo(corEixoXLuz) : corEixoXLuz };
    if (eixo === 'Y') return { corBase: negativo ? atenuaCorEixoNegativo(corEixoYBase) : corEixoYBase, corLuz: negativo ? atenuaCorEixoNegativo(corEixoYLuz) : corEixoYLuz };

    return { corBase: negativo ? atenuaCorEixoNegativo(corEixoZBase) : corEixoZBase, corLuz: negativo ? atenuaCorEixoNegativo(corEixoZLuz) : corEixoZLuz };
};

function criaGeometriaEixoCompleto(eixo: 'X' | 'Y' | 'Z', tamanho: number): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const metade = tamanho / 2;

    if (eixo === 'X') adicionaLinhaEditor3D(vertices, normais, [-metade, 0, 0], [metade, 0, 0], [0, 0, 1]);
    if (eixo === 'Y') adicionaLinhaEditor3D(vertices, normais, [0, -metade, 0], [0, metade, 0], [0, 0, 1]);
    if (eixo === 'Z') adicionaLinhaEditor3D(vertices, normais, [0, 0, -metade], [0, 0, metade], [0, 1, 0]);

    return criaGeometriaEditor3D(vertices, normais, 'LINHAS');
};

function criaGeometriaEixoPositivo(eixo: 'X' | 'Y' | 'Z', tamanho: number): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];

    if (eixo === 'X') adicionaLinhaEditor3D(vertices, normais, [0, 0, 0], [tamanho, 0, 0], [0, 0, 1]);
    if (eixo === 'Y') adicionaLinhaEditor3D(vertices, normais, [0, 0, 0], [0, tamanho, 0], [0, 0, 1]);
    if (eixo === 'Z') adicionaLinhaEditor3D(vertices, normais, [0, 0, 0], [0, 0, tamanho], [0, 1, 0]);

    return criaGeometriaEditor3D(vertices, normais, 'LINHAS');
};

function criaGeometriaEixoNegativo(eixo: 'X' | 'Y' | 'Z', tamanho: number): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];

    if (eixo === 'X') adicionaLinhaEditor3D(vertices, normais, [0, 0, 0], [-tamanho, 0, 0], [0, 0, 1]);
    if (eixo === 'Y') adicionaLinhaEditor3D(vertices, normais, [0, 0, 0], [0, -tamanho, 0], [0, 0, 1]);
    if (eixo === 'Z') adicionaLinhaEditor3D(vertices, normais, [0, 0, 0], [0, 0, -tamanho], [0, 1, 0]);

    return criaGeometriaEditor3D(vertices, normais, 'LINHAS');
};

function criaGeometriaPontoEixo(eixo: 'X' | 'Y' | 'Z', tamanho: number): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];

    if (eixo === 'X') adicionaVerticeEditor3D(vertices, normais, [tamanho, 0, 0], [0, 0, 1]);
    if (eixo === 'Y') adicionaVerticeEditor3D(vertices, normais, [0, tamanho, 0], [0, 0, 1]);
    if (eixo === 'Z') adicionaVerticeEditor3D(vertices, normais, [0, 0, tamanho], [0, 1, 0]);

    return criaGeometriaEditor3D(vertices, normais, 'PONTOS');
};

export function criaGuiaEixoCompletoEditor3D(eixo: 'X' | 'Y' | 'Z', tamanho: number): GuiaEditor3D { return { geometria: criaGeometriaEixoCompleto(eixo, tamanho), ...criaCoresEixo(eixo) }; };
export function criaGuiaEixoPositivoEditor3D(eixo: 'X' | 'Y' | 'Z', tamanho: number): GuiaEditor3D { return { geometria: criaGeometriaEixoPositivo(eixo, tamanho), ...criaCoresEixo(eixo) }; };
export function criaGuiaEixoNegativoEditor3D(eixo: 'X' | 'Y' | 'Z', tamanho: number): GuiaEditor3D { return { geometria: criaGeometriaEixoNegativo(eixo, tamanho), ...criaCoresEixo(eixo, true) }; };
export function criaGuiaPontoEixoEditor3D(eixo: 'X' | 'Y' | 'Z', tamanho: number): GuiaEditor3D { return { geometria: criaGeometriaPontoEixo(eixo, tamanho), ...criaCoresEixo(eixo) }; };