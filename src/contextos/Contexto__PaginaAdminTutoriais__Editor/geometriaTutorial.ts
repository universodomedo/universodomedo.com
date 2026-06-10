import type { AreaPercentual } from 'types-nora-api';

import type { DirecaoResizeTutorial } from './tutorialEditor.types';

// Etapa 8: constantes geométricas fixas do editor. RAZAO_ALTURA_CONTEUDO_TUTORIAL migrou para Uteis/tutorial (compartilhada com o renderizador).
export const SNAP_PERCENTUAL_TUTORIAL = 0.5;
export const TAMANHO_MINIMO_BLOCO_TUTORIAL = 5;

// Converte um delta de pixels do ponteiro em delta percentual relativo ao tamanho medido do canvas no gesto.
export function pxParaPercentual(deltaPx: number, tamanhoCanvasPx: number): number { return tamanhoCanvasPx > 0 ? (deltaPx / tamanhoCanvasPx) * 100 : 0; };

// Snap a múltiplos de SNAP_PERCENTUAL_TUTORIAL (só no gesto; inputs/valores carregados continuam decimais livres).
export function snapPercentual(valor: number): number { return Math.round(valor / SNAP_PERCENTUAL_TUTORIAL) * SNAP_PERCENTUAL_TUTORIAL; };

// AABB no sistema 0–100: blocos que só se tocam nas bordas não contam como sobreposição (mesmo critério do backend).
export function aabbIntersectam(a: AreaPercentual, b: AreaPercentual): boolean { return a.x < b.x + b.largura && b.x < a.x + a.largura && a.y < b.y + b.altura && b.y < a.y + a.altura; };

// Limita a área aos limites do canvas (0–100) com dimensão mínima, mantendo o canto o mais próximo possível do pretendido.
export function clampArea(area: AreaPercentual): AreaPercentual {
    const largura = Math.min(Math.max(area.largura, TAMANHO_MINIMO_BLOCO_TUTORIAL), 100);
    const altura = Math.min(Math.max(area.altura, TAMANHO_MINIMO_BLOCO_TUTORIAL), 100);
    const x = Math.min(Math.max(area.x, 0), 100 - largura);
    const y = Math.min(Math.max(area.y, 0), 100 - altura);
    return { x, y, largura, altura };
};

// Aplica snap (opcional, só no gesto) e clamp a uma área pretendida.
export function normalizaArea(area: AreaPercentual, comSnap: boolean): AreaPercentual {
    if (!comSnap) return clampArea(area);
    return clampArea({ x: snapPercentual(area.x), y: snapPercentual(area.y), largura: snapPercentual(area.largura), altura: snapPercentual(area.altura) });
};

// Resize bruto a partir da borda/canto arrastado (borda oposta fixa); clamp/colisão são aplicados depois por normalizaArea + colisão.
export function calculaAreaResize(area: AreaPercentual, direcao: DirecaoResizeTutorial, deltaXPercentual: number, deltaYPercentual: number): AreaPercentual {
    let { x, y, largura, altura } = area;
    if (direcao.includes('left')) { x = area.x + deltaXPercentual; largura = area.largura - deltaXPercentual; }
    if (direcao.includes('right')) largura = area.largura + deltaXPercentual;
    if (direcao.includes('top')) { y = area.y + deltaYPercentual; altura = area.altura - deltaYPercentual; }
    if (direcao.includes('bottom')) altura = area.altura + deltaYPercentual;
    return { x, y, largura, altura };
};
