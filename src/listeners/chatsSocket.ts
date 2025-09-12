import { useEffect } from 'react';

import { SOCKET_EVENTOS, SalaChatFront, MensagemChatRecebida } from 'types-nora-api';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import useSocketEvent from 'Hooks/useSocketEvent';
import emitSocketEvent from 'Libs/emitSocketEvent';
import { setSalas, adicionarMensagem } from 'Redux/slices/chatsSlice';

export function useChatSocketListeners() {
    const dispatch = useAppDispatch();

    useSocketEvent<SalaChatFront[]>(
        SOCKET_EVENTOS.Chat.receberSalasDisponiveis,
        (salas) => {
            dispatch(setSalas(salas));
        }
    );

    useSocketEvent<MensagemChatRecebida>(
        SOCKET_EVENTOS.Chat.receberMensagem,
        (mensagem) => {
            dispatch(adicionarMensagem(mensagem));
        }
    );

    useEffect(() => {
        emitSocketEvent(SOCKET_EVENTOS.Chat.receberSalasDisponiveis);
    }, []);
};