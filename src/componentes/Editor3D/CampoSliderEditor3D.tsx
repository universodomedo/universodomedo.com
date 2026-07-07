'use client';

import styles from './Editor3D.module.css';

import { type ChangeEvent } from 'react';

interface CampoSliderEditor3DProps {
    readonly rotulo: string;
    readonly valor: number;
    readonly minimo: number;
    readonly maximo: number;
    readonly passo: number;
    readonly atualizaValor: (valor: number) => void;
};

// Slider de proporção (estilo Hero Forge): arraste contínuo com o valor numérico visível ao lado.
export function CampoSliderEditor3D({ rotulo, valor, minimo, maximo, passo, atualizaValor }: CampoSliderEditor3DProps) {
    function aoMudar(evento: ChangeEvent<HTMLInputElement>): void { atualizaValor(Number(evento.target.value)); };

    return (
        <label className={styles.campo_slider}>
            <span>{rotulo}</span>
            <input type="range" min={minimo} max={maximo} step={passo} value={valor} onChange={aoMudar} />
            <strong>{valor.toFixed(2)}×</strong>
        </label>
    );
};
