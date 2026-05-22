'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { useEditor3D } from '../estado/useEditor3D';
import type { Editor3DModelo } from '../estado/editor3D.estado.types';

const Editor3DContexto = createContext<Editor3DModelo | null>(null);

interface Editor3DProviderProps {
    children: ReactNode;
};

export function Editor3DProvider({ children }: Editor3DProviderProps) {
    const editor = useEditor3D();

    return (
        <Editor3DContexto.Provider value={editor}>
            {children}
        </Editor3DContexto.Provider>
    );
};

export function useEditor3DContexto(): Editor3DModelo {
    const contexto = useContext(Editor3DContexto);

    if (contexto === null) throw new Error('useEditor3DContexto deve ser usado dentro de Editor3DProvider.');

    return contexto;
};