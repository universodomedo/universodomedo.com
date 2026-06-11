'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eventos_EnviaERecebe, PAGINAS } from 'types-nora-api';

import { eventoWs, getSocket } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../../../JogoRouteGuard';

export default function PaginaModoSolo_Conteiner() {
    const router = useRouter();
    const [iniciando, setIniciando] = useState(false);

    function iniciarModoSolo(): void {
        if (iniciando) return;

        const socket = getSocket();

        if (!socket) {
            toast.erro('Falha ao iniciar Modo Solo', 'WebSocket indisponível.');
            return;
        }

        setIniciando(true);

        eventoWs(Eventos_EnviaERecebe.Jogo.eventos.iniciarModoSolo, {}, {
            onSuccess: () => {
                router.push(PAGINAS.jogo.emJogo.href);
            },
            onError: (err) => {
                setIniciando(false);
                toast.erro('Falha ao iniciar Modo Solo', err.mensagem);
            },
        });
    };

    return (
        <ControladorSlot pagina={PAGINAS.jogo.jogador.solo} embrulho={JogoRouteGuard}>
            <button type="button" onClick={iniciarModoSolo} disabled={iniciando}>{iniciando ? 'Iniciando...' : 'Iniciar Missão Funcional 1'}</button>
        </ControladorSlot>
    );
};