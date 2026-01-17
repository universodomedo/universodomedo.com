import { configureStore } from '@reduxjs/toolkit';
import socketReducer from '../slices/socketSlice';
import usuariosReducer from '../slices/usuariosSlice';
import chatsReducer from '../slices/chatsSlice';
import cacheReducer from '../slices/cacheSlice';
import layoutContextualizadoReducer from 'Redux/slices/layoutContextualizadoSlice';

export const store = configureStore({
    reducer: {
        socket: socketReducer,
        usuarios: usuariosReducer,
        chats: chatsReducer,
        cache: cacheReducer,
        layoutContextualizado: layoutContextualizadoReducer,
    },
});