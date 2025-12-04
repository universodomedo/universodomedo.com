"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

export type EventoWsFn = {
    <D extends { tipo: "envia"; payload: any; fullName: string }>(def: D, payload: D["payload"]): void;
    <D extends { tipo: "emite"; response: any; fullName: string }>(def: D, handler: (payload: D["response"]) => void): () => void;
    <D extends { tipo: "envia-e-recebe"; payload?: any; response: any; fullName: string }>(def: D, payload: D["payload"], handler: (response: D["response"]) => void): void;
};

export type WsErrorResponse = {
    _wsErro: true;
    mensagem: string;
    [key: string]: any;
};

export function isWsErrorResponse(response: unknown): response is WsErrorResponse {
    return !!response && typeof response === "object" && (response as any)._wsErro === true;
};

let socketSingleton: Socket | null = null;

export function getSocket(): Socket | null {
    if (typeof window === "undefined") return null;

    if (socketSingleton) {
        return socketSingleton;
    }

    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    const socket = io(url, { withCredentials: true, transports: ["websocket"] });

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

type UseEmitWsOptions<D> = {
    onSuccess: (payload: D extends { response: any } ? D["response"] : any) => void;
    onError?: (error: WsErrorResponse) => void;
};

// overloads aceitam qualquer evento com fullName/response/payload (tipo pode ser "emite" ou "envia-e-recebe")
export function useEmitWsComDisparoInicial<D extends { tipo: string; payload: any; response: any; fullName: string }>(def: D, handler: (payload: D["response"]) => void, initialPayload?: D["payload"]): void;
export function useEmitWsComDisparoInicial<D extends { tipo: string; payload: any; response: any; fullName: string }>(def: D, options: UseEmitWsOptions<D>, initialPayload?: D["payload"]): void;
export function useEmitWsComDisparoInicial(def: any, handlerOrOptions: any, initialPayload?: any): void {
    const successRef = useRef<((payload: any) => void) | null>(null);
    const errorRef = useRef<((error: WsErrorResponse) => void) | null>(null);

    if (typeof handlerOrOptions === "function") {
        successRef.current = handlerOrOptions as (payload: any) => void;
        errorRef.current = null;
    } else {
        successRef.current = handlerOrOptions.onSuccess;
        errorRef.current = handlerOrOptions.onError ?? null;
    }

    useEffect(() => {
        const socket = getSocket();

        if (!socket) {
            console.warn("[useEmitWsComDisparoInicial] Socket ainda não disponível ao montar.");
            return;
        }

        const wrapped = (payload: unknown) => {
            if (isWsErrorResponse(payload)) {
                if (errorRef.current) {
                    errorRef.current(payload);
                } else {
                    console.error(`[WS ERRO] Evento {${def.fullName}}: ${payload.mensagem}`);
                }
                return;
            }

            if (successRef.current) {
                successRef.current(payload);
            }
        };

        socket.on(def.fullName, wrapped);

        const payloadToSend = (initialPayload ?? {});
        socket.emit(def.fullName, payloadToSend);

        return () => {
            socket.off(def.fullName, wrapped);
        };
    }, [def.fullName]);
};