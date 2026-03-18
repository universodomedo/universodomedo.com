'use client';

import styles from './styles.module.css';

import { ReactNode, useMemo, useState } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEye, faComment, faBookmark } from '@fortawesome/free-regular-svg-icons';

import DraggableWindow, { DraggableWindowPosition, DraggableWindowSize } from 'Componentes/ElementosDeJogo/DraggableWindow/DraggableWindow';
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
    initialPosition: DraggableWindowPosition;
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

type WindowDefinition = FreeSizeWindowDefinition | ProportionalWindowDefinition;

interface WindowState {
    isVisible: boolean;
    size: DraggableWindowSize;
    position: DraggableWindowPosition;
    isPinned: boolean;
};

type WindowsState = Record<string, WindowState>;

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

const WINDOWS_DEFINITIONS: WindowDefinition[] = [
    {
        id: 'janela1',
        icon: faEye,
        title: 'Mapa',
        color: '#1f9529',
        initialPosition: { x: 60, y: 120 },
        initialSize: { width: 700 },
        contentMode: 'fit',
        contentAspectRatio: 16 / 9,
        content: (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '1.2em' }}>
                <h1>Teste</h1>
            </div>
        ),
    },
    {
        id: 'janela2',
        icon: faComment,
        title: 'Tabela',
        color: '#d816ff',
        initialPosition: { x: 120, y: 180 },
        initialSize: { width: 480, height: 360 },
        contentMode: 'scroll',
        content: (
            <div>
                <h1>Teste</h1>
                <div style={{ height: '60em' }} />
            </div>
        ),
    },
    {
        id: 'janela3',
        icon: faBookmark,
        title: 'Painel',
        color: '#949100',
        initialPosition: { x: 180, y: 240 },
        initialSize: { width: 500, height: 380 },
        contentMode: 'fit',
        content: (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '1.2em' }}>
                <h1>Teste</h1>
            </div>
        ),
    },
];

function createInitialWindowsState(): WindowsState {
    return WINDOWS_DEFINITIONS.reduce<WindowsState>((acc, windowDefinition) => {
        acc[windowDefinition.id] = {
            isVisible: false,
            size: resolveWindowInitialSize(windowDefinition),
            position: windowDefinition.initialPosition,
            isPinned: false,
        };
        return acc;
    }, {});
};

function createInitialWindowOrder(): string[] {
    return WINDOWS_DEFINITIONS.map((windowDefinition) => windowDefinition.id);
};

export default function IconsRegionEmJogo() {
    const [windowsState, setWindowsState] = useState<WindowsState>(createInitialWindowsState);
    const [windowOrder, setWindowOrder] = useState<string[]>(createInitialWindowOrder);

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

    const items: IconsRegionItemDto[] = useMemo(() => WINDOWS_DEFINITIONS.map((windowDefinition) => ({
        id: windowDefinition.id,
        icon: windowDefinition.icon,
        title: windowDefinition.title,
        color: windowDefinition.color,
        isActive: windowsState[windowDefinition.id].isVisible,
        onClick: () => toggleWindow(windowDefinition.id),
    })), [windowsState]);

    return (
        <div className={styles.regiao_icones_narrador_em_jogo}>
            <IconsRegion items={items} />

            {WINDOWS_DEFINITIONS.map((windowDefinition) => (
                <DraggableWindow
                    key={windowDefinition.id}
                    id={windowDefinition.id}
                    title={windowDefinition.title}
                    isVisible={windowsState[windowDefinition.id].isVisible}
                    onClose={() => closeWindow(windowDefinition.id)}
                    position={windowsState[windowDefinition.id].position}
                    onMove={(position) => moveWindow(windowDefinition.id, position)}
                    isPinned={windowsState[windowDefinition.id].isPinned}
                    onPinChange={(isPinned) => pinWindow(windowDefinition.id, isPinned)}
                    headerColor={windowDefinition.color}
                    size={windowsState[windowDefinition.id].size}
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