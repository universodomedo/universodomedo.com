'use client';

// Componente null — sem UI própria.
// Registra/remove a ação de Notificações na BarraAcoesFlutuante conforme autenticação (padrão RegistradorAcao*).
// Também faz a ponte do tutorial, mas SÓ para o alvo que ESTA ação registra (eventos_usuario.central.botao):
// garante a cápsula expandida e reavalia o alvo após a renderização do botão real.

import { useEffect } from 'react';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoBarraAcoesFlutuante } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import { useContextoEventosUsuario } from 'Contextos/ContextoEventosUsuario/contexto';
import { ALVO_VISUAL_CENTRAL_BOTAO } from 'Contextos/ContextoEventosUsuario/alvoVisualTutorial';
import NotificacoesIconeBarra from './NotificacoesIconeBarra';

export function RegistradorAcaoNotificacoes() {
    const { estaAutenticado, carregando } = useContextoAutenticacao();
    const { registrarAcao, removerAcao, expandido, definirExpandido } = useContextoBarraAcoesFlutuante();
    const { alternarAberto, alvoVisualLocalizado, passoAtual, reavaliarAlvoVisual } = useContextoEventosUsuario();

    useEffect(() => {
        if (!carregando && estaAutenticado) {
            registrarAcao({ id: 'notificacoes', rotulo: 'Notificações', icone: <NotificacoesIconeBarra />, visivel: true, onClick: alternarAberto, atributoAlvo: ALVO_VISUAL_CENTRAL_BOTAO, destacado: alvoVisualLocalizado === ALVO_VISUAL_CENTRAL_BOTAO });
        } else {
            removerAcao('notificacoes');
        }
    }, [estaAutenticado, carregando, alternarAberto, alvoVisualLocalizado]);

    // Bridge: só reage ao alvo que esta ação registra. Garante a cápsula expandida quando o passo aponta para o botão de notificações.
    useEffect(() => {
        if (passoAtual?.alvoVisual === ALVO_VISUAL_CENTRAL_BOTAO && !expandido) definirExpandido(true);
    }, [passoAtual, expandido, definirExpandido]);

    // Bridge: após a cápsula expandir e o botão montar, reavalia só o alvo desta ação (mede o botão real).
    useEffect(() => {
        if (passoAtual?.alvoVisual === ALVO_VISUAL_CENTRAL_BOTAO && expandido) reavaliarAlvoVisual();
    }, [passoAtual, expandido, reavaliarAlvoVisual]);

    return null;
};
