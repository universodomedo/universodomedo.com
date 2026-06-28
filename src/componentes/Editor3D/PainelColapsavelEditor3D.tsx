'use client';

import styles from './Editor3D.module.css';

import { useState, type ReactNode } from 'react';

interface PainelColapsavelEditor3DProps {
    readonly titulo: string;
    readonly valor: string;
    readonly children: ReactNode;
    readonly abertoInicialmente?: boolean;
    readonly acoes?: ReactNode;
};

export function PainelColapsavelEditor3D({ titulo, valor, children, abertoInicialmente = true, acoes = null }: PainelColapsavelEditor3DProps) {
    const [aberto, setAberto] = useState(abertoInicialmente);

    return (
        <section className={styles.painel_colapsavel}>
            <div className={styles.cabecalho_painel}>
                <button type="button" className={styles.botao_cabecalho_painel} aria-expanded={aberto} onClick={() => setAberto(valor => !valor)}>
                    <span className={styles.titulo_painel}><span className={styles.icone_painel}>{aberto ? '▾' : '▸'}</span>{titulo}</span>
                </button>
                <div className={styles.acoes_cabecalho_painel}>
                    {acoes}
                    <strong>{valor}</strong>
                </div>
            </div>
            {aberto && <div className={styles.conteudo_painel}>{children}</div>}
        </section>
    );
};
