'use client';

import { useContextoToast, type ContextoToastProps, type ToastOpcao } from 'Contextos/ContextoToast/contexto';

export type ToastApi = ContextoToastProps;
export type ToastOpcoes = ToastOpcao;

let toastApi: ToastApi | null = null;

function getToastApi(): ToastApi {
    if (!toastApi) throw new Error('Toast não inicializado. Garanta que o Provider do Toast registrou o toast.');
    return toastApi;
};

export function registerToast(api: ToastApi): void { toastApi = api; }

export function unregisterToast(): void { toastApi = null; }

export const toast: ToastApi = {
    sucesso: (titulo, mensagem, opcoes) => getToastApi().sucesso(titulo, mensagem, opcoes),
    aviso: (titulo, mensagem, opcoes) => getToastApi().aviso(titulo, mensagem, opcoes),
    atencao: (titulo, mensagem, opcoes) => {
        const fn = getToastApi().atencao;
        if (!fn) throw new Error('Toast.atencao não está disponível no ContextoToast atual.');
        return fn(titulo, mensagem, opcoes);
    },
    erro: (titulo, mensagem, opcoes) => getToastApi().erro(titulo, mensagem, opcoes),
    fechar: (id) => getToastApi().fechar(id),
};

export function useToast(): ToastApi { return useContextoToast(); };