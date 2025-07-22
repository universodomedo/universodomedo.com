import { useEffect } from 'react';
import { getSocket } from 'Libs/socket';
import { EventoSocket } from 'types-nora-api';

type UseSocketEmitOptions<TResposta = any, TPayload = any> = {
    payload?: TPayload;
    somenteSeConectado?: boolean;
    onResposta?: (resposta: TResposta) => void;
};

export function useSocketEmit<TResposta = any, TPayload = any>(evento: EventoSocket, options?: UseSocketEmitOptions<TResposta, TPayload>) {
    const { payload, onResposta, somenteSeConectado = false } = options || {};

    useEffect(() => {
        const socket = getSocket();

        const emitir = () => {
            console.log(`[SocketEmit] Emitindo evento: ${evento}`);
            socket.emit(evento, payload, onResposta);
        };

        if (somenteSeConectado && !socket.connected) {
            console.log(`[SocketEmit] Cancelado: socket não conectado`);
            return;
        }

        if (socket.connected) {
            console.log(`[SocketEmit] Emitindo direto pois já está conectado`);
            emitir();
        } else {
            console.log(`[SocketEmit] Aguardando conexão para emitir ${evento}`);
            socket.once('connect', emitir);
        }
    }, [evento, JSON.stringify(payload)]);
};