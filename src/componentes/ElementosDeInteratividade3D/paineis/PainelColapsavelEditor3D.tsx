'use client';

import styles from './styles.module.css';

import { useState, type ReactNode } from 'react';

interface PainelColapsavelEditor3DProps {
    titulo: string;
    valor: string;
    children: ReactNode;
    abertoInicialmente?: boolean;
};

export function PainelColapsavelEditor3D({ titulo, valor, children, abertoInicialmente = true }: PainelColapsavelEditor3DProps) {
    const [aberto, setAberto] = useState(abertoInicialmente);

    return (
        <section className={styles.painelBlender}>
            <button className={styles.cabecalhoPainelBlender} type="button" onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
                <span className={styles.tituloPainelColapsavel}><span className={styles.iconePainelColapsavel}>{aberto ? '▾' : '▸'}</span>{titulo}</span>
                <strong>{valor}</strong>
            </button>

            {aberto && <div className={styles.conteudoPainelColapsavel}>{children}</div>}
        </section>
    );
};