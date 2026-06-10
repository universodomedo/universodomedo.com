'use client';

import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { AreaPercentual } from 'types-nora-api';

import { pxParaPercentual } from './geometriaTutorial';

type TamanhoCanvas = { largura: number; altura: number };
type AplicaAreaTutorial = (idPasso: number, idBloco: number, area: AreaPercentual, comSnap: boolean) => void;
type AncoraDrag = { idPasso: number; idBloco: number; area: AreaPercentual; pontoX: number; pontoY: number; canvas: TamanhoCanvas };

// Etapa 8: pointer drag de Bloco. Âncora em ref + listeners estáveis em window; cada move parte da âncora e aplica via update funcional (snap+clamp+colisão).
export function useDragBlocoTutorial(medeCanvas: () => TamanhoCanvas, aplicaArea: AplicaAreaTutorial) {
    const ancoraRef = useRef<AncoraDrag | null>(null);
    const medeCanvasRef = useRef(medeCanvas);
    const aplicaAreaRef = useRef(aplicaArea);
    medeCanvasRef.current = medeCanvas;
    aplicaAreaRef.current = aplicaArea;

    useEffect(() => {
        function aoMover(evento: PointerEvent): void {
            const ancora = ancoraRef.current;
            if (!ancora) return;
            const dx = pxParaPercentual(evento.clientX - ancora.pontoX, ancora.canvas.largura);
            const dy = pxParaPercentual(evento.clientY - ancora.pontoY, ancora.canvas.altura);
            aplicaAreaRef.current(ancora.idPasso, ancora.idBloco, { ...ancora.area, x: ancora.area.x + dx, y: ancora.area.y + dy }, true);
        };
        function aoSoltar(): void { ancoraRef.current = null; };
        window.addEventListener('pointermove', aoMover);
        window.addEventListener('pointerup', aoSoltar);
        return () => { window.removeEventListener('pointermove', aoMover); window.removeEventListener('pointerup', aoSoltar); };
    }, []);

    function iniciaDrag(evento: ReactPointerEvent, idPasso: number, idBloco: number, area: AreaPercentual): void {
        evento.preventDefault();
        ancoraRef.current = { idPasso, idBloco, area, pontoX: evento.clientX, pontoY: evento.clientY, canvas: medeCanvasRef.current() };
    };

    return { iniciaDrag };
};
