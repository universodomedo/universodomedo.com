'use client';

import styles from './styles.module.css';

import { ReactNode, useMemo, useState } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import DraggableWindow, { DraggableWindowPosition, DraggableWindowSize, initialWindowPosition } from 'Componentes/ElementosDeJogo/DraggableWindow/DraggableWindow';
import IconsRegion, { IconsRegionItemDto } from 'componentes/ElementosDeJogo/IconsRegion/IconsRegion/IconsRegion';

type WindowContentMode = 'scroll' | 'fit';

interface ProportionalInitialSizeByWidth {
    width: number;
    height?: never;
};

interface ProportionalInitialSizeByHeight {
    width?: never;
    height: number;
};

type ProportionalInitialSize = ProportionalInitialSizeByWidth | ProportionalInitialSizeByHeight;

interface BaseWindowDefinition {
    id: string;
    icon: IconDefinition;
    title: string;
    color: string;
    content: ReactNode;
    contentMode: WindowContentMode;
};

interface FreeSizeWindowDefinition extends BaseWindowDefinition {
    contentAspectRatio?: undefined;
    initialSize: DraggableWindowSize;
};

interface ProportionalWindowDefinition extends BaseWindowDefinition {
    contentAspectRatio: number;
    initialSize: ProportionalInitialSize;
};

export type WindowDefinition = FreeSizeWindowDefinition | ProportionalWindowDefinition;

interface WindowState {
    isVisible: boolean;
    size: DraggableWindowSize;
    position: DraggableWindowPosition;
    isPinned: boolean;
};

type WindowsState = Record<string, WindowState>;

interface IconsRegionEmJogoProps {
    windowsDefinitions: WindowDefinition[];
};

function resolveAspectRatioHeightFromWidth(width: number, aspectRatio: number): number {
    return width / aspectRatio;
};

function resolveAspectRatioWidthFromHeight(height: number, aspectRatio: number): number {
    return height * aspectRatio;
};

function resolveProportionalInitialSize(initialSize: ProportionalInitialSize, aspectRatio: number): DraggableWindowSize {
    if (initialSize.width !== undefined) {
        return {
            width: initialSize.width,
            height: resolveAspectRatioHeightFromWidth(initialSize.width, aspectRatio),
        };
    };

    return {
        width: resolveAspectRatioWidthFromHeight(initialSize.height, aspectRatio),
        height: initialSize.height,
    };
};

function resolveWindowInitialSize(windowDefinition: WindowDefinition): DraggableWindowSize {
    if (windowDefinition.contentAspectRatio !== undefined) return resolveProportionalInitialSize(windowDefinition.initialSize, windowDefinition.contentAspectRatio);
    return windowDefinition.initialSize;
};

function createInitialWindowsState(windowsDefinitions: WindowDefinition[]): WindowsState {
    return windowsDefinitions.reduce<WindowsState>((acc, windowDefinition) => {
        acc[windowDefinition.id] = {
            isVisible: false,
            size: resolveWindowInitialSize(windowDefinition),
            position: initialWindowPosition,
            isPinned: false,
        };
        return acc;
    }, {});
};

function createInitialWindowOrder(windowsDefinitions: WindowDefinition[]): string[] {
    return windowsDefinitions.map((windowDefinition) => windowDefinition.id);
};

export default function IconsRegionEmJogo({ windowsDefinitions }: IconsRegionEmJogoProps) {
    const [windowsState, setWindowsState] = useState<WindowsState>(() => createInitialWindowsState(windowsDefinitions));
    const [windowOrder, setWindowOrder] = useState<string[]>(() => createInitialWindowOrder(windowsDefinitions));

    function bringWindowToFront(windowId: string) {
        setWindowOrder((currentState) => [...currentState.filter((currentWindowId) => currentWindowId !== windowId), windowId]);
    };

    function getWindowZIndex(windowId: string): number {
        return 1000 + windowOrder.indexOf(windowId);
    };

    function toggleWindow(windowId: string) {
        setWindowsState((currentState) => ({
            ...currentState,
            [windowId]: {
                ...currentState[windowId],
                isVisible: !currentState[windowId].isVisible,
            },
        }));

        bringWindowToFront(windowId);
    };

    function closeWindow(windowId: string) {
        setWindowsState((currentState) => ({
            ...currentState,
            [windowId]: {
                ...currentState[windowId],
                isVisible: false,
            },
        }));
    };

    function resizeWindow(windowId: string, size: DraggableWindowSize) {
        setWindowsState((currentState) => ({
            ...currentState,
            [windowId]: {
                ...currentState[windowId],
                size,
            },
        }));
    };

    function moveWindow(windowId: string, position: DraggableWindowPosition) {
        setWindowsState((currentState) => ({
            ...currentState,
            [windowId]: {
                ...currentState[windowId],
                position,
            },
        }));
    };

    function pinWindow(windowId: string, isPinned: boolean) {
        setWindowsState((currentState) => ({
            ...currentState,
            [windowId]: {
                ...currentState[windowId],
                isPinned,
            },
        }));
    };

    const items: IconsRegionItemDto[] = useMemo(() => windowsDefinitions.map((windowDefinition) => ({
        id: windowDefinition.id,
        icon: windowDefinition.icon,
        title: windowDefinition.title,
        color: windowDefinition.color,
        isActive: windowsState[windowDefinition.id]?.isVisible ?? false,
        onClick: () => toggleWindow(windowDefinition.id),
    })), [windowsDefinitions, windowsState]);

    return (
        <div className={styles.regiao_icones_narrador_em_jogo}>
            <IconsRegion items={items} />

            {windowsDefinitions.map((windowDefinition) => (
                <DraggableWindow
                    key={windowDefinition.id}
                    id={windowDefinition.id}
                    title={windowDefinition.title}
                    isVisible={windowsState[windowDefinition.id]?.isVisible ?? false}
                    onClose={() => closeWindow(windowDefinition.id)}
                    position={windowsState[windowDefinition.id]?.position ?? initialWindowPosition}
                    onMove={(position) => moveWindow(windowDefinition.id, position)}
                    isPinned={windowsState[windowDefinition.id]?.isPinned ?? false}
                    onPinChange={(isPinned) => pinWindow(windowDefinition.id, isPinned)}
                    headerColor={windowDefinition.color}
                    size={windowsState[windowDefinition.id]?.size ?? resolveWindowInitialSize(windowDefinition)}
                    onResize={(size) => resizeWindow(windowDefinition.id, size)}
                    contentMode={windowDefinition.contentMode}
                    contentAspectRatio={windowDefinition.contentAspectRatio}
                    zIndex={getWindowZIndex(windowDefinition.id)}
                    onInteract={bringWindowToFront}
                >
                    {windowDefinition.content}
                </DraggableWindow>
            ))}
        </div>
    );
};