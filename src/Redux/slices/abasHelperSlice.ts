import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// export interface SortConfig<T> {
//     key: keyof T | ((item: T) => any);
//     direction: 'asc' | 'desc';
// }

export interface SortConfig {
    key: string | ((item: any) => any);
    direction: 'asc' | 'desc';
}

  
  interface AbaState<T> {
    [abaId: string]: {
      filtros: { [key: string]: string[] };
      sortConfig: SortConfig | null;
    };
  }
  
const initialState: AbaState<any> = {};

export const abasSlice = createSlice({
  name: 'abas',
  initialState,
  reducers: {
    setCacheFiltros: <T>(state: AbaState<T>, action: PayloadAction<{ abaId: string; filtros: { [key: string]: string[] }; }>) => {
    // setFiltros: <T>(state: AbaState<T>, action: PayloadAction<{ abaId: string; filtros: T[]; ordenacao: SortConfig | null }>) => {
        const { abaId, filtros } = action.payload;
        state[abaId] = { filtros, sortConfig: null };
    },
    // setSortConfig: (state, action: PayloadAction<{ abaId: string; sortConfig: { key: string; direction: 'asc' | 'desc' } }>) => {
    //   const { abaId, sortConfig } = action.payload;
    //   if (!state[abaId]) state[abaId] = { filtros: {}, sortConfig: null };
    //   state[abaId].sortConfig = sortConfig;
    // },
    // resetAba: (state, action: PayloadAction<{ abaId: string }>) => {
    //   const { abaId } = action.payload;
    //   delete state[abaId];
    // },
  },
});

export const { setCacheFiltros } = abasSlice.actions;
// export const { setFiltros, setSortConfig, resetAba } = abasSlice.actions;

export default abasSlice.reducer;