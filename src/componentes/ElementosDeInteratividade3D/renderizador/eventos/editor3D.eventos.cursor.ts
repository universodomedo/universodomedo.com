import type { ControleEventosEditor3D } from './editor3D.eventos.types';

export interface PontoCanvasEditor3D {
    readonly x: number;
    readonly y: number;
};

export function obtemDimensoesLogicasCanvasEditor3D(canvas: HTMLCanvasElement): { readonly largura: number; readonly altura: number } { return { largura: Math.max(1, canvas.clientWidth), altura: Math.max(1, canvas.clientHeight) }; };

function limitaValorEditor3D(valor: number, minimo: number, maximo: number): number { return Math.min(maximo, Math.max(minimo, valor)); };

function obtemEscalaVisualCanvasEditor3D(canvas: HTMLCanvasElement): { readonly escalaX: number; readonly escalaY: number } {
    const areaVisual = canvas.getBoundingClientRect();
    const dimensoes = obtemDimensoesLogicasCanvasEditor3D(canvas);

    return { escalaX: dimensoes.largura / Math.max(1, areaVisual.width), escalaY: dimensoes.altura / Math.max(1, areaVisual.height) };
};

export function criaPontoCanvasEditor3D(canvas: HTMLCanvasElement, event: MouseEvent): PontoCanvasEditor3D {
    const areaVisual = canvas.getBoundingClientRect();
    const escalas = obtemEscalaVisualCanvasEditor3D(canvas);

    return { x: (event.clientX - areaVisual.left) * escalas.escalaX, y: (event.clientY - areaVisual.top) * escalas.escalaY };
};

export function ativaCursorVirtualPorEventoEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): void {
    const ponto = criaPontoCanvasEditor3D(controle.canvas, event);

    controle.refs.acoes.current.atualizaCursorVirtual(ponto.x, ponto.y, true);
};

export function ativaCursorVirtualCentroEditor3D(controle: ControleEventosEditor3D): void {
    const dimensoes = obtemDimensoesLogicasCanvasEditor3D(controle.canvas);

    controle.refs.acoes.current.atualizaCursorVirtual(dimensoes.largura / 2, dimensoes.altura / 2, true);
};

export function atualizaCursorVirtualPorMovimentoEditor3D(controle: ControleEventosEditor3D, event: MouseEvent): void {
    const cursor = controle.refs.estado.current.cursorVirtual;

    if (!cursor.ativo) return;

    const dimensoes = obtemDimensoesLogicasCanvasEditor3D(controle.canvas);
    const escalas = obtemEscalaVisualCanvasEditor3D(controle.canvas);
    const x = limitaValorEditor3D(cursor.x + (event.movementX * escalas.escalaX), 0, dimensoes.largura);
    const y = limitaValorEditor3D(cursor.y + (event.movementY * escalas.escalaY), 0, dimensoes.altura);

    controle.refs.acoes.current.atualizaCursorVirtual(x, y, true);
};

export function desativaCursorVirtualEditor3D(controle: ControleEventosEditor3D): void { controle.refs.acoes.current.desativaCursorVirtual(); };

export function ocultaCursorFantasmaEditor3D(controle: ControleEventosEditor3D): void { desativaCursorVirtualEditor3D(controle); };