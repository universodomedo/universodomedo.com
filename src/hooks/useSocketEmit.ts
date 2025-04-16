'use client';

import { useEffect } from 'react';
import { getSocket } from 'libs/socket';

export function useSocketEmit<TResposta = any>(evento: string, payload?: any, onResposta?: (res: TResposta) => void) {
    useEffect(() => {
        const socket = getSocket();

        if (socket.connected) {
            socket.emit(evento, payload, onResposta);
        } else {
            socket.once('connect', () => {
                socket.emit(evento, payload, onResposta);
            });
        }
    }, [evento, JSON.stringify(payload)]);
}