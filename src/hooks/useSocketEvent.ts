import { useEffect, useRef } from 'react';
import { getSocket } from 'Libs/socket';
import { EventoSocket } from 'types-nora-api';

export default function useSocketEvent<T = any>(evento: EventoSocket, handler: (data: T) => void) {
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    useEffect(() => {
        const socket = getSocket();

        const stableHandler = (data: T) => handlerRef.current(data);

        socket.on(evento, stableHandler);

        return () => {
            socket.off(evento, stableHandler);
        };
    }, [evento]);
};