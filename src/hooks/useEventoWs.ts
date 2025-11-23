"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

export type EventoWsFn = {
    <D extends { tipo: "envia"; payload: any; fullName: string }>(def: D, payload: D["payload"]): void;
    <D extends { tipo: "emite"; response: any; fullName: string }>(def: D, handler: (payload: D["response"]) => void): () => void;
    <D extends { tipo: "envia-e-recebe"; payload?: any; response: any; fullName: string }>(def: D, payload: D["payload"], handler: (response: D["response"]) => void): void;
};

let socketSingleton: Socket | null = null;

export function getSocket(): Socket | null {
    if (typeof window === "undefined") return null;

    if (socketSingleton) {
        // console.log("   ✅ REUTILIZANDO instância existente");
        return socketSingleton;
    }

    // console.log("   🆕 CRIANDO NOVA instância");
    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    const socket = io(url, { withCredentials: true, transports: ["websocket"] });

    // socket.on("connect", () => { console.log(`   ✅ CONECTADO - ID: ${socket.id}`); });
    // socket.on("disconnect", reason => { console.log(`   ❌ DESCONECTADO - Motivo: ${reason}`); });
    // socket.on("reconnect", attempt => { console.log(`   🔄 RECONECTANDO - Tentativa: ${attempt}`); });

    socketSingleton = socket;

    return socketSingleton;
};

export function clearSocketCache() {
    if (socketSingleton?.connected) { socketSingleton.disconnect(); }
    socketSingleton = null;
};

export function getActiveConnections() { return socketSingleton?.connected ? ["/"] : []; };

export const eventoWs: EventoWsFn = ((def: any, arg2: any, arg3?: any) => {
    const socket = getSocket();

    if (!socket) {
        if (def?.tipo === "envia-e-recebe") {
            if (arg3) return;
            return Promise.reject(new Error("Socket não conectado ainda"));
        }
        if (def?.tipo === "emite") return () => { };
        return;
    }

    const { tipo, fullName } = def;

    if (tipo === "envia") {
        socket.emit(fullName, arg2);
        return;
    }

    if (tipo === "emite") {
        const handler = arg2 as (payload: unknown) => void;

        const wrapped = (payload: unknown) => { handler(payload); };

        socket.on(fullName, wrapped);

        return () => { socket.off(fullName, wrapped); };
    }

    if (tipo === "envia-e-recebe") {
        const payload = arg2;

        // se veio callback (3º arg), usa callback e não retorna Promise
        if (typeof arg3 === "function") {

            socket.timeout(5000).emit(fullName, payload, (err: unknown, response: unknown) => {

                if (err) {
                    console.error(`Erro no evento envia-e-recebe {${fullName}}: [${err}]`);
                    return;
                }

                (arg3 as (response: unknown) => void)(response);
            });

            return;
        }

        return new Promise((resolve, reject) => {
            socket.timeout(5000).emit(fullName, payload, (err: unknown, response: unknown) => {
                if (err) return reject(err);
                resolve(response);
            });
        });
    }
}) as EventoWsFn;

export function useRecebeEmitWs<D extends { tipo: "emite"; response: any; fullName: string }>(def: D, handler: (payload: D["response"]) => void): void {
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    useEffect(() => {
        const unsubscribe = eventoWs(def, (payload: D["response"]) => { handlerRef.current(payload); });
        return () => { if (typeof unsubscribe === "function") { unsubscribe(); } };
    }, [def.fullName]);
};

export function useEmitWsComDisparoInicial<D extends { tipo: "emite"; payload: any; response: any; fullName: string }>(def: D, handler: (payload: D["response"]) => void, initialPayload?: D["payload"]): void {
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    useEffect(() => {
        // 1) Assina o evento "emite" (server -> client)
        const unsubscribe = eventoWs(def, (payload: D["response"]) => {
            handlerRef.current(payload);
        });

        // 2) Dispara o "agora" uma única vez, usando o MESMO evento
        const socket = getSocket();

        if (socket) {
            const payloadToSend = (initialPayload ?? ({} as D["payload"]));
            socket.emit(def.fullName, payloadToSend);
        } else {
            console.warn("[useEmitWsComDisparoInicial] Socket ainda não disponível ao montar.");
        }

        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
        };
    }, [def.fullName]);
};