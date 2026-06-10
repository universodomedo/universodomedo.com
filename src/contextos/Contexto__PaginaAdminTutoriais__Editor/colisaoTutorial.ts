import type { AreaPercentual } from 'types-nora-api';

import { aabbIntersectam, clampArea } from './geometriaTutorial';

const TAMANHO_NOVO_BLOCO_TUTORIAL = { largura: 40, altura: 25 };

// Conjunto FINITO de candidatos (sem varrer a grade): a própria área; alinhamentos às bordas do canvas; alinhamentos às bordas de cada irmão (mantendo a dimensão).
function geraCandidatos(area: AreaPercentual, irmas: readonly AreaPercentual[]): readonly AreaPercentual[] {
    const candidatos: AreaPercentual[] = [area, { ...area, x: 0 }, { ...area, x: 100 - area.largura }, { ...area, y: 0 }, { ...area, y: 100 - area.altura }];
    for (const irma of irmas) candidatos.push({ ...area, x: irma.x + irma.largura }, { ...area, x: irma.x - area.largura }, { ...area, y: irma.y + irma.altura }, { ...area, y: irma.y - area.altura });
    return candidatos.map(clampArea);
};

function semSobreposicao(area: AreaPercentual, irmas: readonly AreaPercentual[]): boolean { return irmas.every(irma => !aabbIntersectam(area, irma)); };

function distancia(a: AreaPercentual, b: AreaPercentual): number { return Math.hypot(a.x - b.x, a.y - b.y); };

// Posição válida (dentro do canvas + sem sobreposição) mais próxima da pretendida; empate por menor y, depois menor x; se nenhuma → mantém a anterior.
export function resolvePosicaoValida(areaPretendida: AreaPercentual, irmas: readonly AreaPercentual[], areaAnterior: AreaPercentual): AreaPercentual {
    const pretendida = clampArea(areaPretendida);
    if (semSobreposicao(pretendida, irmas)) return pretendida;
    const validos = geraCandidatos(pretendida, irmas).filter(candidato => semSobreposicao(candidato, irmas));
    if (validos.length < 1) return areaAnterior;
    return [...validos].sort((a, b) => distancia(a, pretendida) - distancia(b, pretendida) || a.y - b.y || a.x - b.x)[0];
};

// Posição inicial válida para um novo Bloco (tamanho padrão); null se não houver espaço.
export function calculaAreaNovoBloco(irmas: readonly AreaPercentual[]): AreaPercentual | null {
    const inicial = clampArea({ x: 0, y: 0, largura: TAMANHO_NOVO_BLOCO_TUTORIAL.largura, altura: TAMANHO_NOVO_BLOCO_TUTORIAL.altura });
    if (semSobreposicao(inicial, irmas)) return inicial;
    const validos = geraCandidatos(inicial, irmas).filter(candidato => semSobreposicao(candidato, irmas));
    if (validos.length < 1) return null;
    return [...validos].sort((a, b) => a.y - b.y || a.x - b.x)[0];
};
