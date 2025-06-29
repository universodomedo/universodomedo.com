import { useEffect } from 'react';
import { getSocket } from 'Libs/socket';
import { EventoSocket } from 'types-nora-api';

export function useSocketEvent<T = any>(evento: EventoSocket, handler: (data: T) => void) {
    useEffect(() => {
        const socket = getSocket();

        if (socket.connected) {
            socket.on(evento, handler);
        } else {
            socket.once('connect', () => {
                socket.on(evento, handler);
            });
        }

        return () => {
            socket.off(evento, handler);
        };
    }, [evento, handler]);
}