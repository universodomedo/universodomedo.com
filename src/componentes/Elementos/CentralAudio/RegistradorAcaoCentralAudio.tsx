'use client';

// Componente null — sem UI própria.
// Registra (ou remove) a ação "Central de Áudio" na BarraAcoesFlutuante conforme a autenticação.

import { useEffect } from 'react';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoBarraAcoesFlutuante } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import { useContextoCentralAudio } from 'Contextos/ContextoCentralAudio/contexto';

export function RegistradorAcaoCentralAudio() {
    const { estaAutenticado, carregando } = useContextoAutenticacao();
    const { registrarAcao, removerAcao } = useContextoBarraAcoesFlutuante();
    const { togglePainel } = useContextoCentralAudio();

    useEffect(() => {
        if (!carregando && estaAutenticado) {
            registrarAcao({
                id: 'central-audio',
                rotulo: 'Central de Áudio',
                icone: '🎵',
                visivel: true,
                onClick: togglePainel,
            });
        } else {
            removerAcao('central-audio');
        }
    }, [estaAutenticado, carregando, togglePainel]);

    return null;
};
