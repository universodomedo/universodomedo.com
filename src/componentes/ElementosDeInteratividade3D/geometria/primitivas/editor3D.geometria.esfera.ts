import { adicionaTrianguloEditor3D, criaGeometriaEditor3D, normalizaVetorEditor3D } from '../editor3D.geometria.base';
import type { GeometriaEditor3D } from '../editor3D.geometria.types';
import type { Vetor3 } from '../../editor/editor3D.tipos';

function criaPontoEsfera(theta: number, phi: number, raio: number): Vetor3 { return [Math.sin(theta) * Math.cos(phi) * raio, Math.cos(theta) * raio, Math.sin(theta) * Math.sin(phi) * raio]; };

export function criaGeometriaEsferaEditor3D(quantidadeVertices: number): GeometriaEditor3D {
    const vertices: number[] = [];
    const normais: number[] = [];
    const segmentos = Math.max(6, quantidadeVertices);
    const aneis = Math.max(3, Math.floor(segmentos / 2));
    const raio = 0.55;

    for (let anel = 0; anel < aneis; anel++) {
        const thetaAtual = (Math.PI * anel) / aneis;
        const thetaProximo = (Math.PI * (anel + 1)) / aneis;

        for (let segmento = 0; segmento < segmentos; segmento++) {
            const phiAtual = (Math.PI * 2 * segmento) / segmentos;
            const phiProximo = (Math.PI * 2 * (segmento + 1)) / segmentos;
            const a = criaPontoEsfera(thetaAtual, phiAtual, raio);
            const b = criaPontoEsfera(thetaProximo, phiAtual, raio);
            const c = criaPontoEsfera(thetaProximo, phiProximo, raio);
            const d = criaPontoEsfera(thetaAtual, phiProximo, raio);

            adicionaTrianguloEditor3D(vertices, normais, a, b, c, normalizaVetorEditor3D(a[0], a[1], a[2]));
            adicionaTrianguloEditor3D(vertices, normais, a, c, d, normalizaVetorEditor3D(a[0], a[1], a[2]));
        }
    }

    return criaGeometriaEditor3D(vertices, normais, 'TRIANGULOS');
};