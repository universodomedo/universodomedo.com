"use client";

import { io, type Socket } from "socket.io-client";

type EventoWsFn = {
    <D extends { tipo: "envia"; payload: any; fullName: string; }>(def: D, payload: D["payload"]): void;
    <D extends { tipo: "recebe"; payload: any; fullName: string; }>(def: D, handler: (payload: D["payload"]) => void): () => void;
    <D extends { tipo: "recebe-envia"; payload: any; response: any; fullName: string; }>(def: D, payload: D["payload"]): Promise<D["response"]>;
};

let socketSingleton: Socket | null = null;

export function getSocket(): Socket | null {
    if (typeof window === "undefined") return null;

    if (socketSingleton) {
        console.log(`   ✅ REUTILIZANDO instância existente`);
        return socketSingleton;
    }

    console.log(`   🆕 CRIANDO NOVA instância`);
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    const socket = io(url, { withCredentials: true, transports: ["websocket"] });

    socket.on("connect", () => {
        console.log(`   ✅ CONECTADO - ID: ${socket.id}`);
    });

    socket.on("disconnect", (reason) => {
        console.log(`   ❌ DESCONECTADO - Motivo: ${reason}`);
    });

    socket.on("reconnect", (attempt) => {
        console.log(`   🔄 RECONECTANDO - Tentativa: ${attempt}`);
    });

    socketSingleton = socket;

    return socketSingleton;
};

export function clearSocketCache() {
    if (socketSingleton?.connected) { socketSingleton.disconnect(); }
    socketSingleton = null;
};

export function getActiveConnections() { return socketSingleton?.connected ? ["/"] : []; };

export const useEventoWs: EventoWsFn = ((def: any, arg2: any) => {
    const socket = getSocket();

    if (!socket) {
        console.warn("[eventoWs] Socket ainda não disponível, evento ignorado:", def?.fullName);

        if (def?.tipo === "recebe-envia") return Promise.reject(new Error("Socket não conectado ainda"));

        if (def?.tipo === "recebe") return () => { };

        return;
    }

    const { tipo, fullName } = def;

    if (tipo === "envia") {
        socket.emit(fullName, arg2);
        return;
    }

    if (tipo === "recebe") {
        const handler = arg2 as (payload: unknown) => void;

        const wrapped = (payload: unknown) => {
            handler(payload);
        };

        socket.on(fullName, wrapped);

        // devolve função pra remover o listener
        return () => {
            socket.off(fullName, wrapped);
        };
    }

    if (tipo === "recebe-envia") {
        const payload = arg2;

        return new Promise((resolve, reject) => {
            socket.timeout(5000).emit(fullName, payload, (err: unknown, response: unknown) => {
                if (err) {
                    return reject(err);
                }
                resolve(response);
            });
        });
    }

    console.error("[eventoWs] Tipo de evento desconhecido:", def?.tipo ?? "?");
}) as EventoWsFn;