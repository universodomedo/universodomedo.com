'use client';

import styles from './SeletorNivelVolume.module.css';

import { useEffect, useState } from 'react';

import type { NivelVolume } from 'Redux/slices/audioPaginaSlice';
import { GRADIENTE_NIVEIS_VOLUME, NIVEIS_VOLUME_APRESENTACAO, ULTIMO_INDICE_NIVEL_VOLUME } from './niveisVolume';
import { useSliderNivelVolume } from './useSliderNivelVolume';

const PASSO_PERCENTUAL = 100 / ULTIMO_INDICE_NIVEL_VOLUME;

// Slider de volume: arrastável entre níveis, com snap animado (bounce) e commit só ao chegar num ponto válido. Cor segue o espectro da config.
export default function SeletorNivelVolume({ nivel, silencioBloqueado = false, onSelecionarNivel }: { nivel: NivelVolume; silencioBloqueado?: boolean; onSelecionarNivel: (nivel: NivelVolume) => void; }) {
    // com mute bloqueado o piso é o Mínimo (índice 1): o Silencioso fica travado
    const indiceMinimo = silencioBloqueado ? 1 : 0;
    const indiceProp = Math.max(indiceMinimo, NIVEIS_VOLUME_APRESENTACAO.findIndex(item => item.nivel === nivel));
    const [indice, setIndice] = useState(indiceProp);

    // mantém o índice local em sincronia quando o nível muda por fora (restauração do localStorage, futura trava por página)
    useEffect(() => { setIndice(indiceProp); }, [indiceProp]);

    const comprometer = (alvo: number) => {
        setIndice(alvo);
        const nivelAlvo = NIVEIS_VOLUME_APRESENTACAO[alvo].nivel;
        if (nivelAlvo !== nivel) onSelecionarNivel(nivelAlvo);
    };

    const { trilhoRef, arrastando, posicao, aoIniciar, aoMover, aoSoltar, aoTecla } = useSliderNivelVolume(indice, comprometer, indiceMinimo);

    const apresentacao = NIVEIS_VOLUME_APRESENTACAO[indice];
    const progresso = posicao * 100;
    // no extremo esquerdo/direito o rótulo ancora pela borda pra não vazar do componente; no meio fica centralizado sobre o ponto
    const alinhamentoRotulo = indice === 0 ? 0 : indice === ULTIMO_INDICE_NIVEL_VOLUME ? -100 : -50;

    return (
        <div className={styles.seletor}>
            <div className={styles.trilhoArea}>
                <span className={styles.icone} aria-hidden>🔇</span>
                <div className={styles.barraCol}>
                    <div className={styles.faixaRotulo}>
                        <span className={styles.valor} style={{ left: `${indice * PASSO_PERCENTUAL}%`, transform: `translateX(${alinhamentoRotulo}%)`, color: apresentacao.cor }}>{apresentacao.label}</span>
                    </div>
                    <div ref={trilhoRef} className={styles.trilho} role="slider" tabIndex={0} aria-label="Nível de volume" aria-valuemin={indiceMinimo} aria-valuemax={ULTIMO_INDICE_NIVEL_VOLUME} aria-valuenow={indice} aria-valuetext={apresentacao.label} onPointerDown={aoIniciar} onPointerMove={aoMover} onPointerUp={aoSoltar} onPointerCancel={aoSoltar} onKeyDown={aoTecla}>
                        <div className={`${styles.preenchimento} ${arrastando ? styles.semTransicao : ''}`} style={{ clipPath: `inset(0 ${100 - progresso}% 0 0 round 0.34em)`, background: GRADIENTE_NIVEIS_VOLUME }} />
                        {NIVEIS_VOLUME_APRESENTACAO.map((item, i) => (
                            <span key={item.nivel} className={`${styles.marca} ${silencioBloqueado && i < indiceMinimo ? styles.marcaBloqueada : ''}`} style={{ left: `${i * PASSO_PERCENTUAL}%` }} title={item.label} />
                        ))}
                        <span className={`${styles.polegar} ${arrastando ? styles.semTransicao : ''}`} style={{ left: `${progresso}%`, borderColor: apresentacao.cor }} />
                        {silencioBloqueado && <span className={styles.cadeado} style={{ left: `${indiceMinimo * PASSO_PERCENTUAL}%` }} aria-hidden>🔒</span>}
                    </div>
                </div>
                <span className={styles.icone} aria-hidden>🔊</span>
            </div>
        </div>
    );
};
