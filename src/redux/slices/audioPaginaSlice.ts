import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AudioPaginaState {
    idMusicaPaginaAtual: number | null;
};

const initialState: AudioPaginaState = { idMusicaPaginaAtual: null };

const audioPaginaSlice = createSlice({
    name: 'audioPagina',
    initialState,
    reducers: {
        setMusicaPagina: (state, action: PayloadAction<number | null>) => { state.idMusicaPaginaAtual = action.payload ?? null; },
    },
});

export const { setMusicaPagina } = audioPaginaSlice.actions;
export default audioPaginaSlice.reducer;
