import { getSocket } from 'Libs/socket';
import { EventoSocket } from 'types-nora-api';

type EmitSocketOptions<T = any> = {
    onResposta?: (resposta: T) => void;
};

export function emitSocketEvent<TResposta = any>(evento: EventoSocket, payload?: any, options?: EmitSocketOptions<TResposta>) {
    const socket = getSocket();

    const emitir = () => {
        socket.emit(evento, payload, (resposta: TResposta) => {
            options?.onResposta?.(resposta);
        });
    };

    if (socket.connected) {
        emitir();
    } else {
        socket.once('connect', emitir);
    }
}