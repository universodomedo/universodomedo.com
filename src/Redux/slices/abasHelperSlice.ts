// #region Imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// #endregion

interface OpcoesSelecionadas { idFiltro: number, idOpcao: string[] }

const initialState: { [key: string]: OpcoesSelecionadas[] } = {};

export const abasSlice = createSlice({
  name: 'abas',
  initialState,
  reducers: {
    setCacheFiltros: (state, action: PayloadAction<{ abaId:string, filtro: OpcoesSelecionadas[] }>) => {
      state[action.payload.abaId] = action.payload.filtro;
    },
  },
});

export const { setCacheFiltros } = abasSlice.actions;

export default abasSlice.reducer;