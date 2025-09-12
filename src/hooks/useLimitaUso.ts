// src/hooks/useLimitaUso.ts (versão alternativa)
import { useCallback, useState, useRef, useEffect } from "react";

interface UseLimitaUsoOptions {
    limit: number;
    timeWindow: number;
    storageKey?: string;
    onBlocked?: (remainingTime: number) => void;
    onUnblocked?: () => void;
}

interface UseLimitaUsoReturn {
    podeUsar: () => boolean;
    registrarUso: () => void;
    isBlocked: boolean;
    remainingTime: number;
    reset: () => void;
    stats: {
        usosRecentes: number;
        limite: number;
        janelaTempo: number;
    };
}

export default function useLimitaUso({ limit, timeWindow, storageKey, onBlocked, onUnblocked }: UseLimitaUsoOptions): UseLimitaUsoReturn {
    const timestampsRef = useRef<number[]>([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const verificarBloqueio = useCallback(() => {
        const now = Date.now();
        const windowMs = timeWindow * 1000;

        const recentTimestamps = timestampsRef.current.filter(
            timestamp => now - timestamp < windowMs
        );

        timestampsRef.current = recentTimestamps;
        const usosRecentes = recentTimestamps.length;

        if (usosRecentes >= limit) {
            const timestampMaisAntigo = Math.min(...recentTimestamps);
            const tempoRestante = Math.ceil((windowMs - (now - timestampMaisAntigo)) / 1000);

            setRemainingTime(tempoRestante);

            if (!isBlocked) {
                setIsBlocked(true);
                onBlocked?.(tempoRestante);
            }

            return false;
        }

        if (isBlocked) {
            setIsBlocked(false);
            setRemainingTime(0);
            onUnblocked?.();
        }

        return true;
    }, [limit, timeWindow, isBlocked, onBlocked, onUnblocked]);

    useEffect(() => {
        if (storageKey) {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    const data = JSON.parse(saved);
                    timestampsRef.current = data.timestamps || [];
                    verificarBloqueio();
                }
            } catch (error) {
                console.warn('Erro ao carregar dados persistidos:', error);
            }
        }
    }, [storageKey]);

    useEffect(() => {
        if (isBlocked) {
            intervalRef.current = window.setInterval(() => {
                verificarBloqueio();
            }, 1000);
        } else {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isBlocked, verificarBloqueio]);

    useEffect(() => {
        if (storageKey && timestampsRef.current.length > 0) {
            try {
                const data = {
                    timestamps: timestampsRef.current,
                    limit,
                    timeWindow
                };
                localStorage.setItem(storageKey, JSON.stringify(data));
            } catch (error) {
                console.warn('Erro ao salvar dados:', error);
            }
        }
    }, [timestampsRef.current, storageKey, limit, timeWindow]);

    const podeUsar = useCallback(() => {
        return verificarBloqueio();
    }, [verificarBloqueio]);

    const registrarUso = useCallback(() => {
        const now = Date.now();
        timestampsRef.current = [...timestampsRef.current, now];
        verificarBloqueio();
    }, [verificarBloqueio]);

    const reset = useCallback(() => {
        timestampsRef.current = [];
        setIsBlocked(false);
        setRemainingTime(0);
        if (storageKey) {
            localStorage.removeItem(storageKey);
        }
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, [storageKey]);

    const getStats = useCallback(() => ({
        usosRecentes: timestampsRef.current.length,
        limite: limit,
        janelaTempo: timeWindow
    }), [limit, timeWindow]);

    return {
        podeUsar,
        registrarUso,
        isBlocked,
        remainingTime,
        reset,
        stats: getStats()
    };
};