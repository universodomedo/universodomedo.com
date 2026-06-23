'use client';

import styles from './styles.module.css';

import { JSX, useEffect, useRef, useState } from 'react';

import { formatarMs, parseTimecode } from '../editorMusica.uteis';

const PASSO_MS = 10;

type TimecodeEditavelProps = {
    posicaoMs: number;
    duracaoMs: number;
    onIrPara: (ms: number) => void;
};

export default function TimecodeEditavel(props: TimecodeEditavelProps): JSX.Element {
    const [editando, setEditando] = useState(false);
    const [texto, setTexto] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => { if (editando) inputRef.current?.select(); }, [editando]);

    function confirmar() {
        const ms = parseTimecode(texto);
        if (ms !== null) props.onIrPara(ms);
        setEditando(false);
    };

    function abrirEdicao() {
        setTexto(formatarMs(props.posicaoMs));
        setEditando(true);
    };

    return (
        <div className={styles.timecode}>
            <button className={styles.passo} onClick={() => props.onIrPara(props.posicaoMs - PASSO_MS)} title="Recuar 10 ms">−</button>
            {editando ? (
                <input ref={inputRef} className={styles.campo} value={texto} onChange={evento => setTexto(evento.target.value)} onBlur={confirmar} onKeyDown={evento => { if (evento.key === 'Enter') confirmar(); if (evento.key === 'Escape') setEditando(false); }} />
            ) : (
                <button className={styles.valor} onClick={abrirEdicao} title="Clique para digitar (ms, ss.mmm ou m:ss.mmm)">{formatarMs(props.posicaoMs)}</button>
            )}
            <button className={styles.passo} onClick={() => props.onIrPara(props.posicaoMs + PASSO_MS)} title="Avançar 10 ms">+</button>
        </div>
    );
};
