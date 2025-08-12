import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChaveMenuLayout } from 'Componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/chavesMenu';

interface MenuState {
  chaveMenu: ChaveMenuLayout | null;
  tituloConteudo: string | null;
};

const initialState: MenuState = {
  chaveMenu: null,
  tituloConteudo: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuKey(state, action: PayloadAction<ChaveMenuLayout | null>) {
      state.chaveMenu = action.payload;
    },
    setTituloConteudo(state, action: PayloadAction<string | null>) {
      state.tituloConteudo = action.payload;
    },
  },
});

export const { setMenuKey, setTituloConteudo } = menuSlice.actions;
export default menuSlice.reducer;