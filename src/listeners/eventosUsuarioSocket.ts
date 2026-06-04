'use client';

import { useEffect } from 'react';
import { Eventos_Emite, Eventos_Envia } from 'types-nora-api';

import { useRecebeEmitWs, useSocketEpoch, eventoWs } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

export function useEventosUsuarioSocket() {
    useRecebeEmitWs(Eventos_Emite.EventosUsuario.eventos.notificacaoRecebida, data => {
        const n = data.notificacao;
        if (n.tipo === 'sucesso') { toast.sucesso(n.titulo, n.mensagem); return; }
        if (n.tipo === 'erro') { toast.erro(n.titulo, n.mensagem); return; }
        if (n.tipo === 'aviso') { toast.aviso(n.titulo, n.mensagem); return; }
        // fallback TEMPORÁRIO da Etapa 1: não há toast neutro 'info'. Não tornar isto regra de domínio.
        toast.aviso(n.titulo, n.mensagem);
    });

    // Etapa 4: após o listener acima estar registrado (ordem de efeitos do React garante), pede ao backend
    // a entrega das pendências persistidas. Reconexão muda o epoch e refaz a sincronização. Sem estado local.
    const epoch = useSocketEpoch();
    useEffect(() => { eventoWs(Eventos_Envia.EventosUsuario.eventos.sincronizarPendencias, {}); }, [epoch]);
};
