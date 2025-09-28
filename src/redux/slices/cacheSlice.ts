import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ObjetoCache } from 'types-nora-api';
import { obtemTodosObjetosCache } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface CacheState {
    dados: ObjetoCache | null;
    carregando: boolean;
    erro: string | null;
    timestamp: number | null;
    inicializado: boolean;
}

const initialState: CacheState = {
    dados: null,
    carregando: false,
    erro: null,
    timestamp: null,
    inicializado: false,
};

export const fetchCacheCompleto = createAsyncThunk(
    'cache/fetchCompleto',
    async () => {
        const response = await obtemTodosObjetosCache();
        return response;
    }
);

const cacheSlice = createSlice({
    name: 'cache',
    initialState,
    reducers: {
        invalidarCache: (state) => {
            state.timestamp = null;
        },
        limparCache: () => initialState,
        marcarComoInicializado: (state) => {
            state.inicializado = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCacheCompleto.pending, (state) => {
                state.carregando = true;
                state.erro = null;
            })
            .addCase(fetchCacheCompleto.fulfilled, (state, action) => {
                state.carregando = false;
                state.timestamp = Date.now();
                state.dados = action.payload;
                state.inicializado = true;
            })
            .addCase(fetchCacheCompleto.rejected, (state, action) => {
                state.carregando = false;
                state.erro = action.error.message || 'Erro ao carregar cache';
                state.inicializado = true;
            });
    },
});

export const { invalidarCache, limparCache, marcarComoInicializado } = cacheSlice.actions;
export const selectCache = (state: { cache: CacheState }) => state.cache.dados;
export const selectCacheCarregando = (state: { cache: CacheState }) => state.cache.carregando;
export const selectCacheErro = (state: { cache: CacheState }) => state.cache.erro;
export const selectCacheTimestamp = (state: { cache: CacheState }) => state.cache.timestamp;
export const selectCacheInicializado = (state: { cache: CacheState }) => state.cache.inicializado;

export default cacheSlice.reducer;