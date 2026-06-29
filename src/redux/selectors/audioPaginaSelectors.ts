import type { RootState } from 'Redux/store/types';

// Música efetiva = a SOBREPOSIÇÃO (overlay, ex.: Partida selecionada) quando houver; senão a música da PÁGINA (base da rota).
export function selectIdMusicaPaginaAtual(state: RootState) { return state.audioPagina.idMusicaSobreposicao ?? state.audioPagina.idMusicaPagina; };

export function selectTituloPaginaAtual(state: RootState) { return state.audioPagina.idMusicaSobreposicao !== null ? state.audioPagina.tituloSobreposicao : state.audioPagina.tituloPagina; };

export function selectNivelVolume(state: RootState) { return state.audioPagina.nivelVolume; };
