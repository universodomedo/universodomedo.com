'use client';

import { useEffect, useRef } from 'react';
import cn from 'classnames';
import { type PalcoTranscricaoUtterance } from 'types-nora-api';

import styles from './styles.module.css';

// Painel de transcrição ao vivo do Palco: histórico rolável com a rolagem presa ao fim enquanto o usuário não sobe para ler.
export default function PainelTranscricaoPalco({ utterances }: { utterances: PalcoTranscricaoUtterance[]; }) {
    const listaRef = useRef<HTMLDivElement | null>(null);
    const presoAoFimRef = useRef(true);

    const handleScroll = (): void => {
        const lista = listaRef.current;
        if (!lista) return;
        presoAoFimRef.current = lista.scrollHeight - lista.scrollTop - lista.clientHeight < 40;
    };

    useEffect(() => {
        const lista = listaRef.current;
        if (!lista || !presoAoFimRef.current) return;
        lista.scrollTop = lista.scrollHeight;
    }, [utterances]);

    return (
        <section className={styles.painel}>
            <div className={styles.cabecalho}>
                <h2 className={styles.titulo}>Transcrição</h2>
                <span className={styles.contador}>({utterances.length})</span>
            </div>
            {utterances.length === 0
                ? <p className={styles.vazio}>Nada transcrito ainda.</p>
                : (
                    <div ref={listaRef} onScroll={handleScroll} className={styles.lista}>
                        {utterances.map(u => (
                            <p key={`${u.idUsuario}:${u.seq}`} className={cn(styles.utterance, u.parcial && styles.utterance_parcial)}>
                                <span className={styles.horario}>{new Date(u.ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className={styles.autor}>{u.nome}</span>
                                {u.texto}
                            </p>
                        ))}
                    </div>
                )
            }
        </section>
    );
};