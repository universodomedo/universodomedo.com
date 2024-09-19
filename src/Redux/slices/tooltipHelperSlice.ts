import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TooltipProps } from "Types/classes.tsx";

export interface TooltipState {
  id: number;
  visible: boolean;
  position: { top: number; left: number; };
  dimensoesReferencia: { width: number; height: number; }
  conteudo: TooltipProps;
}

const initialState: TooltipState[] = [];

export const registerTooltip = createAsyncThunk(
  'tooltipHelper/registerTooltip',
  async (payload: {id: number, conteudo: TooltipProps}) => {
    return payload;
  }
);

export const showTooltip = createAsyncThunk(
  'tooltipHelper/showTooltip',
  async (payload: {id: number, position: {top: number, left: number}, dimensoes: {width: number, height: number}}) => {
    return payload;
  }
);

export const hideTooltip = createAsyncThunk(
  'tooltipHelper/hideTooltip',
  async (payload: {id: number}) => {
    return payload.id;
  }
);

export const removeTooltip = createAsyncThunk(
  'tooltipHelper/removeTooltTip',
  async (payload: {id: number}) => {
    return payload.id;
  }
);

const tooltipHelperSlice = createSlice({
  name: 'tooltipHelper',
  initialState,
  reducers: {},
  extraReducers: (builder) => { builder
    .addCase(registerTooltip.fulfilled, (state, action) => {
      state.push({ id: action.payload.id, visible: false, position: { top: 0, left: 0 }, dimensoesReferencia: { width: 0, height: 0 }, conteudo: action.payload.conteudo });
      return state;
    })
    .addCase(showTooltip.fulfilled, (state, action) => {
      const tooltip = state.find((tooltip) => tooltip.id === action.payload.id);
      if (tooltip) {
        tooltip.visible = true;
        tooltip.position = action.payload.position;
        tooltip.dimensoesReferencia = action.payload.dimensoes;
      }
      return state;
    })
    .addCase(hideTooltip.fulfilled, (state, action) => {
      const tooltip = state.find((tooltip) => tooltip.id === action.payload);
      if (tooltip) {
        tooltip.visible = false;
      }
      return state;
    })
    .addCase(removeTooltip.fulfilled, (state, action) => {
      return state.filter(tooltip => tooltip.id !== action.payload);
    });
  },
});

// export const { registerTooltip, showTooltip, hideTooltip } = tooltipHelperSlice.actions;
export default tooltipHelperSlice.reducer;