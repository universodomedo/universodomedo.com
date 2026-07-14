import type { RootState } from 'Redux/store/types';

// Música efetiva = a SOBREPOSIÇÃO (overlay, ex.: Partida selecionada) quando houver; senão a música da PÁGINA (base da rota).
// Com um PALCO na Central (camada topo), a música efetiva PAUSA (null) — as camadas seguem registradas e retomam quando o palco sai.
export function selectIdMusicaPaginaAtual(state: RootState) {
    if (state.audioPagina.palcoNaCentral !== null) return null;
    return state.audioPagina.idMusicaSobreposicao ?? state.audioPagina.idMusicaPagina;
};

// Faixa ao vivo de palco na Central (camada topo), se houver.
export function selectPalcoNaCentral(state: RootState) { return state.audioPagina.palcoNaCentral; };

// A música que RETOMARÁ quando o palco sair da Central (para a UI listar a camada pausada).
export function selectIdMusicaPausadaPeloPalco(state: RootState) {
    if (state.audioPagina.palcoNaCentral === null) return null;
    return state.audioPagina.idMusicaSobreposicao ?? state.audioPagina.idMusicaPagina;
};

// Só a camada de SOBREPOSIÇÃO (overlay "por cima") — pra saber se uma música específica é a que está tocando por cima agora.
export function selectIdMusicaSobreposicao(state: RootState) { return state.audioPagina.idMusicaSobreposicao; };

export function selectTituloPaginaAtual(state: RootState) { return state.audioPagina.idMusicaSobreposicao !== null ? state.audioPagina.tituloSobreposicao : state.audioPagina.tituloPagina; };

export function selectNivelVolume(state: RootState) { return state.audioPagina.nivelVolume; };

// Mute bloqueado = flag da página OU palco ao vivo na Central (evento não pode ficar inaudível por um mudo esquecido).
export function selectSilencioBloqueado(state: RootState) { return state.audioPagina.silencioBloqueado || state.audioPagina.palcoNaCentral !== null; };

// Nível EFETIVO = o que realmente toca/exibe: com mute bloqueado, o SILENCIOSO do usuário vira MÍNIMO; fora dele, volta ao bruto (restaura o mudo sozinho).
export function selectNivelVolumeEfetivo(state: RootState) { return selectSilencioBloqueado(state) && state.audioPagina.nivelVolume === 'SILENCIOSO' ? 'MINIMO' : state.audioPagina.nivelVolume; };
