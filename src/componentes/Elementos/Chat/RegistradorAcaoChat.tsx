'use client';

// Componente null — sem UI própria.
// Responsável por registrar ou remover a ação de Chat na BarraAcoesFlutuante
// conforme o estado de autenticação do usuário.

import { useEffect } from 'react';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoBarraAcoesFlutuante } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import { useContexto__Chat } from 'Contextos/ContextoChat/contexto';

export function RegistradorAcaoChat() {
    const { estaAutenticado, carregando } = useContextoAutenticacao();
    const { registrarAcao, removerAcao } = useContextoBarraAcoesFlutuante();
    const { abrirChat } = useContexto__Chat();

    useEffect(() => {
        if (!carregando && estaAutenticado) {
            registrarAcao({
                id: 'chat',
                rotulo: 'Chat',
                icone: '💬',
                visivel: true,
                onClick: abrirChat,
            });
        } else {
            removerAcao('chat');
        }
    }, [estaAutenticado, carregando, abrirChat]);

    return null;
};
