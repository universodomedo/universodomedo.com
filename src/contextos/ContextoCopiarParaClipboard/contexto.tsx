'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { limparCopiarParaClipboard, registrarCopiarParaClipboard } from 'Uteis/copiarParaClipboard/copiarParaClipboard';

interface ContextoCopiarParaClipboardProps {
    copiarParaClipboard: (text: string) => Promise<boolean>;
    mensagemToast: string | null;
};

const ContextoCopiarParaClipboard = createContext<ContextoCopiarParaClipboardProps | undefined>(undefined);

export const useContextoCopiarParaClipboard = (): ContextoCopiarParaClipboardProps => {
    const context = useContext(ContextoCopiarParaClipboard);
    if (!context) throw new Error('useContextoCopiarParaClipboard precisa estar dentro de um ContextoCopiarParaClipboard');
    return context;
};

async function writeToClipboard(text: string): Promise<boolean> {
    if (!text) return false;
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') { await navigator.clipboard.writeText(text); return true; }
    if (typeof document === 'undefined') return false;
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999em';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
}

export const ContextoCopiarParaClipboardProvider = ({ children }: { children: React.ReactNode }) => {
    const [mensagemToast, setMensagemToast] = useState<string | null>(null);
    const timerRef = useRef<number | null>(null);

    async function copiarParaClipboard(text: string): Promise<boolean> {
        try {
            const ok = await writeToClipboard(text);
            if (!ok) return false;

            setMensagemToast('Valor movido para Clipboard');

            if (timerRef.current) window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => { setMensagemToast(null); }, 1800);

            return true;
        } catch {
            return false;
        }
    }

    useEffect(() => {
        registrarCopiarParaClipboard(copiarParaClipboard);
        return () => {
            limparCopiarParaClipboard();
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <ContextoCopiarParaClipboard.Provider value={{ copiarParaClipboard, mensagemToast }}>
            {children}
        </ContextoCopiarParaClipboard.Provider>
    );
};