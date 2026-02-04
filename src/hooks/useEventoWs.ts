"use client";

import { useEffect, useRef, useState } from "react";
import { isWsErrorResponse, type WsErrorResponse } from "types-nora-api";
import { io, type Socket } from "socket.io-client";

type EnviaERecebeOptions<R> = { onSuccess: (response: R) => void; onError?: (error: WsErrorResponse) => void; timeoutMs?: number; };

type EventoEnviaDef<P extends object> = { tipo: "envia"; payload: P; fullName: string; };
type EventoEmiteDef<P extends object, R extends object> = { tipo: "emite"; payload: P; response: R; fullName: string; };
type EventoEnviaERecebeDef<P extends object, R extends object> = { tipo: "envia-e-recebe"; payload: P; response: R; fullName: string; };
type EventoDef = EventoEnviaDef<object> | EventoEmiteDef<object, object> | EventoEnviaERecebeDef<object, object>;

export type EventoWsFn = {
    <D extends EventoEnviaDef<object>>(def: D, payload: D["payload"]): void;
    <D extends EventoEmiteDef<object, object>>(def: D, handler: (payload: D["response"] | WsErrorResponse) => void): () => void;
    <D extends EventoEnviaERecebeDef<object, object>>(def: D, payload: D["payload"], handler: (response: D["response"]) => void): void;
    <D extends EventoEnviaERecebeDef<object, object>>(def: D, payload: D["payload"], options: EnviaERecebeOptions<D["response"]>): void;
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
    socket.on("connect_error", (err: Error) => {
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

export function getActiveConnections() { return socketSingleton?.connected ? ["/"] : []; }

export const eventoWs: EventoWsFn = ((def: EventoDef, arg2: object | ((payload: object | WsErrorResponse) => void), arg3?: ((response: object) => void) | EnviaERecebeOptions<object>) => {
    const socket = getSocket();

    if (!socket) {
        if (def.tipo === "emite") return () => { };
        return;
    }

    const { tipo, fullName } = def;

    if (tipo === "envia") {
        if (!socket.connected) { try { socket.connect(); } catch (_err) { } }
        socket.emit(fullName, arg2 as object);
        return;
    }

    if (tipo === "emite") {
        const handler = arg2 as (payload: object | WsErrorResponse) => void;
        const wrapped = (payload: object | WsErrorResponse) => { handler(payload); };
        socket.on(fullName, wrapped);
        if (!socket.connected) { try { socket.connect(); } catch (_err) { } }
        return () => { socket.off(fullName, wrapped); };
    }

    if (tipo === "envia-e-recebe") {
        const payload = arg2 as object;
        if (!socket.connected) { try { socket.connect(); } catch (_err) { } }

        const timeoutMs = (typeof arg3 === "object" && arg3 && typeof (arg3 as { timeoutMs?: number }).timeoutMs === "number") ? (arg3 as { timeoutMs: number }).timeoutMs : 5000;
        const onSuccess = (typeof arg3 === "function") ? (arg3 as (r: object) => void) : (typeof arg3 === "object" && arg3 ? (arg3 as { onSuccess: (r: object) => void }).onSuccess : null);
        const onError = (typeof arg3 === "object" && arg3 && "onError" in arg3 && typeof (arg3 as { onError?: (e: WsErrorResponse) => void }).onError === "function") ? (arg3 as { onError: (e: WsErrorResponse) => void }).onError : null;

        socket.timeout(timeoutMs).emit(fullName, payload, (err: Error | null, response: object) => {
            if (err) { if (onError) onError({ _wsErro: true, mensagem: "Timeout/erro ao aguardar resposta do WebSocket", code: "TIMEOUT", detalhes: { message: err.message } }); return; }
            if (isWsErrorResponse(response)) { if (onError) onError(response); return; }
            if (onSuccess) onSuccess(response);
        });

        return;
    }
}) as EventoWsFn;

type UseRecebeEmitWsOptions<D> = {
    onSuccess: (payload: WsSuccess<D extends { response: object } ? D["response"] : object>) => void;
    onError?: (error: WsErrorResponse) => void;
};

export function useRecebeEmitWs<D extends { tipo: "emite"; response: object; fullName: string }>(def: D, handler: (payload: D["response"]) => void): void;
export function useRecebeEmitWs<D extends { tipo: "emite"; response: object; fullName: string }>(def: D, options: UseRecebeEmitWsOptions<D>): void;
export function useRecebeEmitWs<D extends { tipo: "emite"; response: object; fullName: string }>(def: D, handlerOrOptions: ((payload: D["response"]) => void) | UseRecebeEmitWsOptions<D>): void {
    const handlerRef = useRef<((payload: D["response"]) => void) | null>(null);
    const successRef = useRef<((payload: D["response"]) => void) | null>(null);
    const errorRef = useRef<((error: WsErrorResponse) => void) | null>(null);
    const epoch = useSocketEpoch();

    if (typeof handlerOrOptions === "function") {
        handlerRef.current = handlerOrOptions;
        successRef.current = null;
        errorRef.current = null;
    } else {
        handlerRef.current = null;
        successRef.current = handlerOrOptions.onSuccess as (payload: D["response"]) => void;
        errorRef.current = (handlerOrOptions.onError ?? null) as ((error: WsErrorResponse) => void) | null;
    }

    useEffect(() => {
        const unsubscribe = eventoWs(def as unknown as EventoEmiteDef<object, object>, (payload: D["response"] | WsErrorResponse) => {
            if (isWsErrorResponse(payload)) { if (errorRef.current) errorRef.current(payload); return; }
            if (successRef.current) { successRef.current(payload as D["response"]); return; }
            if (handlerRef.current) handlerRef.current(payload as D["response"]);
        });

        return () => { if (typeof unsubscribe === "function") unsubscribe(); };
    }, [def.fullName, epoch]);
};

type UseEmitWsEstadoOptions<D> = {
    onSuccess: (payload: WsSuccess<D extends { response: object } ? D["response"] : object>) => void;
    onError?: (error: WsErrorResponse) => void;
};

export function useEmitWsComDisparoInicial<D extends { tipo: "emite"; payload: object; response: object; fullName: string }>(def: D, handler: (payload: D["response"]) => void, initialPayload?: D["payload"]): void;
export function useEmitWsComDisparoInicial<D extends { tipo: "emite"; payload: object; response: object; fullName: string }>(def: D, options: UseEmitWsEstadoOptions<D>, initialPayload?: D["payload"]): void;
export function useEmitWsComDisparoInicial<D extends { tipo: "emite"; payload: object; response: object; fullName: string }>(def: D, handlerOrOptions: ((payload: D["response"]) => void) | UseEmitWsEstadoOptions<D>, initialPayload?: D["payload"]): void {
    const handlerRef = useRef<((payload: D["response"]) => void) | null>(null);
    const successRef = useRef<((payload: D["response"]) => void) | null>(null);
    const errorRef = useRef<((error: WsErrorResponse) => void) | null>(null);
    const initialPayloadRef = useRef<D["payload"]>((initialPayload ?? {}) as D["payload"]);
    const listenerRef = useRef<((payload: D["response"] | WsErrorResponse) => void) | null>(null);
    const epoch = useSocketEpoch();

    initialPayloadRef.current = (initialPayload ?? {}) as D["payload"];

    if (typeof handlerOrOptions === "function") {
        handlerRef.current = handlerOrOptions;
        successRef.current = null;
        errorRef.current = null;
    } else {
        handlerRef.current = null;
        successRef.current = handlerOrOptions.onSuccess as (payload: D["response"]) => void;
        errorRef.current = (handlerOrOptions.onError ?? null) as ((error: WsErrorResponse) => void) | null;
    }

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const wrapped = (payload: D["response"] | WsErrorResponse) => {
            if (isWsErrorResponse(payload)) { if (errorRef.current) errorRef.current(payload); return; }
            if (successRef.current) { successRef.current(payload as D["response"]); return; }
            if (handlerRef.current) handlerRef.current(payload as D["response"]);
        };

        if (listenerRef.current) socket.off(def.fullName, listenerRef.current);
        listenerRef.current = wrapped;
        socket.on(def.fullName, wrapped);

        const emitInitial = () => { socket.emit(def.fullName, initialPayloadRef.current); };

        if (!socket.connected) {
            const onConnect = () => { emitInitial(); };
            socket.once("connect", onConnect);
            try { socket.connect(); } catch (_err) { }
            return () => {
                if (listenerRef.current) socket.off(def.fullName, listenerRef.current);
                socket.off("connect", onConnect);
            };
        }

        emitInitial();

        return () => {
            if (listenerRef.current) socket.off(def.fullName, listenerRef.current);
        };
    }, [def.fullName, epoch]);
};