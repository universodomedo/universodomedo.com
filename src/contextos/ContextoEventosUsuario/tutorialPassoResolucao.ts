import { PassoTutorialUsuario } from 'types-nora-api';

import { alvoVisualConhecido, seletorAlvoVisualTutorial } from './alvoVisualTutorial';

// Etapa 14: posição contextual mínima do card (região, não coordenada). Decidida aqui; o componente só aplica a classe.
export type PosicaoIntervencaoTutorial = 'central' | 'superior_esquerda' | 'superior_direita' | 'inferior_esquerda' | 'inferior_direita';

// Escolhe UMA região segura (canto oposto ao alvo) só a partir do rect + viewport; sem coordenadas livres. Sem posição confiável => 'central'.
function calcularPosicaoIntervencao(elemento: Element): PosicaoIntervencaoTutorial {
    const rect = elemento.getBoundingClientRect();
    const larguraViewport = window.innerWidth;
    const alturaViewport = window.innerHeight;
    if (!larguraViewport || !alturaViewport || !rect.width || !rect.height) return 'central';
    const ehInferior = rect.top + rect.height / 2 > alturaViewport / 2;
    const ehDireita = rect.left + rect.width / 2 > larguraViewport / 2;
    if (ehInferior) return ehDireita ? 'superior_esquerda' : 'superior_direita';
    return ehDireita ? 'inferior_esquerda' : 'inferior_direita';
};

// Etapa 16: resolve alvo+posição de UM passo, FORA do componente. Só alvo da whitelist (alvoVisualConhecido) chega ao querySelector; sem alvo/elemento => genérico central.
export function resolverAlvoEPosicaoDoPasso(passo: PassoTutorialUsuario): { alvoVisualLocalizado: string | null; posicaoIntervencao: PosicaoIntervencaoTutorial } {
    const alvo = alvoVisualConhecido(passo.alvoVisual);
    const elemento = alvo ? document.querySelector(seletorAlvoVisualTutorial(alvo)) : null;
    if (!elemento) return { alvoVisualLocalizado: null, posicaoIntervencao: 'central' };
    return { alvoVisualLocalizado: alvo, posicaoIntervencao: calcularPosicaoIntervencao(elemento) };
};
