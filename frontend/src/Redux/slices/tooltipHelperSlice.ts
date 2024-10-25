import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TooltipProps } from "Types/classes.tsx";

export interface TooltipState {
  visible: boolean;
  position: { top: number; left: number; };
  dimensoesReferencia: { width: number; height: number; }
  conteudo: TooltipProps;
}

const initialState: TooltipState = {
  visible: false,
  position: { top: 0, left: 0},
  dimensoesReferencia: { width: 0, height: 0},
  conteudo: {
    caixaInformacao: {cabecalho: [], corpo: []},
    iconeCustomizado: {corDeFundo: '', svg: ''},
    corTooltip: {corPrimaria: ''},
    numeroUnidades: 0,
  }
};

export const showTooltip = createAsyncThunk(
  'tooltipHelper/showTooltip',
  async (payload: {position: {top: number, left: number}, dimensoes: {width: number, height: number}, conteudo: TooltipProps}) => {
    return payload;
  }
);

export const hideTooltip = createAsyncThunk(
  'tooltipHelper/hideTooltip',
  async () => {
    return;
  }
);

const tooltipHelperSlice = createSlice({
  name: 'tooltipHelper',
  initialState,
  reducers: {},
  extraReducers: (builder) => { builder
    .addCase(showTooltip.fulfilled, (state, action) => {
      const { position, dimensoes, conteudo } = action.payload;

      state.visible = true;
      state.position = position;
      state.dimensoesReferencia = dimensoes;
      state.conteudo = conteudo;

      return state;
    })
    .addCase(hideTooltip.fulfilled, (state, action) => {
      state.visible = false;
      return state;
    })
  },
});

// export const { registerTooltip, showTooltip, hideTooltip } = tooltipHelperSlice.actions;
export default tooltipHelperSlice.reducer;