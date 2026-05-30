import { useEffect, useRef } from 'react';
import { Eventos_Envia, type PaginaTemplate } from 'types-nora-api';

import { eventoWs, getSocket, useSocketEpoch } from 'Hooks/useEventoWs';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export function useAtualizarPaginaAtualWs(templatePaginaAtual: PaginaTemplate | undefined): void {
    const { estaAutenticado } = useContextoAutenticacao();
    const epoch = useSocketEpoch();
    const ultimoEnviado = useRef<PaginaTemplate | undefined>(undefined);

    useEffect(() => {
        if (!estaAutenticado) return;
        if (!templatePaginaAtual) return;
        if (templatePaginaAtual === ultimoEnviado.current) return;

        // Só marca como enviado se o socket está disponível.
        // Se não estiver, o effect vai retentar quando epoch mudar (socket conecta).
        if (!getSocket()) return;

        ultimoEnviado.current = templatePaginaAtual;
        eventoWs(Eventos_Envia.UsuariosConectados.eventos.atualizarPaginaAtual, { templatePaginaAtual });
    }, [estaAutenticado, templatePaginaAtual, epoch]);
}
