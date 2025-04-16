'use client';

import { useEffect } from 'react';
import { getSocket } from 'libs/socket';

export function useSocketEvent<T = any>(event: string, handler: (data: T) => void) {
    useEffect(() => {
        const socket = getSocket();

        // Aguarda conexão para registrar o listener
        if (socket.connected) {
            socket.on(event, handler);
        } else {
            socket.once('connect', () => {
                socket.on(event, handler);
            });
        }

        // Limpeza: remove o handler ao desmontar
        return () => {
            socket.off(event, handler);
        };
    }, [event, handler]);
}