import { useCallback } from 'react';
import { Eventos_EnviaERecebe } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';

// Etapa 14: marcar lido continua via WS, mas a fonte da verdade da Central é o refetch GraphQL — não adota mais a lista WS retornada. Conclusão de tutorial saiu daqui (acontece só no popup render-ready).
export function useEventosUsuarioAcoes(recarregar: () => void) {
    const marcarLido = useCallback((idEvento: number) => { eventoWs(Eventos_EnviaERecebe.EventosUsuario.eventos.marcarEventoComoLido, { idEvento }, { onSuccess: () => recarregar() }); }, [recarregar]);

    return { marcarLido };
};
