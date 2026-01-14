import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store/types';

export const selectLayoutContextualizado = (state: RootState) => state.layoutContextualizado;

export const selectLayoutTitulo = (state: RootState) => state.layoutContextualizado.titulo ?? '';
export const selectLayoutEscondeFundo = (state: RootState) => state.layoutContextualizado.escondeFundo ?? false;
export const selectLayoutFecharProps = (state: RootState) => state.layoutContextualizado.fecharProps ?? undefined;
export const selectLayoutProporcaoConteudo = (state: RootState) => state.layoutContextualizado.proporcaoConteudo ?? 100;

export const selectLayoutProporcoes = createSelector([selectLayoutProporcaoConteudo], proporcaoConteudo => ({ proporcaoConteudo, proporcaoMenu: 100 - proporcaoConteudo }));