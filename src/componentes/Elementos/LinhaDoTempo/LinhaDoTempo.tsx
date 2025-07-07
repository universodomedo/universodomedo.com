'use client';

import styles from './styles.module.css'
import { useEffect, useRef } from "react";
import { useResize } from 'Hooks/useResize';

import { select } from 'd3-selection';
import desenhaElementoEstatico from 'Helpers/D3/desenhaElementoEstatico';

export default function LinhaDoTempo() {
    const ref = useRef<HTMLDivElement | null>(null);
    const size = useResize(ref);

    useEffect(() => {
        select(ref.current)?.select('svg').remove();

        if (size) {
            select(ref.current).append('svg').attr('width', size.width).attr('height', size.height);

            desenhaElementoEstatico(ref.current!, size);
        }
    }, [size]);

    return (
        <>
            <h1>Linha do Tempo</h1>

            <div id={styles.recipiente_linha_do_tempo} ref={ref} />
        </>
    );
};