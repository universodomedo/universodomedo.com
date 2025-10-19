import { io, Socket } from "socket.io-client";

// Cache por namespace
const socketCache = new Map<string, Socket>();

export const getSocket = (namespace: string = '/'): Socket => {
    if (typeof window === "undefined") throw new Error("getSocket() só pode ser chamado no client");

    if (socketCache.has(namespace)) return socketCache.get(namespace)!;

    const url = namespace === '/' ? process.env.NEXT_PUBLIC_WEBSOCKET_URL : `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}${namespace}`;

    // console.log(`[socket] Conectando em: ${url} (namespace: ${namespace})`);

    const socket = io(url, { withCredentials: true, transports: ['websocket'] });

    // socket.on('connect', () => console.log(`[socket] connect -> namespace=${namespace}, id=`, socket.id));
    // socket.on('connect_error', (err) => console.error(`[socket] connect_error -> namespace=${namespace}`, err));
    // socket.on('disconnect', (reason) => console.log(`[socket] disconnect -> namespace=${namespace}`, reason));

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