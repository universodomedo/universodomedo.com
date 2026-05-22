'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';

import { criaEstadoArrasteCameraEditor3D, type EstadoArrasteCameraEditor3D } from '../editor/editor3D.camera';
import type { Editor3DAcoes, Editor3DState } from '../estado/editor3D.estado.types';

export interface RefsRenderizadorEditor3D {
    readonly estado: RefObject<Editor3DState>;
    readonly acoes: RefObject<Editor3DAcoes>;
    readonly arraste: RefObject<EstadoArrasteCameraEditor3D>;
};

export function useRefsRenderizadorEditor3D(estado: Editor3DState, acoes: Editor3DAcoes): RefsRenderizadorEditor3D {
    const estadoRef = useRef<Editor3DState>(estado);
    const acoesRef = useRef<Editor3DAcoes>(acoes);
    const arrasteRef = useRef<EstadoArrasteCameraEditor3D>(criaEstadoArrasteCameraEditor3D());

    useEffect(() => {
        estadoRef.current = estado;
    }, [estado]);

    useEffect(() => {
        acoesRef.current = acoes;
    }, [acoes]);

    return useMemo(() => ({ estado: estadoRef, acoes: acoesRef, arraste: arrasteRef }), []);
};