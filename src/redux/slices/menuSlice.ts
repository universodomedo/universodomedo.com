import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChaveMenuLayout } from 'Componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/chavesMenu';

interface MenuState {
  activeKey: ChaveMenuLayout | null;
}

const initialState: MenuState = {
  activeKey: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuKey(state, action: PayloadAction<ChaveMenuLayout | null>) {
      state.activeKey = action.payload;
    },
  },
});

export const { setMenuKey } = menuSlice.actions;
export default menuSlice.reducer;