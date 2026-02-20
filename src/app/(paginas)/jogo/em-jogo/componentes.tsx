'use client';

import { Eventos_EnviaERecebe, PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../JogoRouteGuard';
import { eventoWs } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

export function Pagina_EmJogo_Client() {
    const executaRequisicaoDeFechamentoDeSala = async () => {
        eventoWs(Eventos_EnviaERecebe.Jogo.eventos.requisicaoDeFechamentoDeSalaAberta, {}, {
            onSuccess: retorno => { toast.sucesso('Sala Fechada', `Sala fechada com sucesso`, { recarregaPagina: true }); },
            onError: err => { toast.erro('Falha ao fechar sala', err.mensagem); }
        });
    };

    return (
        <ControladorSlot pagina={PAGINAS.jogo.emJogo} embrulho={JogoRouteGuard}>
            <>
                <h1>oi Em Jogo</h1>
                <button onClick={executaRequisicaoDeFechamentoDeSala}>Finalizar</button>
            </>
        </ControladorSlot>
    );
};