// #region Imports
import { Acao } from 'Types/classes/index.ts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'Redux/store.ts';
// #endregion

interface AcaoState { executadorAcao: Acao | null; }

const initialState: AcaoState = { executadorAcao: null, };

export const executadorAcaoSlice = createSlice({
  name: 'executadorHelper',
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

export const acaoEmExecucao = (state: RootState) => state.executadorAcaoHelper;
export default executadorAcaoSlice.reducer;