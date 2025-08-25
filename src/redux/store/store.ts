import { configureStore } from '@reduxjs/toolkit';
import usuariosReducer from '../slices/usuariosSlice';
import chatsReducer from '../slices/chatsSlice';

export const store = configureStore({
    reducer: {
        usuarios: usuariosReducer,
        chats: chatsReducer,
    },
});