import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NivelVolume = 'BAIXO' | 'MEDIO' | 'ALTO' | 'MAXIMO';

// Ambiente é obrigatório: sem 0% / mute. Quatro níveis fixos mapeados para o ganho do master.
export const GANHO_POR_NIVEL_VOLUME: Record<NivelVolume, number> = { BAIXO: 0.25, MEDIO: 0.5, ALTO: 0.75, MAXIMO: 1 };

// Duas camadas de música: a PÁGINA (base, definida pela rota via idMusicaPagina no ControladorSlot) e a SOBREPOSIÇÃO
// (overlay temporário, ex.: a Partida selecionada no Orbital). A música efetiva = sobreposição quando houver, senão a página.
export interface AudioPaginaState {
    idMusicaPagina: number | null;
    tituloPagina: string | null;
    idMusicaSobreposicao: number | null;
    tituloSobreposicao: string | null;
    nivelVolume: NivelVolume;
};

const initialState: AudioPaginaState = { idMusicaPagina: null, tituloPagina: null, idMusicaSobreposicao: null, tituloSobreposicao: null, nivelVolume: 'MEDIO' };

const audioPaginaSlice = createSlice({
    name: 'audioPagina',
    initialState,
    reducers: {
        setMusicaPagina: (state, action: PayloadAction<{ idMusica: number | null; tituloPagina: string | null }>) => {
            state.idMusicaPagina = action.payload.idMusica ?? null;
            state.tituloPagina = action.payload.tituloPagina ?? null;
        },
        setMusicaSobreposicao: (state, action: PayloadAction<{ idMusica: number | null; tituloPagina: string | null }>) => {
            state.idMusicaSobreposicao = action.payload.idMusica ?? null;
            state.tituloSobreposicao = action.payload.tituloPagina ?? null;
        },
        setNivelVolume: (state, action: PayloadAction<NivelVolume>) => { state.nivelVolume = action.payload; },
    },
});

export const { setMusicaPagina, setMusicaSobreposicao, setNivelVolume } = audioPaginaSlice.actions;
export default audioPaginaSlice.reducer;
