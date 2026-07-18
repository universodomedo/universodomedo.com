import type { AppProps } from 'next/app';
import Head from 'next/head';

// Reset/base responsiva da v2. No Pages Router, CSS global só pode entrar aqui (_app).
// NÃO importar o globals.css do App Router — a v2 é lousa limpa (ver src/pages/LEIA-ME.md).
import './_globais-v2.css';

export default function AppV2({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                {/* Responsivo de verdade: a viewport manda, sem palco fixo 1920x1080. */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps} />
        </>
    );
};
