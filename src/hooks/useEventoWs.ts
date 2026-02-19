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

function ackErrorFromSocketError(err: Error): WsErrorResponse { return { _wsErro: true, mensagem: "Erro ao conectar/aguardar resposta do WebSocket", code: "SOCKET_ERROR", detalhes: { message: err.message } }; }

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

        const timeoutMs = (typeof arg3 === "object" && arg3 && typeof (arg3 as { timeoutMs?: number }).timeoutMs === "number") ? (arg3 as { timeoutMs: number }).timeoutMs : 5000;
        const onSuccess = (typeof arg3 === "function") ? (arg3 as (r: object) => void) : (typeof arg3 === "object" && arg3 ? (arg3 as { onSuccess: (r: object) => void }).onSuccess : null);
        const onError = (typeof arg3 === "object" && arg3 && "onError" in arg3 && typeof (arg3 as { onError?: (e: WsErrorResponse) => void }).onError === "function") ? (arg3 as { onError: (e: WsErrorResponse) => void }).onError : null;

        const doEmit = () => {
            socket.timeout(timeoutMs).emit(fullName, payload, (err: Error | null, response: object) => {
                if (err) { if (onError) onError({ _wsErro: true, mensagem: "Timeout/erro ao aguardar resposta do WebSocket", code: "TIMEOUT", detalhes: { message: err.message } }); return; }
                if (isWsErrorResponse(response)) { if (onError) onError(response); return; }
                if (onSuccess) onSuccess(response);
            });
        };

        if (!socket.connected) {
            const onConnect = () => { doEmit(); };
            const onConnectError = (err: Error) => { if (onError) onError(ackErrorFromSocketError(err)); };
            socket.once("connect", onConnect);
            socket.once("connect_error", onConnectError);
            try { socket.connect(); } catch (_err) { }
            return;
        }

        doEmit();
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
    timeoutMs?: number;
};

type PendingResult<T> = { ok: true; value: T } | { ok: false; error: WsErrorResponse };
const pendingInitialRequests = new Map<string, Promise<PendingResult<object>>>();

function requestInitialWithDedupe<P extends object, R extends object>(socket: Socket, fullName: string, payload: P, timeoutMs: number): Promise<PendingResult<R>> {
    const key = fullName;
    const existing = pendingInitialRequests.get(key);
    if (existing) return existing as Promise<PendingResult<R>>;

    const p = new Promise<PendingResult<R>>(resolve => {
        const doEmit = () => {
            socket.timeout(timeoutMs).emit(fullName, payload, (err: Error | null, response: R | WsErrorResponse) => {
                if (err) { resolve({ ok: false, error: { _wsErro: true, mensagem: "Timeout/erro ao aguardar resposta do WebSocket", code: "TIMEOUT", detalhes: { message: err.message } } }); return; }
                if (isWsErrorResponse(response)) { resolve({ ok: false, error: response }); return; }
                resolve({ ok: true, value: response as R });
            });
        };

        if (socket.connected) { doEmit(); return; }

        const onConnect = () => { doEmit(); };
        const onConnectError = (err: Error) => { resolve({ ok: false, error: ackErrorFromSocketError(err) }); };

        socket.once("connect", onConnect);
        socket.once("connect_error", onConnectError);
        try { socket.connect(); } catch (_err) { }
    }).finally(() => { pendingInitialRequests.delete(key); }) as Promise<PendingResult<object>>;

    pendingInitialRequests.set(key, p);
    return p as Promise<PendingResult<R>>;
}

export function useEmitWsComDisparoInicial<D extends { tipo: "emite"; payload: object; response: object; fullName: string }>(def: D, handler: (payload: D["response"]) => void, initialPayload?: D["payload"]): void;
export function useEmitWsComDisparoInicial<D extends { tipo: "emite"; payload: object; response: object; fullName: string }>(def: D, options: UseEmitWsEstadoOptions<D>, initialPayload?: D["payload"]): void;
export function useEmitWsComDisparoInicial<D extends { tipo: "emite"; payload: object; response: object; fullName: string }>(def: D, handlerOrOptions: ((payload: D["response"]) => void) | UseEmitWsEstadoOptions<D>, initialPayload?: D["payload"]): void {
    const handlerRef = useRef<((payload: D["response"]) => void) | null>(null);
    const successRef = useRef<((payload: D["response"]) => void) | null>(null);
    const errorRef = useRef<((error: WsErrorResponse) => void) | null>(null);
    const initialPayloadRef = useRef<D["payload"]>((initialPayload ?? {}) as D["payload"]);
    const timeoutMsRef = useRef<number>(5000);
    const epoch = useSocketEpoch();

    // ✅ impede “onSuccess” duplicado do disparo inicial
    const initialAppliedRef = useRef<{ fullName: string; applied: boolean }>({ fullName: "", applied: false });

    initialPayloadRef.current = (initialPayload ?? {}) as D["payload"];

    if (typeof handlerOrOptions === "function") {
        handlerRef.current = handlerOrOptions;
        successRef.current = null;
        errorRef.current = null;
        timeoutMsRef.current = 5000;
    } else {
        handlerRef.current = null;
        successRef.current = handlerOrOptions.onSuccess as (payload: D["response"]) => void;
        errorRef.current = (handlerOrOptions.onError ?? null) as ((error: WsErrorResponse) => void) | null;
        timeoutMsRef.current = typeof handlerOrOptions.timeoutMs === "number" ? handlerOrOptions.timeoutMs : 5000;
    }

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        if (initialAppliedRef.current.fullName !== def.fullName) initialAppliedRef.current = { fullName: def.fullName, applied: false };

        const onMessage = (payload: D["response"] | WsErrorResponse) => {
            if (isWsErrorResponse(payload)) { if (errorRef.current) errorRef.current(payload); return; }
            if (successRef.current) { successRef.current(payload as D["response"]); return; }
            if (handlerRef.current) handlerRef.current(payload as D["response"]);
        };

        socket.on(def.fullName, onMessage);

        const runInitial = async () => {
            const result = await requestInitialWithDedupe(socket, def.fullName, initialPayloadRef.current, timeoutMsRef.current);

            // ✅ mesmo que o effect rode 2x, só aplica 1 vez
            if (initialAppliedRef.current.applied) return;
            initialAppliedRef.current.applied = true;

            if (!result.ok) { if (errorRef.current) errorRef.current(result.error); return; }
            if (successRef.current) successRef.current(result.value as D["response"]);
            else if (handlerRef.current) handlerRef.current(result.value as D["response"]);
        };

        void runInitial();

        return () => { socket.off(def.fullName, onMessage); };
    }, [def.fullName, epoch]);
};