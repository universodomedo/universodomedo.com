'use client';

// Componente null — sem UI própria.
// Registra/remove a ação de Notificações na BarraAcoesFlutuante conforme autenticação (padrão RegistradorAcao*).
// Etapa 14: a ponte do tutorial inline (destaque do alvo na barra) saiu — o Tutorial agora é renderizado pelo modal render-ready global, não por overlay ancorado na barra.

import { useEffect } from 'react';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoBarraAcoesFlutuante } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import { useContextoEventosUsuario } from 'Contextos/ContextoEventosUsuario/contexto';
import NotificacoesIconeBarra from './NotificacoesIconeBarra';

export function RegistradorAcaoNotificacoes() {
    const { estaAutenticado, carregando } = useContextoAutenticacao();
    const { registrarAcao, removerAcao } = useContextoBarraAcoesFlutuante();
    const { alternarAberto } = useContextoEventosUsuario();

    useEffect(() => {
        if (!carregando && estaAutenticado) {
            registrarAcao({ id: 'notificacoes', rotulo: 'Notificações', icone: <NotificacoesIconeBarra />, visivel: true, onClick: alternarAberto });
        } else {
            removerAcao('notificacoes');
        }
    }, [estaAutenticado, carregando, alternarAberto]);

    return null;
};
