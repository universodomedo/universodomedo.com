import type { AreaPercentual } from 'types-nora-api';

import type { PassoLocalTutorial } from './tutorialEditor.types';
import { normalizaArea } from './geometriaTutorial';
import { resolvePosicaoValida } from './colisaoTutorial';
import { mapaBloco } from './passoBlocoCriacaoTutorial';

// Fonte única de regra geométrica (drag/resize/input): snap (só gesto) → clamp → reposicionamento por colisão (candidatos) contra os irmãos do Passo.
export function aplicaAreaBloco(passos: readonly PassoLocalTutorial[], idLocalPasso: number, idLocalBloco: number, areaPretendida: AreaPercentual, comSnap: boolean): readonly PassoLocalTutorial[] {
    const passo = passos.find(passoAtual => passoAtual.idLocal === idLocalPasso);
    if (!passo) return passos;
    const blocoAtual = passo.blocos.find(bloco => bloco.idLocal === idLocalBloco);
    if (!blocoAtual) return passos;
    const irmas = passo.blocos.filter(bloco => bloco.idLocal !== idLocalBloco).map(bloco => bloco.area);
    const areaFinal = resolvePosicaoValida(normalizaArea(areaPretendida, comSnap), irmas, blocoAtual.area);
    return mapaBloco(passos, idLocalPasso, idLocalBloco, bloco => ({ ...bloco, area: areaFinal }));
};
