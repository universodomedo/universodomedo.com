import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
import type { LayoutContextualizadoInicial, MenuLayoutLeaf, MenuNode } from 'types-nora-api';
import type { LayoutContextualizadoFecharProps } from 'Componentes/Elementos/FerramentaRetornoPagina/FerramentaRetornoPagina';

export type LayoutContextualizadoModo = 'patch' | 'update';

export type LayoutContextualizadoInterno = LayoutContextualizadoInicial & {
    readonly fecharProps?: LayoutContextualizadoFecharProps | undefined;
};

export type MenuLayoutContextualizadoTipo = 'static' | 'vazio' | 'dinamico';

export interface LayoutContextualizadoState {
    titulo: string | null;
    escondeFundo: boolean | null;
    proporcaoConteudo: number | null;
    fecharProps: LayoutContextualizadoFecharProps | null;
    esconderMenu: boolean | null;
    menuTipo: MenuLayoutContextualizadoTipo;
    menuItens: MenuNode[];
};

const initialState: LayoutContextualizadoState = { titulo: null, escondeFundo: null, proporcaoConteudo: null, fecharProps: null, esconderMenu: null, menuTipo: 'vazio', menuItens: [] };

function clampPercent(valor: number) { return Math.max(0, Math.min(100, valor)); }

function isArrayMenuLeaf(leaf: MenuLayoutLeaf): leaf is readonly MenuNode[] { return Array.isArray(leaf); }

const layoutContextualizadoSlice = createSlice({
    name: 'layoutContextualizado',
    initialState,
    reducers: {
        patchLayoutContextualizado: (state, action: PayloadAction<LayoutContextualizadoInterno>) => {
            const patch = action.payload;

            if (Object.prototype.hasOwnProperty.call(patch, 'titulo')) state.titulo = patch.titulo ?? null;
            if (Object.prototype.hasOwnProperty.call(patch, 'escondeFundo')) state.escondeFundo = patch.escondeFundo ?? null;
            if (Object.prototype.hasOwnProperty.call(patch, 'proporcaoConteudo')) state.proporcaoConteudo = patch.proporcaoConteudo !== undefined ? clampPercent(patch.proporcaoConteudo) : null;
            if (Object.prototype.hasOwnProperty.call(patch, 'fecharProps')) state.fecharProps = patch.fecharProps != null ? castDraft(patch.fecharProps) : null;
            if (Object.prototype.hasOwnProperty.call(patch, 'esconderMenu')) state.esconderMenu = patch.esconderMenu ?? null;
        },

        updateLayoutContextualizado: (state, action: PayloadAction<LayoutContextualizadoInterno>) => {
            const update = action.payload;

            state.titulo = update.titulo ?? null;
            state.escondeFundo = update.escondeFundo ?? null;
            state.proporcaoConteudo = update.proporcaoConteudo !== undefined ? clampPercent(update.proporcaoConteudo) : null;
            state.fecharProps = update.fecharProps != null ? castDraft(update.fecharProps) : null;
            state.esconderMenu = update.esconderMenu ?? null;
        },

        setMenuLeaf: (state, action: PayloadAction<MenuLayoutLeaf>) => {
            const leaf = action.payload;

            if (isArrayMenuLeaf(leaf)) {
                state.menuTipo = 'static';
                state.menuItens = castDraft(leaf.slice());
                return;
            }

            if (leaf.tipo === 'vazio') {
                state.menuTipo = 'vazio';
                state.menuItens = [];
                return;
            }

            state.menuTipo = 'dinamico';
            state.menuItens = [];
        },

        setMenuVazio: (state) => {
            state.menuTipo = 'vazio';
            state.menuItens = [];
        },

        setMenuDinamico: (state) => {
            state.menuTipo = 'dinamico';
            state.menuItens = [];
        },

        setMenuItensDinamicos: (state, action: PayloadAction<readonly MenuNode[]>) => {
            state.menuTipo = 'dinamico';
            state.menuItens = castDraft(action.payload.slice());
        },
    },
});

export const { patchLayoutContextualizado, updateLayoutContextualizado, setMenuLeaf, setMenuVazio, setMenuDinamico, setMenuItensDinamicos } = layoutContextualizadoSlice.actions;
export default layoutContextualizadoSlice.reducer;