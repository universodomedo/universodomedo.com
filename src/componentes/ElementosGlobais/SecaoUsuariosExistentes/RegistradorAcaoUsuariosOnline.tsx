'use client';

// Componente null — sem UI própria.
// Responsável por registrar ou remover a ação de Usuários Online na BarraAcoesFlutuante
// conforme o estado de autenticação do usuário.

import { useEffect } from 'react';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoBarraAcoesFlutuante } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import { useContextoUsuariosOnline } from 'Contextos/ContextoUsuariosOnline/contexto';

export function RegistradorAcaoUsuariosOnline() {
    const { estaAutenticado, carregando } = useContextoAutenticacao();
    const { registrarAcao, removerAcao } = useContextoBarraAcoesFlutuante();
    const { togglePainel } = useContextoUsuariosOnline();

    useEffect(() => {
        if (!carregando && estaAutenticado) {
            registrarAcao({
                id: 'usuarios-online',
                rotulo: 'Usuários online',
                icone: '👥',
                visivel: true,
                onClick: togglePainel,
            });
        } else {
            removerAcao('usuarios-online');
        }
    }, [estaAutenticado, carregando, togglePainel]);

    return null;
};
