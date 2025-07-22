import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SOCKET_UsuarioExistente } from 'types-nora-api';

export interface UsuariosState {
  usuarios: SOCKET_UsuarioExistente[];
}

const initialState: UsuariosState = {
  usuarios: [],
};

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState,
  reducers: {
    setUsuarios(state, action: PayloadAction<SOCKET_UsuarioExistente[]>) {
      state.usuarios = action.payload;
    },
  },
});

export const { setUsuarios } = usuariosSlice.actions;
export default usuariosSlice.reducer;