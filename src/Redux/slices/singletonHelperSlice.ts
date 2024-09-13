// #region Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SingletonHelper } from 'Types/classes_estaticas';
import { RootState } from 'Redux/store';
import { MDL_Elemento, MDL_TipoDano } from "udm-types";
import { Circulo, Elemento } from "Types/classes.tsx";
// #endregion

const singletonHelper = SingletonHelper.getInstance();

singletonHelper.elementos = [ new Elemento(1, "Energia"), new Elemento(2, "Conhecimento"), new Elemento(3, "Medo"), new Elemento(4, "Morte"), new Elemento(5, "Sangue") ];
singletonHelper.circulos = [ new Circulo(1, "1º Círculo Fraco"), new Circulo(2, "1º Círculo Médio"), new Circulo(3, "1º Círculo Forte"), new Circulo(4, "2º Círculo Fraco"), new Circulo(5, "2º Círculo Médio"), new Circulo(6, "2º Círculo Forte"), new Circulo(7, "3º Círculo Fraco"), new Circulo(8, "3º Círculo Médio"), new Circulo(9, "3º Círculo Forte"),  ]

const singletonHelperSlice = createSlice({
    name: 'singletonHelper',
    initialState: {
        singletonHelper,
    },
    reducers: {},
});

export default singletonHelperSlice.reducer;