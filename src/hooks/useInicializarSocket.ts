import { useEffect } from 'react';
import { getSocket } from 'Libs/socket.ts';

export default function useInicializarSocket(deveConectar: boolean) {
    useEffect(() => {
        if (!deveConectar) return;

        const socket = getSocket();

        if (!socket.connected) {
            socket.connect();
        }
    }, [deveConectar]);
}
