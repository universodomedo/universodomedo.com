'use client';

import { useCallback, useEffect, useRef } from 'react';
import { getSocket } from 'Libs/socket';
import { Eventos_Tipo_Emitir, Eventos_Tipo_Ouvir, Eventos_Tipo_RequestResponse } from 'types-nora-api'

export default function useSocket() {
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        console.log('🚀 useSocket iniciado');

        const socket = getSocket('/gameEngine');

        // Se já estiver conectado, enviar evento imediatamente
        if (socket.connected) {
            sendEvent(socket);
            return;
        }

        // Se não, aguardar conexão
        const onConnect = () => {
            console.log('✅ Socket conectado, enviando evento...');
            sendEvent(socket);
        };

        socket.on('connect', onConnect);

        // Cleanup
        return () => {
            socket.off('connect', onConnect);
        };
    }, []);

    const sendEvent = async (socket: any) => {
        try {
            const response = await socket.emitWithAck('/teste', {
                timestamp: new Date().toISOString(),
                source: 'com-namespace'
            });
            console.log('✅ Evento enviado, response:', response);
        } catch (error) {
            console.error('❌ Erro ao enviar evento:', error);
        }
    };
};