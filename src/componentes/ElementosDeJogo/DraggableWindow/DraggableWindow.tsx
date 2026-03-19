'use client';

import styles from './styles.module.css';

import { ReactNode, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { createPortal } from 'react-dom';

export interface DraggableWindowPosition {
    x: number;
    y: number;
};

export const initialWindowPosition: DraggableWindowPosition = { x: 630, y: 60 };
export const windowPositionOffset = 20;


export interface DraggableWindowSize {
    width: number;
    height: number;
};

type DraggableWindowContentMode = 'scroll' | 'fit';
type ResizeDirection = 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface DragOffset {
    x: number;
    y: number;
};

interface ResizeStartData {
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    direction: ResizeDirection;
};

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
};

interface Point {
    x: number;
    y: number;
};

interface DraggableWindowProps {
    id: string;
    title: string;
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
    position: DraggableWindowPosition;
    onMove: (position: DraggableWindowPosition) => void;
    isPinned: boolean;
    onPinChange: (isPinned: boolean) => void;
    headerColor: string;
    size: DraggableWindowSize;
    onResize: (size: DraggableWindowSize) => void;
    contentMode?: DraggableWindowContentMode;
    contentAspectRatio?: number;
    minWidth?: number;
    minHeight?: number;
    zIndex?: number;
    onInteract?: (windowId: string) => void;
};

const RESIZE_DIRECTIONS: ResizeDirection[] = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
};

function rectFromPositionAndSize(position: DraggableWindowPosition, size: DraggableWindowSize): Rect {
    return {
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
    };
};

function positionAndSizeFromRect(rect: Rect): { position: DraggableWindowPosition; size: DraggableWindowSize } {
    return {
        position: { x: rect.x, y: rect.y },
        size: { width: rect.width, height: rect.height },
    };
};

function clampPositionToViewport(position: DraggableWindowPosition, size: DraggableWindowSize): DraggableWindowPosition {
    const maxX = Math.max(0, window.innerWidth - size.width);
    const maxY = Math.max(0, window.innerHeight - size.height);

    return {
        x: clamp(position.x, 0, maxX),
        y: clamp(position.y, 0, maxY),
    };
};

function clampFreeSizeToViewport(size: DraggableWindowSize, position: DraggableWindowPosition, minWidth: number, minHeight: number): DraggableWindowSize {
    const maxWidth = Math.max(minWidth, window.innerWidth - position.x);
    const maxHeight = Math.max(minHeight, window.innerHeight - position.y);

    return {
        width: clamp(size.width, minWidth, maxWidth),
        height: clamp(size.height, minHeight, maxHeight),
    };
};

function resolveAspectRatioHeightFromWidth(width: number, aspectRatio: number): number {
    return width / aspectRatio;
};

function resolveAspectRatioWidthFromHeight(height: number, aspectRatio: number): number {
    return height * aspectRatio;
};

function clampAspectRatioSizeToViewport(size: DraggableWindowSize, position: DraggableWindowPosition, aspectRatio: number, minWidth: number, minHeight: number): DraggableWindowSize {
    let nextWidth = Math.max(minWidth, size.width);
    let nextHeight = resolveAspectRatioHeightFromWidth(nextWidth, aspectRatio);

    if (nextHeight < minHeight) {
        nextHeight = minHeight;
        nextWidth = resolveAspectRatioWidthFromHeight(nextHeight, aspectRatio);
    };

    const maxWidthFromViewport = Math.max(minWidth, window.innerWidth - position.x);
    const maxHeightFromViewport = Math.max(minHeight, window.innerHeight - position.y);

    if (nextWidth > maxWidthFromViewport) {
        nextWidth = maxWidthFromViewport;
        nextHeight = resolveAspectRatioHeightFromWidth(nextWidth, aspectRatio);
    };

    if (nextHeight > maxHeightFromViewport) {
        nextHeight = maxHeightFromViewport;
        nextWidth = resolveAspectRatioWidthFromHeight(nextHeight, aspectRatio);
    };

    if (nextHeight < minHeight) {
        nextHeight = minHeight;
        nextWidth = resolveAspectRatioWidthFromHeight(nextHeight, aspectRatio);
    };

    if (nextWidth < minWidth) {
        nextWidth = minWidth;
        nextHeight = resolveAspectRatioHeightFromWidth(nextWidth, aspectRatio);
    };

    return {
        width: nextWidth,
        height: nextHeight,
    };
};

function resolveFreeResizeRect(startData: ResizeStartData, pointerX: number, pointerY: number, minWidth: number, minHeight: number): Rect {
    const startLeft = startData.startX;
    const startTop = startData.startY;
    const startRight = startData.startX + startData.startWidth;
    const startBottom = startData.startY + startData.startHeight;

    let left = startLeft;
    let right = startRight;
    let top = startTop;
    let bottom = startBottom;

    if (startData.direction === 'left' || startData.direction === 'top-left' || startData.direction === 'bottom-left') left = clamp(pointerX, 0, startRight - minWidth);
    if (startData.direction === 'right' || startData.direction === 'top-right' || startData.direction === 'bottom-right') right = clamp(pointerX, startLeft + minWidth, window.innerWidth);
    if (startData.direction === 'top' || startData.direction === 'top-left' || startData.direction === 'top-right') top = clamp(pointerY, 0, startBottom - minHeight);
    if (startData.direction === 'bottom' || startData.direction === 'bottom-left' || startData.direction === 'bottom-right') bottom = clamp(pointerY, startTop + minHeight, window.innerHeight);

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
    };
};

function resolveAnchorPoint(rect: Rect, direction: ResizeDirection): Point {
    const left = rect.x;
    const right = rect.x + rect.width;
    const top = rect.y;
    const bottom = rect.y + rect.height;
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;

    if (direction === 'left') return { x: right, y: centerY };
    if (direction === 'right') return { x: left, y: centerY };
    if (direction === 'top') return { x: centerX, y: bottom };
    if (direction === 'bottom') return { x: centerX, y: top };
    if (direction === 'top-left') return { x: right, y: bottom };
    if (direction === 'top-right') return { x: left, y: bottom };
    if (direction === 'bottom-left') return { x: right, y: top };
    return { x: left, y: top };
};

function resolveMaxAspectRatioSizeFromAnchor(anchor: Point, direction: ResizeDirection, aspectRatio: number): DraggableWindowSize {
    let maxWidth = 0;
    let maxHeight = 0;

    if (direction === 'left' || direction === 'right') {
        maxWidth = direction === 'left' ? anchor.x : window.innerWidth - anchor.x;
        maxHeight = 2 * Math.min(anchor.y, window.innerHeight - anchor.y);
    } else if (direction === 'top' || direction === 'bottom') {
        maxHeight = direction === 'top' ? anchor.y : window.innerHeight - anchor.y;
        maxWidth = 2 * Math.min(anchor.x, window.innerWidth - anchor.x);
    } else if (direction === 'top-left') {
        maxWidth = anchor.x;
        maxHeight = anchor.y;
    } else if (direction === 'top-right') {
        maxWidth = window.innerWidth - anchor.x;
        maxHeight = anchor.y;
    } else if (direction === 'bottom-left') {
        maxWidth = anchor.x;
        maxHeight = window.innerHeight - anchor.y;
    } else {
        maxWidth = window.innerWidth - anchor.x;
        maxHeight = window.innerHeight - anchor.y;
    };

    const widthLimitedByHeight = maxHeight * aspectRatio;
    const finalWidth = Math.min(maxWidth, widthLimitedByHeight);
    const finalHeight = resolveAspectRatioHeightFromWidth(finalWidth, aspectRatio);

    return {
        width: finalWidth,
        height: finalHeight,
    };
};

function resolveRectFromAnchor(anchor: Point, direction: ResizeDirection, width: number, height: number): Rect {
    if (direction === 'left') return { x: anchor.x - width, y: anchor.y - height / 2, width, height };
    if (direction === 'right') return { x: anchor.x, y: anchor.y - height / 2, width, height };
    if (direction === 'top') return { x: anchor.x - width / 2, y: anchor.y - height, width, height };
    if (direction === 'bottom') return { x: anchor.x - width / 2, y: anchor.y, width, height };
    if (direction === 'top-left') return { x: anchor.x - width, y: anchor.y - height, width, height };
    if (direction === 'top-right') return { x: anchor.x, y: anchor.y - height, width, height };
    if (direction === 'bottom-left') return { x: anchor.x - width, y: anchor.y, width, height };
    return { x: anchor.x, y: anchor.y, width, height };
};

function resolveAspectRatioResizeRect(startRect: Rect, direction: ResizeDirection, pointerX: number, pointerY: number, aspectRatio: number, minWidth: number, minHeight: number): Rect {
    const anchor = resolveAnchorPoint(startRect, direction);

    const widthFromMinHeight = resolveAspectRatioWidthFromHeight(minHeight, aspectRatio);
    const effectiveMinWidth = Math.max(minWidth, widthFromMinHeight);

    let desiredWidth = effectiveMinWidth;

    if (direction === 'left' || direction === 'right') {
        desiredWidth = Math.abs(pointerX - anchor.x);
    } else if (direction === 'top' || direction === 'bottom') {
        desiredWidth = resolveAspectRatioWidthFromHeight(Math.abs(pointerY - anchor.y), aspectRatio);
    } else {
        const widthFromPointerX = Math.abs(pointerX - anchor.x);
        const widthFromPointerY = resolveAspectRatioWidthFromHeight(Math.abs(pointerY - anchor.y), aspectRatio);
        desiredWidth = Math.max(widthFromPointerX, widthFromPointerY);
    };

    const maxSize = resolveMaxAspectRatioSizeFromAnchor(anchor, direction, aspectRatio);
    const finalWidth = clamp(desiredWidth, Math.min(effectiveMinWidth, maxSize.width), maxSize.width);
    const finalHeight = resolveAspectRatioHeightFromWidth(finalWidth, aspectRatio);

    return resolveRectFromAnchor(anchor, direction, finalWidth, finalHeight);
};

function renderResizeHandle(direction: ResizeDirection, disabled: boolean, onPointerDown: (event: React.PointerEvent<HTMLButtonElement>, direction: ResizeDirection) => void) {
    return (
        <button
            key={direction}
            type='button'
            disabled={disabled}
            className={cn(styles.resizeHandle, styles[`resizeHandle__${direction}`], disabled && styles.resizeHandle__disabled)}
            aria-label={`Redimensionar janela (${direction})`}
            onPointerDown={(event) => onPointerDown(event, direction)}
        />
    );
};

export default function DraggableWindow({ id, title, isVisible, onClose, children, position, onMove, isPinned, onPinChange, headerColor, size, onResize, contentMode = 'scroll', contentAspectRatio, minWidth = 320, minHeight = 220, zIndex = 1000, onInteract }: DraggableWindowProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const dragOffsetRef = useRef<DragOffset>({ x: 0, y: 0 });
    const resizeStartDataRef = useRef<ResizeStartData>({ startMouseX: 0, startMouseY: 0, startX: 0, startY: 0, startWidth: 0, startHeight: 0, direction: 'bottom-right' });
    const isDraggingRef = useRef(false);
    const isResizingRef = useRef(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        function handleWindowPointerMove(event: PointerEvent) {
            if (isDraggingRef.current && !isPinned) {
                const nextPosition = clampPositionToViewport({
                    x: event.clientX - dragOffsetRef.current.x,
                    y: event.clientY - dragOffsetRef.current.y,
                }, size);

                onMove(nextPosition);
                return;
            };

            if (isResizingRef.current && !isPinned) {
                const startRect = rectFromPositionAndSize(
                    { x: resizeStartDataRef.current.startX, y: resizeStartDataRef.current.startY },
                    { width: resizeStartDataRef.current.startWidth, height: resizeStartDataRef.current.startHeight },
                );

                const nextRect = contentAspectRatio !== undefined
                    ? resolveAspectRatioResizeRect(startRect, resizeStartDataRef.current.direction, event.clientX, event.clientY, contentAspectRatio, minWidth, minHeight)
                    : resolveFreeResizeRect(resizeStartDataRef.current, event.clientX, event.clientY, minWidth, minHeight);

                const nextValues = positionAndSizeFromRect(nextRect);

                onMove(nextValues.position);
                onResize(nextValues.size);
            };
        };

        function handleWindowPointerUp() {
            isDraggingRef.current = false;
            isResizingRef.current = false;
            setIsDragging(false);
            setIsResizing(false);
        };

        window.addEventListener('pointermove', handleWindowPointerMove);
        window.addEventListener('pointerup', handleWindowPointerUp);

        return () => {
            window.removeEventListener('pointermove', handleWindowPointerMove);
            window.removeEventListener('pointerup', handleWindowPointerUp);
        };
    }, [contentAspectRatio, isPinned, minHeight, minWidth, onMove, onResize, size]);

    useEffect(() => {
        function handleWindowResize() {
            const nextPosition = clampPositionToViewport(position, size);
            onMove(nextPosition);

            if (contentAspectRatio !== undefined) {
                onResize(clampAspectRatioSizeToViewport(size, nextPosition, contentAspectRatio, minWidth, minHeight));
                return;
            };

            onResize(clampFreeSizeToViewport(size, nextPosition, minWidth, minHeight));
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [contentAspectRatio, minHeight, minWidth, onMove, onResize, position, size]);

    function handlePointerDownWindow() {
        onInteract?.(id);
    };

    function handlePointerDownHeader(event: React.PointerEvent<HTMLDivElement>) {
        event.preventDefault();

        if (isPinned || isResizingRef.current) return;

        dragOffsetRef.current = {
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        };

        isDraggingRef.current = true;
        setIsDragging(true);
    };

    function handlePointerDownResize(event: React.PointerEvent<HTMLButtonElement>, direction: ResizeDirection) {
        event.preventDefault();
        event.stopPropagation();

        if (isPinned) return;

        isDraggingRef.current = false;
        setIsDragging(false);
        isResizingRef.current = true;
        setIsResizing(true);

        resizeStartDataRef.current = {
            startMouseX: event.clientX,
            startMouseY: event.clientY,
            startX: position.x,
            startY: position.y,
            startWidth: size.width,
            startHeight: size.height,
            direction,
        };
    };

    function handleHeaderDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        isDraggingRef.current = false;
        isResizingRef.current = false;
        setIsDragging(false);
        setIsResizing(false);
        onPinChange(!isPinned);
    };

    function handleClosePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();
    };

    function handleCloseClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
    };

    if (!isMounted) return null;

    return createPortal(
        <div className={cn(styles.windowFrame, !isVisible && styles.windowFrame__hidden)} style={{ left: `${position.x}px`, top: `${position.y}px`, width: `${size.width}px`, height: `${size.height}px`, zIndex }} onPointerDown={handlePointerDownWindow}>
            <div className={cn(styles.window, isPinned && styles.window__pinned, isResizing && styles.window__resizing)}>
                <div
                    className={cn(styles.header, isPinned && styles.header__pinned, !isPinned && styles.header__draggable, isDragging && styles.header__dragging)}
                    style={{ backgroundColor: headerColor }}
                    onPointerDown={handlePointerDownHeader}
                    onDoubleClick={handleHeaderDoubleClick}
                >
                    <span className={styles.title}>{title}</span>

                    <button type='button' className={styles.closeButton} onPointerDown={handleClosePointerDown} onClick={handleCloseClick}>
                        ×
                    </button>
                </div>

                <div className={cn(styles.content, contentMode === 'scroll' && styles.content__scroll, contentMode === 'fit' && styles.content__fit)}>
                    {contentMode === 'fit' && contentAspectRatio !== undefined ? (
                        <div className={styles.content__fit__center}>
                            <div className={styles.content__fit__aspectRatio} style={{ aspectRatio: String(contentAspectRatio) }}>
                                {children}
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>

            {RESIZE_DIRECTIONS.map((direction) => renderResizeHandle(direction, isPinned, handlePointerDownResize))}
        </div>,
        document.body,
    );
};