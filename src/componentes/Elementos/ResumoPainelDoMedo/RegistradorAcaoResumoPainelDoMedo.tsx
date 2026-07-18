'use client';

// Componente null — sem UI própria.
// Registra a ação do resumo do Painel do Medo na BarraAcoesFlutuante quando o usuário
// tem a capacidade de acesso ao Painel (COLABORADOR__PAINEL_DO_MEDO__ACESSO).

import { useEffect } from 'react';
import { CAPACIDADES } from 'types-nora-api';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoBarraAcoesFlutuante } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import { useContextoResumoPainelDoMedo } from 'Contextos/ContextoResumoPainelDoMedo/contexto';

export function RegistradorAcaoResumoPainelDoMedo() {
    const { carregando, verificarCapacidade } = useContextoAutenticacao();
    const { registrarAcao, removerAcao } = useContextoBarraAcoesFlutuante();
    const { togglePainel } = useContextoResumoPainelDoMedo();

    const temAcesso = !carregando && verificarCapacidade(CAPACIDADES.COLABORADOR__PAINEL_DO_MEDO__ACESSO);

    useEffect(() => {
        if (temAcesso) {
            registrarAcao({
                id: 'resumo-painel-do-medo',
                rotulo: 'Painel do Medo',
                icone: '📋',
                visivel: true,
                onClick: togglePainel,
            });
        } else {
            removerAcao('resumo-painel-do-medo');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temAcesso, togglePainel]);

    return null;
};
