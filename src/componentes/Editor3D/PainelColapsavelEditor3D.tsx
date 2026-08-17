'use client';

import styles from './Editor3D.module.css';

import { useState, type ReactNode } from 'react';

interface PainelColapsavelEditor3DProps {
    readonly titulo: string;
    readonly valor: string;
    readonly children: ReactNode;
    readonly abertoInicialmente?: boolean;
    readonly acoes?: ReactNode;
    // Substitui o TEXTO do título por um nó interativo (ex.: o seletor de Coleção de Sistema). O botão colapsar vira só a setinha.
    readonly tituloInterativo?: ReactNode;
};

export function PainelColapsavelEditor3D({ titulo, valor, children, abertoInicialmente = true, acoes = null, tituloInterativo = null }: PainelColapsavelEditor3DProps) {
    const [aberto, setAberto] = useState(abertoInicialmente);

    return (
        <section className={styles.painel_colapsavel}>
            <div className={`${styles.cabecalho_painel} ${tituloInterativo !== null ? styles.cabecalho_painel_interativo : ''}`}>
                <button type="button" className={styles.botao_cabecalho_painel} aria-expanded={aberto} aria-label={aberto ? `Recolher ${titulo}` : `Expandir ${titulo}`} onClick={() => setAberto(valor => !valor)}>
                    <span className={styles.titulo_painel}><span className={styles.icone_painel}>{aberto ? '▾' : '▸'}</span>{tituloInterativo === null ? titulo : null}</span>
                </button>
                {tituloInterativo}
                <div className={styles.acoes_cabecalho_painel}>
                    {acoes}
                    <strong>{valor}</strong>
                </div>
            </div>
            {aberto && <div className={styles.conteudo_painel}>{children}</div>}
        </section>
    );
};
