import type { AreaPercentual } from 'types-nora-api';

import { calculaAreaNovoBloco, resolvePosicaoValida } from './colisaoTutorial';

function sobrepoe(a: AreaPercentual, b: AreaPercentual): boolean { return a.x < b.x + b.largura && b.x < a.x + a.largura && a.y < b.y + b.altura && b.y < a.y + a.altura; };

describe('colisaoTutorial', () => {
    it('resolvePosicaoValida retorna a posição pretendida quando não há conflito', () => {
        const resultado = resolvePosicaoValida({ x: 10, y: 10, largura: 20, altura: 20 }, [{ x: 60, y: 60, largura: 20, altura: 20 }], { x: 0, y: 0, largura: 20, altura: 20 });
        expect(resultado).toEqual({ x: 10, y: 10, largura: 20, altura: 20 });
    });

    it('resolvePosicaoValida reposiciona para um candidato sem sobreposição quando há conflito', () => {
        const irmas: readonly AreaPercentual[] = [{ x: 20, y: 20, largura: 40, altura: 40 }];
        const resultado = resolvePosicaoValida({ x: 25, y: 25, largura: 20, altura: 20 }, irmas, { x: 0, y: 0, largura: 20, altura: 20 });
        expect(irmas.every(irma => !sobrepoe(resultado, irma))).toBe(true);
    });

    it('resolvePosicaoValida mantém a área anterior quando não há candidato válido', () => {
        const anterior: AreaPercentual = { x: 0, y: 0, largura: 10, altura: 10 };
        const resultado = resolvePosicaoValida({ x: 5, y: 5, largura: 20, altura: 20 }, [{ x: 0, y: 0, largura: 100, altura: 100 }], anterior);
        expect(resultado).toEqual(anterior);
    });

    it('calculaAreaNovoBloco acha a primeira posição livre e retorna null sem espaço', () => {
        expect(calculaAreaNovoBloco([])).toEqual({ x: 0, y: 0, largura: 40, altura: 25 });
        expect(calculaAreaNovoBloco([{ x: 0, y: 0, largura: 100, altura: 100 }])).toBeNull();
    });
});
