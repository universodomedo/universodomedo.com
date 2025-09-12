import { configureStore } from '@reduxjs/toolkit';
import usuariosReducer from '../slices/usuariosSlice';
import chatsReducer from '../slices/chatsSlice';
import cacheReducer from '../slices/cacheSlice';

export const store = configureStore({
    reducer: {
        usuarios: usuariosReducer,
        chats: chatsReducer,
        cache: cacheReducer,
    },
});