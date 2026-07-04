'use client';

import { useState } from 'react';
import { Eventos_Emite } from 'types-nora-api';
import type { LeaderboardInstancia } from 'types-nora-api';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';

export type EstadoPlacarDesafioAoVivo = {
    leaderboard: LeaderboardInstancia | null;
    erro: string | null;
    carregando: boolean;
};

// Encapsula a assinatura WebSocket do Placar de um Desafio: disparo inicial (entra na room do tipo + recebe o Placar atual) e push ao vivo a cada novo resultado. O componente visual apenas consome o estado retornado.
export function usePlacarDesafioAoVivo(tipoDesafio: string): EstadoPlacarDesafioAoVivo {
    const [leaderboard, setLeaderboard] = useState<LeaderboardInstancia | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(true);

    useEmitWsComDisparoInicial(
        Eventos_Emite.DesafioLeaderboard.eventos.emitirLeaderboardDesafio,
        { tipoDesafio },
        {
            onSuccess: resposta => { setLeaderboard(resposta.leaderboard); setErro(null); setCarregando(false); },
            onError: erroWs => { setErro(erroWs.mensagem); setCarregando(false); },
        }
    );

    return { leaderboard, erro, carregando };
};
