'use client';

import styles from './styles.module.css';

import CardEmblema from '../CardEmblema/page.tsx';
import CardConquistas from '../CardConquistas/page.tsx';

import Image from 'next/image';

export default function EmblemaConquistas() {


    return (
        <>
            <aside className={styles.recipiente_emblemas_conquistas}>
                <CardEmblema />
                <CardConquistas />
            </aside>
        </>
    );
}