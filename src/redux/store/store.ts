import { configureStore } from '@reduxjs/toolkit';
import usuariosReducer from '../slices/usuariosSlice';
import menuReducer from '../slices/menuSlice';

export const store = configureStore({
    reducer: {
        usuarios: usuariosReducer,
        menu: menuReducer,
    },
});