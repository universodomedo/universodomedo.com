'use client';

import styles from './styles.module.css';

import { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faPause, faPlay, faRepeat, faStop } from '@fortawesome/free-solid-svg-icons';

import { formatarMs } from '../editorMusica.uteis';
import TimecodeEditavel from '../TimecodeEditavel/TimecodeEditavel';

type BarraTransporteMixerProps = {
    tocando: boolean;
    posicaoMs: number;
    duracaoMs: number;
    fimMs: number;
    podeTocar: boolean;
    onPlayPause: () => void;
    onParar: () => void;
    onInicio: () => void;
    onTestarLoop: () => void;
    onIrPara: (ms: number) => void;
};

export default function BarraTransporteMixer(props: BarraTransporteMixerProps): JSX.Element {
    return (
        <div className={styles.barra}>
            <TimecodeEditavel posicaoMs={props.posicaoMs} duracaoMs={props.duracaoMs} onIrPara={props.onIrPara} />

            <div className={styles.controles}>
                <div className={styles.botoes}>
                    <button className={styles.botao} disabled={!props.podeTocar} onClick={props.onInicio} title="Tocar do Início">
                        <FontAwesomeIcon icon={faBackwardStep} />
                    </button>
                    <button className={`${styles.botao} ${styles.botaoPrincipal}`} disabled={!props.podeTocar} onClick={props.onPlayPause} title={props.tocando ? 'Pausar' : 'Tocar'}>
                        <FontAwesomeIcon icon={props.tocando ? faPause : faPlay} />
                    </button>
                    <button className={styles.botao} disabled={!props.podeTocar} onClick={props.onParar} title="Parar">
                        <FontAwesomeIcon icon={faStop} />
                    </button>
                    <button className={styles.botao} disabled={!props.podeTocar} onClick={props.onTestarLoop} title="Testar o loop (Fim → Início)">
                        <FontAwesomeIcon icon={faRepeat} />
                    </button>
                </div>

                <span className={styles.total}>de {formatarMs(props.fimMs)}</span>
            </div>
        </div>
    );
};
