'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { DestinoInput } from 'Funcionalidades/navegacaoInterna';
import redirecionarInterno from 'Funcionalidades/redirecionarInterno';
import { useAppRefresh } from 'Contextos/ContextoAppRefresh/contexto';
import Toast from 'Componentes/ElementosVisuais/Toast/Toast';
import { registerToast, unregisterToast } from 'Hooks/useToast';

export type ToastTipo = 'sucesso' | 'aviso' | 'erro';

// Ação renderizada como botão no toast: executar roda e o toast fecha (ex.: notificação de palco com "Ouvir na Central").
export type ToastAcao = { rotulo: string; executar: () => void };

export type ToastOpcao = { recarregaPagina?: boolean } | { redirecionaLinkInterno: DestinoInput } | { acoes: ToastAcao[] };

export type ToastItem = { id: string; tipo: ToastTipo; titulo: string; mensagem?: string; acoes?: ToastAcao[] };

export interface ContextoToastProps {
    sucesso: (titulo: string, mensagem?: string, opcoes?: ToastOpcao) => Promise<void>;
    aviso: (titulo: string, mensagem?: string, opcoes?: ToastOpcao) => Promise<void>;
    atencao?: (titulo: string, mensagem?: string, opcoes?: ToastOpcao) => Promise<void>;
    erro: (titulo: string, mensagem?: string, opcoes?: ToastOpcao) => Promise<void>;
    fechar: (id: string) => void;
};

const ContextoToast = createContext<ContextoToastProps | undefined>(undefined);

export function useContextoToast(): ContextoToastProps {
    const ctx = useContext(ContextoToast);
    if (!ctx) throw new Error('useContextoToast precisa estar dentro de ContextoToastProvider');
    return ctx;
};

function uid(): string { return `${Date.now()}_${Math.random().toString(16).slice(2)}`; }

function isOpcaoRedirect(opcoes: ToastOpcao | undefined): opcoes is { redirecionaLinkInterno: DestinoInput } { return !!opcoes && typeof opcoes === 'object' && 'redirecionaLinkInterno' in opcoes; }

export function ContextoToastProvider({ children }: { children: React.ReactNode }) {
    const { recarregaPagina } = useAppRefresh();

    const maxVisiveis = 3;
    const [visiveis, setVisiveis] = useState<ToastItem[]>([]);
    const filaRef = useRef<ToastItem[]>([]);

    const pushVisiveis = useCallback((item: ToastItem) => {
        setVisiveis((curr) => {
            if (curr.length < maxVisiveis) return [item, ...curr];

            const maisAntigoVisivel = curr[curr.length - 1];
            filaRef.current = [...filaRef.current, maisAntigoVisivel];

            return [item, ...curr.slice(0, maxVisiveis - 1)];
        });
    }, []);

    const fechar = useCallback((id: string) => {
        setVisiveis((curr) => {
            const novo = curr.filter((t) => t.id !== id);

            if (novo.length < maxVisiveis && filaRef.current.length > 0) {
                const proximo = filaRef.current[filaRef.current.length - 1];
                filaRef.current = filaRef.current.slice(0, -1);
                return [...novo, proximo];
            }

            return novo;
        });
    }, []);

    const add = useCallback(async (tipo: ToastTipo, titulo: string, mensagem?: string, opcoes?: ToastOpcao) => {
        if (isOpcaoRedirect(opcoes)) {
            redirecionarInterno(opcoes.redirecionaLinkInterno);
            await new Promise<void>((r) => setTimeout(() => r(), 0));
        } else if (opcoes && 'recarregaPagina' in opcoes && opcoes.recarregaPagina) {
            recarregaPagina();
            await new Promise<void>((r) => setTimeout(() => r(), 0));
        }

        const acoes = opcoes && 'acoes' in opcoes ? opcoes.acoes : undefined;
        pushVisiveis({ id: uid(), tipo, titulo, mensagem, acoes });
    }, [pushVisiveis, recarregaPagina]);

    const api = useMemo<ContextoToastProps>(() => ({
        sucesso: (t, m, o) => add('sucesso', t, m, o),
        aviso: (t, m, o) => add('aviso', t, m, o),
        atencao: (t, m, o) => add('aviso', t, m, o),
        erro: (t, m, o) => add('erro', t, m, o),
        fechar,
    }), [add, fechar]);

    useEffect(() => {
        registerToast(api);
        return () => unregisterToast();
    }, [api]);

    return (
        <ContextoToast.Provider value={api}>
            {children}
            <Toast visiveis={visiveis} onFechar={fechar} />
        </ContextoToast.Provider>
    );
};