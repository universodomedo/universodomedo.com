import type { RootState } from 'Redux/store/types';

function clampPercent(valor: number) { return Math.max(0, Math.min(100, valor)); }

export function selectLayoutTitulo(state: RootState) { return state.layoutContextualizado.titulo; };
export function selectLayoutSubtitulo(state: RootState) { return state.layoutContextualizado.subtitulo; };
export function selectLayoutEscondeFundo(state: RootState) { return state.layoutContextualizado.escondeFundo ?? false; };
export function selectLayoutProporcaoConteudo(state: RootState) { return state.layoutContextualizado.proporcaoConteudo; };
export function selectLayoutFecharProps(state: RootState) { return state.layoutContextualizado.fecharProps ?? undefined; };
export const selectLayoutEsconderMenu = (state: RootState) => state.layoutContextualizado.esconderMenu;

export function selectLayoutProporcoes(state: RootState) {
    const raw = state.layoutContextualizado.proporcaoConteudo;
    const proporcaoConteudo = clampPercent(raw ?? 100);
    const proporcaoMenu = clampPercent(100 - proporcaoConteudo);
    return { proporcaoConteudo, proporcaoMenu };
}

export function selectMenuLayoutTipo(state: RootState) { return state.layoutContextualizado.menuTipo; }
export function selectMenuLayoutItens(state: RootState) { return state.layoutContextualizado.menuItens; }