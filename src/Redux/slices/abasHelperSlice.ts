// #region Imports
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// #endregion

interface OpcoesSelecionadas { idFiltro: number, idOpcao: string[] }

const initialState: { [key: string]: {opcoesSelecionadas: OpcoesSelecionadas[], updateExterno: boolean} } = {};

export const abasSlice = createSlice({
  name: 'abas',
  initialState,
  reducers: {
    setCacheFiltros: (state, action: PayloadAction<{ abaId:string, filtro: OpcoesSelecionadas[], updateExterno?: boolean }>) => {
      state[action.payload.abaId] = {
        opcoesSelecionadas: action.payload.filtro,
        updateExterno: action.payload.updateExterno ?? false
      }
    },
    setUpdated: (state, action: PayloadAction<{ abaId:string }>) => {
      state[action.payload.abaId].updateExterno = false;
    }
  },
});

export const { setCacheFiltros, setUpdated } = abasSlice.actions;

export default abasSlice.reducer;