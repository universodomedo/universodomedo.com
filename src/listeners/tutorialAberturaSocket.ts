'use client';

import { Eventos_Emite } from 'types-nora-api';

import { useRecebeEmitWs } from 'Hooks/useEventoWs';
import { useContextoTutorialAbertura } from 'Contextos/ContextoTutorialAbertura/contexto';

// Etapa 11: listener global único do evento de abertura render-ready. Só enfileira (sem lógica/GraphQL). Cleanup + re-inscrição por epoch tratados pelo useRecebeEmitWs.
export function useTutorialAberturaSocket() {
    const { enfileirar } = useContextoTutorialAbertura();
    useRecebeEmitWs(Eventos_Emite.Tutoriais.eventos.abrirTutorial, payload => enfileirar(payload));
};
