'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CodigoMissaoFuncionalSalaDeJogoRuntime, Eventos_EnviaERecebe, PAGINAS } from 'types-nora-api';

import { eventoWs, getSocket } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../../../JogoRouteGuard';

export default function PaginaModoSolo_Conteiner() {
    const router = useRouter();
    const [codigoMissaoIniciando, setCodigoMissaoIniciando] = useState<CodigoMissaoFuncionalSalaDeJogoRuntime | null>(null);

    function iniciarModoSolo(codigoMissaoFuncional: CodigoMissaoFuncionalSalaDeJogoRuntime): void {
        if (codigoMissaoIniciando) return;

        const socket = getSocket();

        if (!socket) {
            toast.erro('Falha ao iniciar Modo Solo', 'WebSocket indisponível.');
            return;
        }

        setCodigoMissaoIniciando(codigoMissaoFuncional);

        eventoWs(Eventos_EnviaERecebe.Jogo.eventos.iniciarModoSolo, { codigoMissaoFuncional }, {
            onSuccess: () => {
                router.push(PAGINAS.jogo.emJogo.href);
            },
            onError: (err) => {
                setCodigoMissaoIniciando(null);
                toast.erro('Falha ao iniciar Modo Solo', err.mensagem);
            },
        });
    };

    return (
        <ControladorSlot pagina={PAGINAS.jogo.jogador.solo} embrulho={JogoRouteGuard}>
            <button type="button" onClick={() => iniciarModoSolo('MISSAO_FUNCIONAL_1')} disabled={codigoMissaoIniciando !== null}>{codigoMissaoIniciando === 'MISSAO_FUNCIONAL_1' ? 'Iniciando...' : 'Iniciar Missão Funcional 1'}</button>
            <button type="button" onClick={() => iniciarModoSolo('MISSAO_FUNCIONAL_2_OUVIR_REFEM')} disabled={codigoMissaoIniciando !== null}>{codigoMissaoIniciando === 'MISSAO_FUNCIONAL_2_OUVIR_REFEM' ? 'Iniciando...' : 'Iniciar Missão Funcional 2'}</button>
            <button type="button" onClick={() => iniciarModoSolo('MISSAO_FUNCIONAL_3_DERROTE_INIMIGO')} disabled={codigoMissaoIniciando !== null}>{codigoMissaoIniciando === 'MISSAO_FUNCIONAL_3_DERROTE_INIMIGO' ? 'Iniciando...' : 'Iniciar Missão Funcional 3'}</button>
            <button type="button" onClick={() => iniciarModoSolo('MISSAO_FUNCIONAL_4_TEMPO_REAL')} disabled={codigoMissaoIniciando !== null}>{codigoMissaoIniciando === 'MISSAO_FUNCIONAL_4_TEMPO_REAL' ? 'Iniciando...' : 'Iniciar Missão Funcional 4'}</button>
        </ControladorSlot>
    );
};
