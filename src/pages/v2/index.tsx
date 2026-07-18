import Head from 'next/head';

import styles from './index.module.css';

// Rota /v2 — esqueleto responsivo em branco. Ponto de partida para o novo conceito
// do designer, isolado do app atual (App Router). Ver src/pages/LEIA-ME.md.
export default function PaginaV2() {
    return (
        <>
            <Head>
                <title>Universo do Medo — v2</title>
            </Head>

            <main className={styles.tela}>
                <span className={styles.marca}>v2</span>
            </main>
        </>
    );
};
