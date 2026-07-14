'use client';

// Componente null — sem UI própria.
// Registra a ação "Controle de Palco" na BarraAcoesFlutuante APENAS enquanto o usuário comanda algum palco ativo.

import { useEffect } from 'react';
import { useContextoBarraAcoesFlutuante } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import { useContextoControlePalco } from 'Contextos/ContextoControlePalco/contexto';

export function RegistradorAcaoControlePalco() {
    const { registrarAcao, removerAcao } = useContextoBarraAcoesFlutuante();
    const { palcosComandaveis, togglePainel } = useContextoControlePalco();

    useEffect(() => {
        if (palcosComandaveis.length > 0) {
            registrarAcao({
                id: 'controle-palco',
                rotulo: 'Controle de Palco',
                icone: '🎙️',
                visivel: true,
                onClick: togglePainel,
            });
        } else {
            removerAcao('controle-palco');
        }
    }, [palcosComandaveis.length, togglePainel]);

    return null;
};
