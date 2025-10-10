import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (typeof window === "undefined") throw new Error("getSocket() só pode ser chamado no client");

    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
            withCredentials: true,
            transports: ['websocket'],
        });

    socket.on('connect', () => console.log('[socket] connect -> id=', socket?.id));
    socket.on('connect_error', (err) => console.error('[socket] connect_error', err));
    socket.on('disconnect', (reason) => console.log('[socket] disconnect', reason));

        // socket.on("connect", () => {
        //     console.log("[socket] conectado:", socket?.id);
        // });

        // socket.on("disconnect", () => {
        //     console.log("[socket] desconectado");
        // });
    }

    return socket;
};