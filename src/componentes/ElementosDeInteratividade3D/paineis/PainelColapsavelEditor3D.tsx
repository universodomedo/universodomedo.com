'use client';

import styles from './styles.module.css';

import { useState, type ReactNode } from 'react';

interface PainelColapsavelEditor3DProps {
    titulo: string;
    valor: string;
    children: ReactNode;
    abertoInicialmente?: boolean;
    acoes?: ReactNode;
};

export function PainelColapsavelEditor3D({ titulo, valor, children, abertoInicialmente = true, acoes = null }: PainelColapsavelEditor3DProps) {
    const [aberto, setAberto] = useState(abertoInicialmente);

    return (
        <section className={styles.painelBlender}>
            <div className={styles.cabecalhoPainelBlender}>
                <button className={styles.botaoCabecalhoPainelBlender} type="button" onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
                    <span className={styles.tituloPainelColapsavel}><span className={styles.iconePainelColapsavel}>{aberto ? '▾' : '▸'}</span>{titulo}</span>
                </button>

                <div className={styles.acoesCabecalhoPainelBlender}>
                    {acoes}
                    <strong>{valor}</strong>
                </div>
            </div>

            {aberto && <div className={styles.conteudoPainelColapsavel}>{children}</div>}
        </section>
    );
};