// #region Imports
import { Acao } from 'Types/classes.tsx';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'Redux/store.ts';
// #endregion

interface AcaoState { executadorAcao: Acao | null; }

const initialState: AcaoState = { executadorAcao: null, };

export const executadorAcaoSlice = createSlice({
  name: 'abas',
  initialState,
  reducers: {
    iniciaExecucaoAcao: (state, action: PayloadAction<{ acao: Acao }>) => {
      state.executadorAcao = action.payload.acao;
    },
    limparExecucaoAcao: (state) => {
      state.executadorAcao = null;
    }
  },
});

export const { iniciaExecucaoAcao, limparExecucaoAcao } = executadorAcaoSlice.actions;

export const acaoEmExecucao = (state: RootState) => state.executadorAcao;
export default executadorAcaoSlice.reducer;