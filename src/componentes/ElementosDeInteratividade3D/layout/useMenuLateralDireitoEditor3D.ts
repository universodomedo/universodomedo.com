'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';

export type EstiloEditor3DComMenuLateralDireito = CSSProperties & {
    '--editor3d-largura-menu-direito': string;
};

export interface ControlesMenuLateralDireitoEditor3D {
    readonly colapsado: boolean;
    readonly redimensionando: boolean;
    alternaColapsado: () => void;
    iniciaRedimensionamento: () => void;
};

export interface MenuLateralDireitoEditor3D extends ControlesMenuLateralDireitoEditor3D {
    readonly editorRef: RefObject<HTMLElement | null>;
    readonly estiloEditor: EstiloEditor3DComMenuLateralDireito;
};

const larguraMinimaMenuLateralDireitoEditor3D = 14;
const larguraMaximaMenuLateralDireitoEditor3D = 36;
const larguraPadraoMenuLateralDireitoEditor3D = 22;

function limitaValorMenuLateralDireitoEditor3D(valor: number, minimo: number, maximo: number): number { return Math.min(maximo, Math.max(minimo, valor)); };

function obtemTamanhoFonteEditor3D(elemento: HTMLElement): number {
    const tamanhoFonte = Number.parseFloat(getComputedStyle(elemento).fontSize);

    return Number.isFinite(tamanhoFonte) && tamanhoFonte > 0 ? tamanhoFonte : 16;
};

export function useMenuLateralDireitoEditor3D(): MenuLateralDireitoEditor3D {
    const editorRef = useRef<HTMLElement | null>(null);
    const redimensionandoRef = useRef(false);
    const cursorOriginalBodyRef = useRef('');
    const selecaoOriginalBodyRef = useRef('');
    const [colapsado, setColapsado] = useState(false);
    const [redimensionando, setRedimensionando] = useState(false);
    const [largura, setLargura] = useState(larguraPadraoMenuLateralDireitoEditor3D);

    const estiloEditor = useMemo<EstiloEditor3DComMenuLateralDireito>(() => ({ '--editor3d-largura-menu-direito': `${largura}em` }), [largura]);

    const restauraEstadoGlobalRedimensionamento = useCallback((): void => {
        document.body.style.cursor = cursorOriginalBodyRef.current;
        document.body.style.userSelect = selecaoOriginalBodyRef.current;
    }, []);

    const finalizaRedimensionamento = useCallback((): void => {
        if (!redimensionandoRef.current) return;

        redimensionandoRef.current = false;
        setRedimensionando(false);
        restauraEstadoGlobalRedimensionamento();
    }, [restauraEstadoGlobalRedimensionamento]);

    useEffect(() => {
        function redimensiona(event: MouseEvent): void {
            const editor = editorRef.current;

            if (!redimensionandoRef.current || editor === null) return;

            const area = editor.getBoundingClientRect();
            const larguraEm = (area.right - event.clientX) / obtemTamanhoFonteEditor3D(editor);

            setLargura(limitaValorMenuLateralDireitoEditor3D(larguraEm, larguraMinimaMenuLateralDireitoEditor3D, larguraMaximaMenuLateralDireitoEditor3D));
            event.preventDefault();
        };

        document.addEventListener('mousemove', redimensiona);
        document.addEventListener('mouseup', finalizaRedimensionamento);

        return () => {
            document.removeEventListener('mousemove', redimensiona);
            document.removeEventListener('mouseup', finalizaRedimensionamento);
            finalizaRedimensionamento();
        };
    }, [finalizaRedimensionamento]);

    const alternaColapsado = useCallback((): void => {
        finalizaRedimensionamento();
        setColapsado(valorAtual => !valorAtual);
    }, [finalizaRedimensionamento]);

    const iniciaRedimensionamento = useCallback((): void => {
        if (colapsado) return;

        cursorOriginalBodyRef.current = document.body.style.cursor;
        selecaoOriginalBodyRef.current = document.body.style.userSelect;
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        redimensionandoRef.current = true;
        setRedimensionando(true);
    }, [colapsado]);

    return useMemo(() => ({ editorRef, estiloEditor, colapsado, redimensionando, alternaColapsado, iniciaRedimensionamento }), [estiloEditor, colapsado, redimensionando, alternaColapsado, iniciaRedimensionamento]);
};