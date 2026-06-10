import type { DirecaoReordenar, PassoLocalTutorial } from './tutorialEditor.types';
import { mapaPasso } from './passoBlocoCriacaoTutorial';

export function reordenaPassoTutorial(passos: readonly PassoLocalTutorial[], idLocalPasso: number, direcao: DirecaoReordenar): readonly PassoLocalTutorial[] { return reordenaPorIdLocal(passos, idLocalPasso, direcao); };

export function reordenaBlocoTutorial(passos: readonly PassoLocalTutorial[], idLocalPasso: number, idLocalBloco: number, direcao: DirecaoReordenar): readonly PassoLocalTutorial[] { return mapaPasso(passos, idLocalPasso, passo => ({ ...passo, blocos: reordenaPorIdLocal(passo.blocos, idLocalBloco, direcao) })); };

// Reordenação estrutural (não é profundidade/z-index): move o item ↑/↓ uma posição no array.
export function reordenaPorIdLocal<T extends { idLocal: number }>(itens: readonly T[], idLocal: number, direcao: DirecaoReordenar): readonly T[] {
    const indice = itens.findIndex(item => item.idLocal === idLocal);
    const destino = direcao === 'cima' ? indice - 1 : indice + 1;
    if (indice < 0 || destino < 0 || destino >= itens.length) return itens;
    const copia = [...itens];
    const [movido] = copia.splice(indice, 1);
    copia.splice(destino, 0, movido);
    return copia;
};
