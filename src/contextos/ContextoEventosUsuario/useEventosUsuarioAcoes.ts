import { useCallback } from 'react';
import { Eventos_EnviaERecebe, EventoUsuarioDto } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';

// Etapa 15: ações WS de mutação self-scoped, extraídas do ContextoEventosUsuario (marcar lido / concluir tutorial).
export function useEventosUsuarioAcoes(setEventos: (eventos: EventoUsuarioDto[]) => void) {
    // Marca como lido e adota a lista atualizada que o backend devolve (sem mutar estado local como verdade).
    const marcarLido = useCallback((idEvento: number) => { eventoWs(Eventos_EnviaERecebe.EventosUsuario.eventos.marcarEventoComoLido, { idEvento }, { onSuccess: resp => { setEventos(resp.eventos); } }); }, [setEventos]);

    // Etapa 15: conclui um tutorial pelo fluxo dedicado e adota a lista atualizada do backend (sem mutar dataConclusao local).
    const concluirTutorial = useCallback((idEvento: number) => { eventoWs(Eventos_EnviaERecebe.EventosUsuario.eventos.concluirTutorial, { idEvento }, { onSuccess: resp => { setEventos(resp.eventos); } }); }, [setEventos]);

    return { marcarLido, concluirTutorial };
};
