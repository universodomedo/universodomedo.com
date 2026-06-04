import { useCallback, useEffect, useState } from 'react';

import { EventoUsuarioCentralItem } from './eventoUsuarioCentralItem';

// Etapa 12: estado/ações da intervenção visual mínima de tutorial. Backend continua a fonte da verdade (usa marcarLido).
export function useTutorialIntervencao(itens: EventoUsuarioCentralItem[], marcarLido: (idEvento: number) => void, estaAutenticado: boolean) {
    const [tutorialAberto, setTutorialAberto] = useState<EventoUsuarioCentralItem | null>(null);

    // Abre só se o item existir e puder abrir tutorial (regra preparada pelo presenter).
    const abrirTutorial = useCallback((idEvento: number) => {
        const item = itens.find(evento => evento.id === idEvento);
        if (item && item.podeAbrirTutorial) setTutorialAberto(item);
    }, [itens]);

    const fecharTutorial = useCallback(() => { setTutorialAberto(null); }, []);

    // Confirma: marca como lido pelo fluxo existente (backend devolve a lista) e fecha. Sem estado paralelo de conclusão.
    const confirmarTutorial = useCallback(() => {
        if (!tutorialAberto) return;
        marcarLido(tutorialAberto.id);
        setTutorialAberto(null);
    }, [tutorialAberto, marcarLido]);

    // Desautenticou (eventos limpos no contexto) => fecha a intervenção.
    useEffect(() => { if (!estaAutenticado) setTutorialAberto(null); }, [estaAutenticado]);

    return { tutorialAberto, abrirTutorial, fecharTutorial, confirmarTutorial };
};
