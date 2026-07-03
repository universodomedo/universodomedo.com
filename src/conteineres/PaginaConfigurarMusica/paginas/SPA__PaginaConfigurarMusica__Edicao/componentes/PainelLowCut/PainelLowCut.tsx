'use client';

import styles from './styles.module.css';

import { JSX } from 'react';

const LOW_CUT_MAX_HZ = 300;

type PainelLowCutProps = {
    lowCutHz: number;
    onSetLowCutHz: (hz: number) => void;
};

export default function PainelLowCut(props: PainelLowCutProps): JSX.Element {
    const ligado = props.lowCutHz > 0;
    return (
        <div className={styles.painel}>
            <div className={styles.cabecalho}>
                <span className={styles.titulo}>Low-cut (filtro grave)</span>
                <span className={ligado ? styles.valor : styles.valorDesligado}>{ligado ? `${props.lowCutHz} Hz` : 'Desligado'}</span>
            </div>

            <input className={styles.slider} type="range" min={0} max={LOW_CUT_MAX_HZ} step={5} value={Math.min(props.lowCutHz, LOW_CUT_MAX_HZ)} onChange={evento => props.onSetLowCutHz(Number(evento.target.value))} />

            <p className={styles.dica}>Corta os graves abaixo do corte — limpa ronco/mud subsônico sem tocar no corpo musical. 0 = desligado.</p>
        </div>
    );
};
