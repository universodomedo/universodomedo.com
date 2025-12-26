"use client";

import { useEffect, useRef, useState } from "react";
import { isWsErrorResponse, type WsErrorResponse } from "types-nora-api";
import { io, type Socket } from "socket.io-client";

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
let socketAuthKnown = false;

let socketEpoch = 0;
const socketEpochListeners = new Set<() => void>();

function bumpSocketEpoch() { socketEpoch++; socketEpochListeners.forEach(fn => fn()); }

function useSocketEpoch() {
    const [v, setV] = useState(socketEpoch);
    useEffect(() => {
        const fn = () => setV(socketEpoch);
        socketEpochListeners.add(fn);
        return () => { socketEpochListeners.delete(fn); };
    }, []);
    return v;
}

export function setSocketAuthState(estaAutenticado: boolean, authKnown: boolean) {
    socketAuthAllowed = estaAutenticado;
    socketAuthKnown = authKnown;
    bumpSocketEpoch();
    if (socketAuthKnown && !socketAuthAllowed && socketMode === "auth-only") clearSocketCache();
};

function canOpenSocket(): boolean {
    if (socketMode === "always") return true;
    if (!socketAuthKnown) return false;
    return socketAuthAllowed;
};

function redirectToLogin() {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/acessar" || window.location.pathname === "/login") return;
    const next = window.location.pathname + window.location.search + window.location.hash;
    window.location.assign(`/acessar?next=${encodeURIComponent(next)}`);
};

export function getSocket(): Socket | null {
    if (typeof window === "undefined") return null;

    if (socketMode === "auth-only") {
        if (!socketAuthKnown) return null;
        if (!socketAuthAllowed) { redirectToLogin(); return null; }
    }

    if (!canOpenSocket()) return null;

    if (socketSingleton) return socketSingleton;

    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    if (!url) return null;

    const socket = io(url, { withCredentials: true, transports: ["websocket"], autoConnect: false });

    socket.on("connect", () => { bumpSocketEpoch(); });
    socket.on("disconnect", () => { bumpSocketEpoch(); });
    socket.on("connect_error", (err: any) => {
        bumpSocketEpoch();
        const msg = String(err?.message || "").toLowerCase();
        if (msg.includes("unauthorized") || msg.includes("jwt") || msg.includes("token")) redirectToLogin();
    });

    socketSingleton = socket;
    bumpSocketEpoch();

    return socketSingleton;
};

export function clearSocketCache() {
    if (socketSingleton) { try { socketSingleton.disconnect(); } catch (_err) { } }
    socketSingleton = null;
    bumpSocketEpoch();
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
        if (!socket.connected) { try { socket.connect(); } catch (_err) { } }
        socket.emit(fullName, arg2);
        return;
    }

    if (tipo === "emite") {
        const handler = arg2 as (payload: unknown) => void;
        const wrapped = (payload: unknown) => { handler(payload); };
        socket.on(fullName, wrapped);
        if (!socket.connected) { try { socket.connect(); } catch (_err) { } }
        return () => { socket.off(fullName, wrapped); };
    }

    if (tipo === "envia-e-recebe") {
        const payload = arg2;
        if (!socket.connected) { try { socket.connect(); } catch (_err) { } }

        if (typeof arg3 === "function") {
            socket.timeout(5000).emit(fullName, payload, (err: unknown, response: unknown) => {
                if (err) return;
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
    const epoch = useSocketEpoch();

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
                return;
            }
            if (successRef.current) { successRef.current(payload as unknown); return; }
            if (handlerRef.current) { handlerRef.current(payload as unknown); }
        });

        return () => { if (typeof unsubscribe === "function") { unsubscribe(); } };
    }, [def.fullName, epoch]);
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
    const epoch = useSocketEpoch();

    if (typeof handlerOrOptions === "function") {
        successRef.current = handlerOrOptions as unknown as (payload: unknown) => void;
        errorRef.current = null;
    } else {
        successRef.current = handlerOrOptions.onSuccess as unknown as (payload: unknown) => void;
        errorRef.current = (handlerOrOptions.onError ?? null) as ((error: WsErrorResponse) => void) | null;
    }

    useEffect(() => {
        const socket = getSocket();

        if (!socket) return;

        const wrapped = (payload: unknown) => {
            if (isWsErrorResponse(payload)) {
                if (errorRef.current) { errorRef.current(payload); return; }
                return;
            }
            if (successRef.current) { successRef.current(payload as unknown); }
        };

        socket.on(def.fullName, wrapped);

        const doEmit = () => {
            const payloadToSend = (initialPayload ?? {});
            socket.emit(def.fullName, payloadToSend);
        };

        if (!socket.connected) {
            const onConnect = () => { doEmit(); };
            socket.once("connect", onConnect);
            try { socket.connect(); } catch (_err) { }
            return () => { socket.off(def.fullName, wrapped); socket.off("connect", onConnect); };
        }

        doEmit();

        return () => { socket.off(def.fullName, wrapped); };
    }, [def.fullName, epoch]);
};