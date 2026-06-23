import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NivelVolume = 'BAIXO' | 'MEDIO' | 'ALTO' | 'MAXIMO';

// Ambiente é obrigatório: sem 0% / mute. Quatro níveis fixos mapeados para o ganho do master.
export const GANHO_POR_NIVEL_VOLUME: Record<NivelVolume, number> = { BAIXO: 0.25, MEDIO: 0.5, ALTO: 0.75, MAXIMO: 1 };

export interface AudioPaginaState {
    idMusicaPaginaAtual: number | null;
    tituloPaginaAtual: string | null;
    nivelVolume: NivelVolume;
};

const initialState: AudioPaginaState = { idMusicaPaginaAtual: null, tituloPaginaAtual: null, nivelVolume: 'MEDIO' };

const audioPaginaSlice = createSlice({
    name: 'audioPagina',
    initialState,
    reducers: {
        setMusicaPagina: (state, action: PayloadAction<{ idMusica: number | null; tituloPagina: string | null }>) => {
            state.idMusicaPaginaAtual = action.payload.idMusica ?? null;
            state.tituloPaginaAtual = action.payload.tituloPagina ?? null;
        },
        setNivelVolume: (state, action: PayloadAction<NivelVolume>) => { state.nivelVolume = action.payload; },
    },
});

export const { setMusicaPagina, setNivelVolume } = audioPaginaSlice.actions;
export default audioPaginaSlice.reducer;
