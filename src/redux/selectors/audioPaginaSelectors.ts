import type { RootState } from 'Redux/store/types';

export function selectIdMusicaPaginaAtual(state: RootState) { return state.audioPagina.idMusicaPaginaAtual; };

export function selectTituloPaginaAtual(state: RootState) { return state.audioPagina.tituloPaginaAtual; };

export function selectNivelVolume(state: RootState) { return state.audioPagina.nivelVolume; };
