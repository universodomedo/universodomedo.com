// #region Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FichaHelper } from 'Types/classes_estaticas';
import CustomApiCall from "ApiConsumer/ConsumerMiddleware.tsx";
// #endregion

const fichaHelper = FichaHelper.getInstance();

export const obterTiposDano = createAsyncThunk(
    'fichaHelper/obterTiposDano',
    async () => {
        const teste = new CustomApiCall();
        const teste2 = await teste.carregaTiposDano();
        return teste2;
    }
);

export const obterPersonagem = createAsyncThunk(
    'fichaHelper/obterPersonagem',
    async () => {
        const teste = new CustomApiCall();
        const teste2 = await teste.obterFichaPersonagem(1);
        return teste2;
    }
);

const fichaHelperSlice = createSlice({
    name: 'fichaHelper',
    initialState: fichaHelper,
    reducers: {},
    extraReducers: (builder) => { builder
        .addCase(obterTiposDano.fulfilled, (state, action) => {
            state.tiposDano = action.payload;
            return state;
        })
        .addCase(obterPersonagem.fulfilled, (state, action) => {
            state.personagem = action.payload;
            return state;
        });
    },
});

export default fichaHelperSlice.reducer;