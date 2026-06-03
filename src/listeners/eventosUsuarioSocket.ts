'use client';

import { Eventos_Emite } from 'types-nora-api';

import { useRecebeEmitWs } from 'Hooks/useEventoWs';
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
};
