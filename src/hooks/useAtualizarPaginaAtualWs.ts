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

        const socket = getSocket();
        if (!socket) {
            console.log('[DBG useAtualizarPaginaAtualWs] socket não disponível ainda, aguardando epoch. template=', templatePaginaAtual);
            return;
        }

        ultimoEnviado.current = templatePaginaAtual;
        console.log('[DBG useAtualizarPaginaAtualWs] enviando atualizarPaginaAtual template=', templatePaginaAtual, 'socketConnected=', socket.connected);
        eventoWs(Eventos_Envia.UsuariosConectados.eventos.atualizarPaginaAtual, { templatePaginaAtual });
    }, [estaAutenticado, templatePaginaAtual, epoch]);
}
