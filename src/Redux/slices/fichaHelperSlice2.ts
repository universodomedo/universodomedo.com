// #region Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FichaHelper } from 'Types/classes_estaticas';
import CustomApiCall from "ApiConsumer/ConsumerMiddleware.tsx";
import { RootState } from 'Redux/store';
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
    initialState: {
        fichaHelper,
        personagemCarregado: false
    },
    reducers: {},
    extraReducers: (builder) => { builder
        .addCase(obterTiposDano.fulfilled, (state, action) => {
            state.fichaHelper.tiposDano = action.payload;
            return state;
        })
        .addCase(obterPersonagem.fulfilled, (state, action) => {
            state.fichaHelper.personagem = action.payload;
            state.personagemCarregado = true;
            return state;
        });
    },
});

export const selectPersonagemCarregado = (state: RootState) => state.fichaHelper.personagemCarregado;
export default fichaHelperSlice.reducer;