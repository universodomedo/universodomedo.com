'use client';

import styles from './MapaLogico2DSalaJogo.module.css';
import controlesStyles from './MapaLogico2DSalaJogo.controles.module.css';
import ocupantesStyles from './MapaLogico2DSalaJogo.ocupantes.module.css';

import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';

export function MapaLogico2DSalaJogo() {
    const { estadoCarregamento, erro, mapaLogicoSalaJogo, ocupantesVisuais, estiloMapa, arrastando, keyOcupanteSelecionado, selecionaOcupante, impedeInicioPanOcupante, iniciaPan, atualizaPan, finalizaPan, aproximaZoom, afastaZoom, rotacionaMapa, resetaVisualizacao } = useContextoTelaDeJogoMapaLogico();

    if (estadoCarregamento === 'carregando') {
        return (
            <div className={styles.estado_mapa_logico}>
                <strong>Carregando mapa lógico da sala</strong>
                <span>Aguardando resposta do WebSocket.</span>
            </div>
        );
    }

    if (estadoCarregamento === 'erro' || mapaLogicoSalaJogo === null || estiloMapa === undefined) {
        return (
            <div className={styles.estado_mapa_logico}>
                <strong>Mapa lógico indisponível</strong>
                <span>{erro ?? 'Payload do mapa lógico ausente ou inválido.'}</span>
            </div>
        );
    }

    return (
        <div className={styles.painel_mapa_logico}>
            <div className={controlesStyles.controles_mapa_logico}>
                <button type="button" onClick={afastaZoom} aria-label="Diminuir zoom do mapa">-</button>
                <button type="button" onClick={aproximaZoom} aria-label="Aumentar zoom do mapa">+</button>
                <button type="button" onClick={rotacionaMapa} aria-label="Rotacionar mapa">Girar</button>
                <button type="button" onClick={resetaVisualizacao} aria-label="Resetar visualização do mapa">Reset</button>
            </div>

            <div className={`${styles.area_mapa_logico} ${arrastando ? styles.area_mapa_logico_arrastando : ''}`} onPointerDown={iniciaPan} onPointerMove={atualizaPan} onPointerUp={finalizaPan} onPointerCancel={finalizaPan}>
                <div className={styles.plano_mapa_logico} style={estiloMapa}>
                    {ocupantesVisuais.map(ocupante => (
                        <button key={ocupante.keySer} type="button" className={`${ocupantesStyles.ocupante_mapa_logico} ${keyOcupanteSelecionado === ocupante.keySer ? ocupantesStyles.ocupante_mapa_logico_selecionado : ''}`} style={ocupante.estiloMarcador} title={`${ocupante.nomeExibicao} (${ocupante.posicao.x}m, ${ocupante.posicao.y}m)`} aria-pressed={keyOcupanteSelecionado === ocupante.keySer} onPointerDown={impedeInicioPanOcupante} onClick={() => selecionaOcupante(ocupante.keySer)}>
                            <strong>{ocupante.rotuloCurto}</strong>
                            <small>{ocupante.nomeExibicao}</small>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
