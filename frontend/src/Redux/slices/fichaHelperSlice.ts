// #region Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FichaHelper } from 'Types/classes_estaticas';
import CustomApiCall from "ApiConsumer/ConsumerMiddleware.tsx";
import { RootState } from 'Redux/store.ts';
import { Personagem, RLJ_Ficha2 } from "Types/classes.tsx"
import { geraFicha } from 'Utils/utils.tsx';

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
        const jsonFicha = localStorage.getItem('fichaAtual');
        const ficha: RLJ_Ficha2 = (() => {
            if (typeof jsonFicha === 'string') {
                try {
                    const parsed = JSON.parse(jsonFicha);
                    return parsed?.dados ?? {};
                } catch {
                    return {};
                }
            }

            return {};
        })();
        
        return new Personagem(geraFicha(ficha));
    }
);

export const resetaDemo = createAsyncThunk(
    'fichaHelper/resetaDemo',
    async () => {

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
        })
        .addCase(resetaDemo.fulfilled, (state, action) => {
            state.fichaHelper.resetaPersonagem();
            state.personagemCarregado = false;
            return state;
        });
    },
});

export const selectPersonagemCarregado = (state: RootState) => state.fichaHelper.personagemCarregado;
export default fichaHelperSlice.reducer;