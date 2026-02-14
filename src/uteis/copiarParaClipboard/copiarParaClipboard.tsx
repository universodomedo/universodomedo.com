'use client';

let implCopiar: ((text: string) => Promise<boolean>) | null = null;

export function registrarCopiarParaClipboard(fn: (text: string) => Promise<boolean>) { implCopiar = fn; }
export function limparCopiarParaClipboard() { implCopiar = null; }

export async function copiarParaClipboard(text: string): Promise<boolean> {
    if (!implCopiar) return false;
    return implCopiar(text);
};