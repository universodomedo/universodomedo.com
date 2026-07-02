import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NivelVolume = 'SILENCIOSO' | 'MINIMO' | 'BAIXO' | 'MODERADO' | 'ALTO' | 'MAXIMO';

// Seis níveis fixos mapeados para o ganho do master. SILENCIOSO = mute (0); MÍNIMO é quase imperceptível (ambiente); MÁXIMO deixa folga (0.8) reservada p/ a normalização de volumes futura.
// O mute (SILENCIOSO) só deve ser liberado em páginas de plataforma — o bloqueio por página (Partidas/EmJogo) ainda será fiado.
export const GANHO_POR_NIVEL_VOLUME: Record<NivelVolume, number> = { SILENCIOSO: 0, MINIMO: 0.05, BAIXO: 0.2, MODERADO: 0.45, ALTO: 0.7, MAXIMO: 0.8 };

// Duas camadas de música: a PÁGINA (base, definida pela rota via idMusicaPagina no ControladorSlot) e a SOBREPOSIÇÃO
// (overlay temporário, ex.: a Partida selecionada no Orbital). A música efetiva = sobreposição quando houver, senão a página.
export interface AudioPaginaState {
    idMusicaPagina: number | null;
    tituloPagina: string | null;
    idMusicaSobreposicao: number | null;
    tituloSobreposicao: string | null;
    nivelVolume: NivelVolume;
    // true nas páginas onde o áudio é ferramenta (Partidas/EmJogo): o mute (SILENCIOSO) fica travado no MÍNIMO.
    // Guardamos o nível BRUTO do usuário; o bloqueio é aplicado só na leitura (selectNivelVolumeEfetivo), então ao sair o mudo volta sozinho.
    silencioBloqueado: boolean;
};

const initialState: AudioPaginaState = { idMusicaPagina: null, tituloPagina: null, idMusicaSobreposicao: null, tituloSobreposicao: null, nivelVolume: 'MODERADO', silencioBloqueado: false };

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
        setSilencioBloqueado: (state, action: PayloadAction<boolean>) => { state.silencioBloqueado = action.payload; },
    },
});

export const { setMusicaPagina, setMusicaSobreposicao, setNivelVolume, setSilencioBloqueado } = audioPaginaSlice.actions;
export default audioPaginaSlice.reducer;
