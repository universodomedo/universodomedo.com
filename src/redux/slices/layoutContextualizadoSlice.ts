import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { LayoutContextualizadoFecharProps } from 'Componentes/Elementos/FerramentaRetornoPagina/FerramentaRetornoPagina';

export type LayoutContextualizadoModo = 'patch' | 'update';

export interface LayoutContextualizadoPatch {
    titulo?: string;
    escondeFundo?: boolean;
    proporcaoConteudo?: number;
    fecharProps?: LayoutContextualizadoFecharProps | undefined;
};

export interface LayoutContextualizadoState {
    titulo: string | null;
    escondeFundo: boolean | null;
    proporcaoConteudo: number | null;
    fecharProps: LayoutContextualizadoFecharProps | null;
};

const initialState: LayoutContextualizadoState = { titulo: '', escondeFundo: false, proporcaoConteudo: 100, fecharProps: null };

function clampPercent(valor: number) { return Math.max(0, Math.min(100, valor)); }
function hasOwn(obj: LayoutContextualizadoPatch, key: keyof LayoutContextualizadoPatch) { return Object.prototype.hasOwnProperty.call(obj, key); };

const layoutContextualizadoSlice = createSlice({
    name: 'layoutContextualizado',
    initialState,
    reducers: {
        patchLayoutContextualizado: (state, action: PayloadAction<LayoutContextualizadoPatch>) => {
            const patch = action.payload;
            if (patch.titulo !== undefined) state.titulo = patch.titulo;
            if (patch.escondeFundo !== undefined) state.escondeFundo = patch.escondeFundo;
            if (patch.proporcaoConteudo !== undefined) state.proporcaoConteudo = clampPercent(patch.proporcaoConteudo);
            if (hasOwn(patch, 'fecharProps')) state.fecharProps = patch.fecharProps ?? null;
        },
        updateLayoutContextualizado: (state, action: PayloadAction<LayoutContextualizadoPatch>) => {
            const update = action.payload;
            state.titulo = update.titulo ?? null;
            state.escondeFundo = update.escondeFundo ?? null;
            state.proporcaoConteudo = update.proporcaoConteudo !== undefined ? clampPercent(update.proporcaoConteudo) : null;
            state.fecharProps = hasOwn(update, 'fecharProps') ? (update.fecharProps ?? null) : null;
        },
    },
});

export const { patchLayoutContextualizado, updateLayoutContextualizado } = layoutContextualizadoSlice.actions;
export default layoutContextualizadoSlice.reducer;