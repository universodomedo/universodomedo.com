import { aabbIntersectam, calculaAreaResize, clampArea, normalizaArea, pxParaPercentual, snapPercentual } from './geometriaTutorial';

describe('geometriaTutorial', () => {
    it('pxParaPercentual converte delta de px para % (e protege divisão por zero)', () => {
        expect(pxParaPercentual(50, 200)).toBe(25);
        expect(pxParaPercentual(10, 0)).toBe(0);
    });

    it('snapPercentual arredonda a múltiplos de 0,5%', () => {
        expect(snapPercentual(68.4)).toBe(68.5);
        expect(snapPercentual(0.24)).toBe(0);
    });

    it('aabbIntersectam: blocos que só se tocam nas bordas não sobrepõem', () => {
        expect(aabbIntersectam({ x: 0, y: 0, largura: 40, altura: 25 }, { x: 40, y: 0, largura: 40, altura: 25 })).toBe(false);
        expect(aabbIntersectam({ x: 0, y: 0, largura: 40, altura: 25 }, { x: 20, y: 0, largura: 40, altura: 25 })).toBe(true);
    });

    it('clampArea mantém o bloco dentro do canvas e respeita o mínimo', () => {
        expect(clampArea({ x: 90, y: 90, largura: 40, altura: 40 })).toEqual({ x: 60, y: 60, largura: 40, altura: 40 });
        expect(clampArea({ x: -10, y: -10, largura: 40, altura: 25 })).toEqual({ x: 0, y: 0, largura: 40, altura: 25 });
        expect(clampArea({ x: 0, y: 0, largura: 1, altura: 1 })).toEqual({ x: 0, y: 0, largura: 5, altura: 5 });
    });

    it('normalizaArea preserva decimal sem snap e arredonda com snap', () => {
        expect(normalizaArea({ x: 68.5, y: 10.3, largura: 20, altura: 20 }, false)).toEqual({ x: 68.5, y: 10.3, largura: 20, altura: 20 });
        expect(normalizaArea({ x: 68.4, y: 10.1, largura: 20, altura: 20 }, true)).toEqual({ x: 68.5, y: 10, largura: 20, altura: 20 });
    });

    it('calculaAreaResize move a borda/canto arrastado (borda oposta fixa)', () => {
        expect(calculaAreaResize({ x: 10, y: 10, largura: 20, altura: 20 }, 'right', 5, 0)).toEqual({ x: 10, y: 10, largura: 25, altura: 20 });
        expect(calculaAreaResize({ x: 10, y: 10, largura: 20, altura: 20 }, 'top-left', 4, 4)).toEqual({ x: 14, y: 14, largura: 16, altura: 16 });
    });
});
