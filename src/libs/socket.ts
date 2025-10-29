import { io, Socket } from "socket.io-client";

// Cache por namespace
const socketCache = new Map<string, Socket>();

export const getSocket = (namespace: string = '/'): Socket => {
    if (typeof window === "undefined") throw new Error("getSocket() só pode ser chamado no client");

    console.log(`🔗 [getSocket] Chamado para namespace: "${namespace}"`);
    console.log(`   Cache atual:`, Array.from(socketCache.keys()));

    if (socketCache.has(namespace)) {
        console.log(`   ✅ REUTILIZANDO instância existente`);
        return socketCache.get(namespace)!;
    }

    console.log(`   🆕 CRIANDO NOVA instância`);
    const url = namespace === '/' ? process.env.NEXT_PUBLIC_WEBSOCKET_URL : `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}${namespace}`;

    const socket = io(url, { withCredentials: true, transports: ['websocket'] });

    socket.on('connect', () => {
        console.log(`   ✅ [${namespace}] CONECTADO - ID: ${socket.id}`);
    });

    socket.on('disconnect', (reason) => {
        console.log(`   ❌ [${namespace}] DESCONECTADO - Motivo: ${reason}`);
    });

    socket.on('reconnect', (attempt) => {
        console.log(`   🔄 [${namespace}] RECONECTANDO - Tentativa: ${attempt}`);
    });

    socketCache.set(namespace, socket);

    return socket;
};

export const clearSocketCache = (namespace?: string) => {
    if (namespace) {
        const socket = socketCache.get(namespace);
        if (socket?.connected) socket.disconnect();
        socketCache.delete(namespace);
    } else {
        socketCache.forEach((socket) => { if (socket.connected) socket.disconnect(); });
        socketCache.clear();
    }
};

export const getActiveConnections = () => Array.from(socketCache.entries()).filter(([_, socket]) => socket.connected).map(([ns]) => ns);