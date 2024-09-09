// #region Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FichaHelper } from 'Types/classes_estaticas';
import CustomApiCall from "ApiConsumer/ConsumerMiddleware.tsx";
import { RootState } from 'Redux/store';
import { Personagem } from "Types/classes.tsx"
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

export const carregaDemo = createAsyncThunk(
    'fichaHelper/carregaDemo',
    async () => {
        return new Personagem();
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
        .addCase(carregaDemo.fulfilled, (state, action) => {
            state.fichaHelper.personagem = action.payload;
            state.personagemCarregado = true;
            return state;
        });
    },
});

export const selectPersonagemCarregado = (state: RootState) => state.fichaHelper.personagemCarregado;
export default fichaHelperSlice.reducer;