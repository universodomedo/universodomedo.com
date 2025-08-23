import { configureStore } from '@reduxjs/toolkit';
import usuariosReducer from '../slices/usuariosSlice';

export const store = configureStore({
    reducer: {
        usuarios: usuariosReducer,
    },
});