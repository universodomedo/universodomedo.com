import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store/types';
import { PathAvatarPadrao } from 'types-nora-api';

export const selectUsuariosState = (state: RootState) => state.usuarios;
export const selectUsuarios = createSelector(selectUsuariosState, (state) => state.usuarios);

export const obtemUsuarioPorId = (id: number) => createSelector(selectUsuarios, (usuarios) => usuarios.find((u) => u.id === id));
export const obtemAvatarDeUsuarioPorId = (id: number) => createSelector(obtemUsuarioPorId(id), (usuario) => usuario?.caminhoArquivoAvatar ?? PathAvatarPadrao);