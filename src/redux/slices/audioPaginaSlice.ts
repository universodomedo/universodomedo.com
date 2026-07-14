import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NivelVolume = 'SILENCIOSO' | 'MINIMO' | 'BAIXO' | 'MODERADO' | 'ALTO' | 'MAXIMO';

// Seis níveis fixos mapeados para o ganho do master. SILENCIOSO = mute (0); MÍNIMO é quase imperceptível (ambiente); MÁXIMO deixa folga (0.8) reservada p/ a normalização de volumes futura.
// O mute (SILENCIOSO) só deve ser liberado em páginas de plataforma — o bloqueio por página (Partidas/EmJogo) ainda será fiado.
export const GANHO_POR_NIVEL_VOLUME: Record<NivelVolume, number> = { SILENCIOSO: 0, MINIMO: 0.05, BAIXO: 0.2, MODERADO: 0.45, ALTO: 0.7, MAXIMO: 0.8 };

// Faixa ao vivo de um palco na Central: camada ACIMA das músicas (pausa a música efetiva; ela volta quando o palco sai).
// papel = o papel de áudio do usuário nesse palco (null enquanto conecta); falante mantém o mic publicando em QUALQUER página.
export interface PalcoNaCentral {
    codigoPalco: string;
    titulo: string;
    papel: 'falante' | 'ouvinte' | null;
};

// Três camadas de faixa: o PALCO AO VIVO (topo, trazido pelo usuário), a SOBREPOSIÇÃO (overlay temporário, ex.: a Partida
// selecionada no Orbital) e a PÁGINA (base da rota via idMusicaPagina no ControladorSlot). A música efetiva = sobreposição ?? página,
// e ela PAUSA enquanto houver palco na Central (as camadas de música permanecem registradas para retomar).
export interface AudioPaginaState {
    idMusicaPagina: number | null;
    tituloPagina: string | null;
    idMusicaSobreposicao: number | null;
    tituloSobreposicao: string | null;
    palcoNaCentral: PalcoNaCentral | null;
    nivelVolume: NivelVolume;
    // true nas páginas onde o áudio é ferramenta (Partidas/EmJogo): o mute (SILENCIOSO) fica travado no MÍNIMO.
    // Guardamos o nível BRUTO do usuário; o bloqueio é aplicado só na leitura (selectNivelVolumeEfetivo), então ao sair o mudo volta sozinho.
    silencioBloqueado: boolean;
};

const initialState: AudioPaginaState = { idMusicaPagina: null, tituloPagina: null, idMusicaSobreposicao: null, tituloSobreposicao: null, palcoNaCentral: null, nivelVolume: 'MODERADO', silencioBloqueado: false };

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
        setPalcoNaCentral: (state, action: PayloadAction<PalcoNaCentral>) => { state.palcoNaCentral = action.payload; },
        atualizarPapelPalcoNaCentral: (state, action: PayloadAction<{ codigoPalco: string; papel: PalcoNaCentral['papel'] }>) => {
            if (state.palcoNaCentral?.codigoPalco === action.payload.codigoPalco) state.palcoNaCentral.papel = action.payload.papel;
        },
        limparPalcoNaCentral: (state) => { state.palcoNaCentral = null; },
        setNivelVolume: (state, action: PayloadAction<NivelVolume>) => { state.nivelVolume = action.payload; },
        setSilencioBloqueado: (state, action: PayloadAction<boolean>) => { state.silencioBloqueado = action.payload; },
    },
});

export const { setMusicaPagina, setMusicaSobreposicao, setPalcoNaCentral, atualizarPapelPalcoNaCentral, limparPalcoNaCentral, setNivelVolume, setSilencioBloqueado } = audioPaginaSlice.actions;
export default audioPaginaSlice.reducer;
