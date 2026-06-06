import { useCallback, useEffect, useState } from 'react';

import { EventoUsuarioCentralItem } from './eventoUsuarioCentralItem';
import { seletorAlvoVisualTutorial } from './alvoVisualTutorial';

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

// Etapa 12: estado/ações da intervenção visual mínima de tutorial. Backend continua a fonte da verdade (usa marcarLido).
export function useTutorialIntervencao(itens: EventoUsuarioCentralItem[], marcarLido: (idEvento: number) => void, estaAutenticado: boolean) {
    const [tutorialAberto, setTutorialAberto] = useState<EventoUsuarioCentralItem | null>(null);
    const [alvoVisualLocalizado, setAlvoVisualLocalizado] = useState<string | null>(null);
    const [posicaoIntervencao, setPosicaoIntervencao] = useState<PosicaoIntervencaoTutorial>('central');

    // Abre só se o item existir e puder abrir tutorial (regra preparada pelo presenter).
    // Etapa 13: resolve o alvo visual FORA do componente (querySelector só com o alvo já validado pelo presenter).
    // Etapa 14: decide também a região do card a partir do rect do alvo (sem coordenadas livres).
    const abrirTutorial = useCallback((idEvento: number) => {
        const item = itens.find(evento => evento.id === idEvento);
        if (!item || !item.podeAbrirTutorial) return;
        const alvo = item.possuiAlvoVisual ? item.alvoVisual : null;
        const elemento = alvo ? document.querySelector(seletorAlvoVisualTutorial(alvo)) : null;
        setAlvoVisualLocalizado(elemento ? alvo : null);
        setPosicaoIntervencao(elemento ? calcularPosicaoIntervencao(elemento) : 'central');
        setTutorialAberto(item);
    }, [itens]);

    const fecharTutorial = useCallback(() => { setTutorialAberto(null); setAlvoVisualLocalizado(null); setPosicaoIntervencao('central'); }, []);

    // Confirma: marca como lido pelo fluxo existente (backend devolve a lista) e fecha. Sem estado paralelo de conclusão.
    const confirmarTutorial = useCallback(() => {
        if (!tutorialAberto) return;
        marcarLido(tutorialAberto.id);
        setTutorialAberto(null);
        setAlvoVisualLocalizado(null);
        setPosicaoIntervencao('central');
    }, [tutorialAberto, marcarLido]);

    // Desautenticou (eventos limpos no contexto) => fecha a intervenção.
    useEffect(() => { if (!estaAutenticado) { setTutorialAberto(null); setAlvoVisualLocalizado(null); setPosicaoIntervencao('central'); } }, [estaAutenticado]);

    return { tutorialAberto, alvoVisualLocalizado, posicaoIntervencao, abrirTutorial, fecharTutorial, confirmarTutorial };
};
