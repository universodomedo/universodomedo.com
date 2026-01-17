'use client';

import { useEffect } from 'react';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import { patchLayoutContextualizado, updateLayoutContextualizado, type LayoutContextualizadoInterno, type LayoutContextualizadoModo } from 'Redux/slices/layoutContextualizadoSlice';

type PatchPayload = Partial<LayoutContextualizadoInterno>;

export function useConfigurarLayoutContextualizado(config: LayoutContextualizadoInterno, modo: 'update'): void;
export function useConfigurarLayoutContextualizado(config: PatchPayload, modo?: 'patch'): void;
export function useConfigurarLayoutContextualizado(config: LayoutContextualizadoInterno | PatchPayload, modo: LayoutContextualizadoModo = 'patch'): void {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (modo === 'update') dispatch(updateLayoutContextualizado(config as LayoutContextualizadoInterno));
        else dispatch(patchLayoutContextualizado(config as LayoutContextualizadoInterno));
    }, [dispatch, modo, config]);
};