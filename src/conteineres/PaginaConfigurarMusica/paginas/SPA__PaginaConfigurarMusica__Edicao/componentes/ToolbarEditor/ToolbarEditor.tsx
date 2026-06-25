'use client';

import styles from './styles.module.css';

import { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faFlag, faFlagCheckered, faInfinity, faPause, faPlay, faRepeat, faRotateLeft, faScissors, faStop } from '@fortawesome/free-solid-svg-icons';

import { formatarMs } from '../editorMusica.uteis';
import TimecodeEditavel from '../TimecodeEditavel/TimecodeEditavel';

type ToolbarEditorProps = {
    posicaoMs: number;
    duracaoMs: number;
    fimMs: number;
    onSeekManual: (ms: number) => void;
    tocando: boolean;
    podeTocar: boolean;
    onPlayPause: () => void;
    onParar: () => void;
    onInicio: () => void;
    onTestarLoop: () => void;
    onRepetirEmenda: () => void;
    onMarcarInicio: () => void;
    onMarcarRetorno: () => void;
    onMarcarFim: () => void;
    onCortar: () => void;
    zoom: number;
    zoomMin: number;
    zoomMax: number;
    onZoomMenos: () => void;
    onZoomMais: () => void;
    onZoomSlider: (valor: number) => void;
    onAjustar: () => void;
};

export default function ToolbarEditor(props: ToolbarEditorProps): JSX.Element {
    return (
        <div className={styles.toolbar}>
            <div className={styles.grupo}>
                <TimecodeEditavel posicaoMs={props.posicaoMs} duracaoMs={props.duracaoMs} onIrPara={props.onSeekManual} />
                <span className={styles.total}>/ {formatarMs(props.fimMs)}</span>

                <span className={styles.separador} />

                <button className={styles.botao} disabled={!props.podeTocar} onClick={props.onInicio} title="Tocar do Início"><FontAwesomeIcon icon={faBackwardStep} /></button>
                <button className={`${styles.botao} ${styles.botaoPrincipal}`} disabled={!props.podeTocar} onClick={props.onPlayPause} title={props.tocando ? 'Pausar' : 'Tocar'}><FontAwesomeIcon icon={props.tocando ? faPause : faPlay} /></button>
                <button className={styles.botao} disabled={!props.podeTocar} onClick={props.onParar} title="Parar"><FontAwesomeIcon icon={faStop} /></button>
                <button className={styles.botao} disabled={!props.podeTocar} onClick={props.onTestarLoop} title="Testar o loop (Fim → Retorno)"><FontAwesomeIcon icon={faRepeat} /></button>
                <button className={styles.botao} disabled={!props.podeTocar} onClick={props.onRepetirEmenda} title="Repetir a emenda em loop contínuo"><FontAwesomeIcon icon={faInfinity} /></button>

                <span className={styles.separador} />

                <button className={`${styles.botao} ${styles.marcarInicio}`} onClick={props.onMarcarInicio} title="Marca o Início na posição da Head"><FontAwesomeIcon icon={faFlag} /></button>
                <button className={`${styles.botao} ${styles.marcarRetorno}`} onClick={props.onMarcarRetorno} title="Marca o Retorno na posição da Head"><FontAwesomeIcon icon={faRotateLeft} /></button>
                <button className={`${styles.botao} ${styles.marcarFim}`} onClick={props.onMarcarFim} title="Marca o Fim na posição da Head"><FontAwesomeIcon icon={faFlagCheckered} /></button>
                <button className={styles.botao} onClick={props.onCortar} title="Corta um bloco na posição da Head"><FontAwesomeIcon icon={faScissors} /></button>
            </div>

            <div className={styles.grupoZoom}>
                <button className={styles.botaoZoom} onClick={props.onZoomMenos} disabled={props.zoom <= props.zoomMin} title="Reduzir zoom">−</button>
                <input className={styles.zoomSlider} type="range" min={props.zoomMin} max={props.zoomMax} step={0.5} value={props.zoom} onChange={evento => props.onZoomSlider(Number(evento.target.value))} title="Zoom" />
                <button className={styles.botaoZoom} onClick={props.onZoomMais} disabled={props.zoom >= props.zoomMax} title="Aumentar zoom">+</button>
                <span className={styles.zoomValor}>{Math.round(props.zoom * 100)}%</span>
                <button className={styles.botaoAjustar} onClick={props.onAjustar} disabled={props.zoom === 1} title="Ajustar à tela">Ajustar</button>
            </div>
        </div>
    );
};
