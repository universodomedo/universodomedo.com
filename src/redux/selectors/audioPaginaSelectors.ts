import type { RootState } from 'Redux/store/types';

// Música efetiva = a SOBREPOSIÇÃO (overlay, ex.: Partida selecionada) quando houver; senão a música da PÁGINA (base da rota).
export function selectIdMusicaPaginaAtual(state: RootState) { return state.audioPagina.idMusicaSobreposicao ?? state.audioPagina.idMusicaPagina; };

// Só a camada de SOBREPOSIÇÃO (overlay "por cima") — pra saber se uma música específica é a que está tocando por cima agora.
export function selectIdMusicaSobreposicao(state: RootState) { return state.audioPagina.idMusicaSobreposicao; };

export function selectTituloPaginaAtual(state: RootState) { return state.audioPagina.idMusicaSobreposicao !== null ? state.audioPagina.tituloSobreposicao : state.audioPagina.tituloPagina; };

export function selectNivelVolume(state: RootState) { return state.audioPagina.nivelVolume; };

export function selectSilencioBloqueado(state: RootState) { return state.audioPagina.silencioBloqueado; };

// Nível EFETIVO = o que realmente toca/exibe: em página com mute bloqueado, o SILENCIOSO do usuário vira MÍNIMO; fora dela, volta ao bruto (restaura o mudo sozinho).
export function selectNivelVolumeEfetivo(state: RootState) { return state.audioPagina.silencioBloqueado && state.audioPagina.nivelVolume === 'SILENCIOSO' ? 'MINIMO' : state.audioPagina.nivelVolume; };
