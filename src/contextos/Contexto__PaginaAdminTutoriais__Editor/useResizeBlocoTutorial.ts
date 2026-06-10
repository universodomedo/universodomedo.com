'use client';

import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { AreaPercentual } from 'types-nora-api';

import type { DirecaoResizeTutorial } from './tutorialEditor.types';
import { calculaAreaResize, pxParaPercentual } from './geometriaTutorial';

type TamanhoCanvas = { largura: number; altura: number };
type AplicaAreaTutorial = (idPasso: number, idBloco: number, area: AreaPercentual, comSnap: boolean) => void;
type AncoraResize = { idPasso: number; idBloco: number; area: AreaPercentual; direcao: DirecaoResizeTutorial; pontoX: number; pontoY: number; canvas: TamanhoCanvas };

// Etapa 8: resize de Bloco por handle (borda/canto). Mesma estratégia do drag; resize em conflito reposiciona o bloco inteiro (colisão), nunca encolhe por causa de outro.
export function useResizeBlocoTutorial(medeCanvas: () => TamanhoCanvas, aplicaArea: AplicaAreaTutorial) {
    const ancoraRef = useRef<AncoraResize | null>(null);
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
            aplicaAreaRef.current(ancora.idPasso, ancora.idBloco, calculaAreaResize(ancora.area, ancora.direcao, dx, dy), true);
        };
        function aoSoltar(): void { ancoraRef.current = null; };
        window.addEventListener('pointermove', aoMover);
        window.addEventListener('pointerup', aoSoltar);
        return () => { window.removeEventListener('pointermove', aoMover); window.removeEventListener('pointerup', aoSoltar); };
    }, []);

    function iniciaResize(evento: ReactPointerEvent, idPasso: number, idBloco: number, area: AreaPercentual, direcao: DirecaoResizeTutorial): void {
        evento.preventDefault();
        evento.stopPropagation();
        ancoraRef.current = { idPasso, idBloco, area, direcao, pontoX: evento.clientX, pontoY: evento.clientY, canvas: medeCanvasRef.current() };
    };

    return { iniciaResize };
};
