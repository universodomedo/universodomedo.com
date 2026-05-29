'use client';

import { ArrowUpIcon, CheckIcon, ClipboardCopyIcon, Cross2Icon, CursorArrowIcon, DimensionsIcon, EnterIcon, FrameIcon, KeyboardIcon, LoopIcon, MoveIcon, PlusIcon, RotateCounterClockwiseIcon, TargetIcon, TrashIcon, ValueIcon, ZoomInIcon } from '@radix-ui/react-icons';

import type { IconeComandoAreaInterativa3D } from './editor3D.comandos';

type IconeVisualAreaInterativa3D = typeof CursorArrowIcon;

interface IconeVisualComandoAreaInterativa3DProps {
    readonly icone: IconeComandoAreaInterativa3D;
    readonly className?: string;
};

// Todo icone visual de comando nasce aqui, usando a chave tipada do SSOT de comandos.
const iconeVisualPorChaveComandoAreaInterativa3D: Record<IconeComandoAreaInterativa3D, IconeVisualAreaInterativa3D> = {
    'arrow-up': ArrowUpIcon,
    axis: TargetIcon,
    backspace: Cross2Icon,
    check: CheckIcon,
    compass: TargetIcon,
    cursor: CursorArrowIcon,
    dolly: ZoomInIcon,
    enter: EnterIcon,
    escape: Cross2Icon,
    gizmo: TargetIcon,
    keyboard: KeyboardIcon,
    move: MoveIcon,
    'mouse-pointer': CursorArrowIcon,
    number: ValueIcon,
    orbit: LoopIcon,
    plus: PlusIcon,
    rotate: RotateCounterClockwiseIcon,
    scale: DimensionsIcon,
    selection: FrameIcon,
    tab: ClipboardCopyIcon,
    trash: TrashIcon
};

export function IconeVisualComandoAreaInterativa3D({ icone, className }: IconeVisualComandoAreaInterativa3DProps) {
    const Icone = iconeVisualPorChaveComandoAreaInterativa3D[icone];

    return <Icone className={className} aria-hidden="true" />;
};
