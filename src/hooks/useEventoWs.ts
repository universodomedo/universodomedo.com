"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { isWsErrorResponse, type WsErrorResponse } from "types-nora-api";

export type EventoWsFn = {
    <D extends { tipo: "envia"; payload: any; fullName: string }>(def: D, payload: D["payload"]): void;
    <D extends { tipo: "emite"; response: any; fullName: string }>(def: D, handler: (payload: D["response"]) => void): () => void;
    <D extends { tipo: "envia-e-recebe"; payload?: any; response: any; fullName: string }>(def: D, payload: D["payload"], handler: (response: D["response"]) => void): void;
};

type WsSuccess<T> = Exclude<T, WsErrorResponse>;
type SocketMode = "auth-only" | "always";

let socketSingleton: Socket | null = null;
let socketMode: SocketMode = "auth-only";
let socketAuthAllowed = false;

export function setSocketAuthState(estaAutenticado: boolean) {
    socketAuthAllowed = estaAutenticado;
    if (!socketAuthAllowed && socketMode === "auth-only") clearSocketCache();
};

function canOpenSocket(): boolean {
    if (socketMode === "always") return true;
    return socketAuthAllowed;
};

export function getSocket(): Socket | null {
    if (typeof window === "undefined") return null;
    if (!canOpenSocket()) return null;

    if (socketSingleton) {
        return socketSingleton;
    }

    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    if (!url) return null;

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
                if (err) { console.error(`Erro no evento envia-e-recebe {${fullName}}: [${err}]`); return; }
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

type UseRecebeEmitWsOptions<D> = {
    onSuccess: (payload: WsSuccess<D extends { response: any } ? D["response"] : any>) => void;
    onError?: (error: WsErrorResponse) => void;
};

export function useRecebeEmitWs<D extends { tipo: "emite"; response: any; fullName: string }>(def: D, handler: (payload: D["response"]) => void): void;
export function useRecebeEmitWs<D extends { tipo: "emite"; response: any; fullName: string }>(def: D, options: UseRecebeEmitWsOptions<D>): void;
export function useRecebeEmitWs<D extends { tipo: "emite"; response: any; fullName: string }>(def: D, handlerOrOptions: ((payload: D["response"]) => void) | UseRecebeEmitWsOptions<D>): void {
    const handlerRef = useRef<((payload: unknown) => void) | null>(null);
    const successRef = useRef<((payload: unknown) => void) | null>(null);
    const errorRef = useRef<((error: WsErrorResponse) => void) | null>(null);

    if (typeof handlerOrOptions === "function") {
        handlerRef.current = handlerOrOptions as unknown as (payload: unknown) => void;
        successRef.current = null;
        errorRef.current = null;
    } else {
        handlerRef.current = null;
        successRef.current = handlerOrOptions.onSuccess as unknown as (payload: unknown) => void;
        errorRef.current = (handlerOrOptions.onError ?? null) as ((error: WsErrorResponse) => void) | null;
    }

    useEffect(() => {
        const unsubscribe = eventoWs(def, (payload: D["response"]) => {
            if (isWsErrorResponse(payload)) {
                if (errorRef.current) { errorRef.current(payload); return; }
                const code = payload.code ? ` code=${payload.code}` : "";
                console.error(`[WS ERRO] Evento {${def.fullName}}:${code} ${payload.mensagem}`);
                return;
            }

            if (successRef.current) { successRef.current(payload as unknown); return; }
            if (handlerRef.current) { handlerRef.current(payload as unknown); }
        });

        return () => { if (typeof unsubscribe === "function") { unsubscribe(); } };
    }, [def.fullName]);
};

type UseEmitWsOptions<D> = {
    onSuccess: (payload: D extends { response: any } ? D["response"] : any) => void;
    onError?: (error: WsErrorResponse) => void;
};

export function useEmitWsComDisparoInicial<D extends { tipo: string; payload: any; response: any; fullName: string }>(def: D, handler: (payload: D["response"]) => void, initialPayload?: D["payload"]): void;
export function useEmitWsComDisparoInicial<D extends { tipo: string; payload: any; response: any; fullName: string }>(def: D, options: UseEmitWsOptions<D>, initialPayload?: D["payload"]): void;
export function useEmitWsComDisparoInicial(def: any, handlerOrOptions: any, initialPayload?: any): void {
    const successRef = useRef<((payload: unknown) => void) | null>(null);
    const errorRef = useRef<((error: WsErrorResponse) => void) | null>(null);

    if (typeof handlerOrOptions === "function") {
        successRef.current = handlerOrOptions as unknown as (payload: unknown) => void;
        errorRef.current = null;
    } else {
        successRef.current = handlerOrOptions.onSuccess as unknown as (payload: unknown) => void;
        errorRef.current = (handlerOrOptions.onError ?? null) as ((error: WsErrorResponse) => void) | null;
    }

    useEffect(() => {
        const socket = getSocket();

        if (!socket) {
            console.warn("[useEmitWsComDisparoInicial] Socket indisponível (bloqueado por auth ou URL ausente).");
            return;
        }

        const wrapped = (payload: unknown) => {
            if (isWsErrorResponse(payload)) {
                if (errorRef.current) { errorRef.current(payload); return; }
                const code = payload.code ? ` code=${payload.code}` : "";
                console.error(`[WS ERRO] Evento {${def.fullName}}:${code} ${payload.mensagem}`);
                return;
            }

            if (successRef.current) { successRef.current(payload as unknown); }
        };

        socket.on(def.fullName, wrapped);

        const payloadToSend = (initialPayload ?? {});
        socket.emit(def.fullName, payloadToSend);

        return () => {
            socket.off(def.fullName, wrapped);
        };
    }, [def.fullName]);
};