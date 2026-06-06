import { useCallback, useEffect, useState } from 'react';

import { EventoUsuarioCentralItem } from './eventoUsuarioCentralItem';
import { seletorAlvoVisualTutorial } from './alvoVisualTutorial';

// Etapa 12: estado/ações da intervenção visual mínima de tutorial. Backend continua a fonte da verdade (usa marcarLido).
export function useTutorialIntervencao(itens: EventoUsuarioCentralItem[], marcarLido: (idEvento: number) => void, estaAutenticado: boolean) {
    const [tutorialAberto, setTutorialAberto] = useState<EventoUsuarioCentralItem | null>(null);
    const [alvoVisualLocalizado, setAlvoVisualLocalizado] = useState<string | null>(null);

    // Abre só se o item existir e puder abrir tutorial (regra preparada pelo presenter).
    // Etapa 13: resolve o alvo visual FORA do componente (querySelector só com o alvo já validado pelo presenter).
    const abrirTutorial = useCallback((idEvento: number) => {
        const item = itens.find(evento => evento.id === idEvento);
        if (!item || !item.podeAbrirTutorial) return;
        const alvo = item.possuiAlvoVisual ? item.alvoVisual : null;
        const elemento = alvo ? document.querySelector(seletorAlvoVisualTutorial(alvo)) : null;
        setAlvoVisualLocalizado(elemento ? alvo : null);
        setTutorialAberto(item);
    }, [itens]);

    const fecharTutorial = useCallback(() => { setTutorialAberto(null); setAlvoVisualLocalizado(null); }, []);

    // Confirma: marca como lido pelo fluxo existente (backend devolve a lista) e fecha. Sem estado paralelo de conclusão.
    const confirmarTutorial = useCallback(() => {
        if (!tutorialAberto) return;
        marcarLido(tutorialAberto.id);
        setTutorialAberto(null);
        setAlvoVisualLocalizado(null);
    }, [tutorialAberto, marcarLido]);

    // Desautenticou (eventos limpos no contexto) => fecha a intervenção.
    useEffect(() => { if (!estaAutenticado) { setTutorialAberto(null); setAlvoVisualLocalizado(null); } }, [estaAutenticado]);

    return { tutorialAberto, alvoVisualLocalizado, abrirTutorial, fecharTutorial, confirmarTutorial };
};
