import { Eventos_Emite, Eventos_EnviaERecebe } from 'types-nora-api';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import { setSalas, adicionarMensagem } from 'Redux/slices/chatsSlice';
import { eventoWs, useRecebeEmitWs } from "Hooks/useEventoWs";

export function useChatSocketListeners() {
    const dispatch = useAppDispatch();

    eventoWs(Eventos_EnviaERecebe.Chat.eventos.emitirSalas, {}, data => {
        dispatch(setSalas(data.salas));
    });

    useRecebeEmitWs(Eventos_Emite.Chat.eventos.emitirMensagem, data => {
        dispatch(adicionarMensagem(data.conteudoMensagem));
    });
};