import { useEffect } from 'react';
import { Eventos_Emite, Eventos_EnviaERecebe } from 'types-nora-api';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import { setSalas, adicionarMensagem, salasAtualizadasMerge } from 'Redux/slices/chatsSlice';
import { eventoWs, useRecebeEmitWs, useSocketEpoch } from "Hooks/useEventoWs";

export function useChatSocketListeners() {
    const dispatch = useAppDispatch();
    const epoch = useSocketEpoch();

    // Reexecuta a cada mudança de conexão (epoch): além de atualizar as salas, o emitirSalas re-inscreve o socket nas rooms após reconexão.
    useEffect(() => {
        eventoWs(Eventos_EnviaERecebe.Chat.eventos.emitirSalas, {}, data => {
            dispatch(setSalas(data.salas));
        });
    }, [epoch, dispatch]);

    useRecebeEmitWs(Eventos_Emite.Chat.eventos.emitirMensagem, {
        onSuccess: data => { dispatch(adicionarMensagem(data.conteudoMensagem)); },
        onError: err => { console.error(err); }
    });

    // Push do servidor quando salas nascem ou mudam de estado (ex.: palco aberto/finalizado): a lista chega ao vivo, sem reload.
    useRecebeEmitWs(Eventos_Emite.Chat.eventos.salasAtualizadas, {
        onSuccess: data => { dispatch(salasAtualizadasMerge(data.salas)); },
        onError: err => { console.error(err); }
    });
};