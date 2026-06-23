'use client';

import styles from './styles.module.css';

import { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import { TransicaoLoopMontagemMusica } from 'types-nora-api';

import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';

type CampoTransicaoLoop = 'duracaoFadeOutMs' | 'duracaoFadeInMs' | 'sobreposicaoInicioLoopMs';

type PainelTransicaoLoopProps = {
    transicaoLoop: TransicaoLoopMontagemMusica;
    onSetCampo: (campo: CampoTransicaoLoop, valor: number) => void;
    onTestar: () => void;
};

export default function PainelTransicaoLoop(props: PainelTransicaoLoopProps): JSX.Element {
    return (
        <div className={styles.painel}>
            <div className={styles.cabecalho}>
                <span className={styles.titulo}>Transição de loop (Fim → Início)</span>
                <button className={styles.botaoTestar} onClick={props.onTestar} title="Tocar a virada do loop com crossfade">
                    <FontAwesomeIcon icon={faRepeat} /> Testar loop
                </button>
            </div>

            <div className={styles.campos}>
                <InputComRotulo rotulo={'Fade-out no Fim (ms)'}>
                    <input className={styles.campo} type="number" min={0} step={50} value={props.transicaoLoop.duracaoFadeOutMs} onChange={evento => props.onSetCampo('duracaoFadeOutMs', Number(evento.target.value))} />
                </InputComRotulo>
                <InputComRotulo rotulo={'Fade-in no Início (ms)'}>
                    <input className={styles.campo} type="number" min={0} step={50} value={props.transicaoLoop.duracaoFadeInMs} onChange={evento => props.onSetCampo('duracaoFadeInMs', Number(evento.target.value))} />
                </InputComRotulo>
                <InputComRotulo rotulo={'Sobreposição (ms)'}>
                    <input className={styles.campo} type="number" min={0} step={50} value={props.transicaoLoop.sobreposicaoInicioLoopMs} onChange={evento => props.onSetCampo('sobreposicaoInicioLoopMs', Number(evento.target.value))} />
                </InputComRotulo>
            </div>
        </div>
    );
};
