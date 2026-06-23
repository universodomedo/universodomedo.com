'use client';

import { useState } from 'react';

import styles from './SecaoChecklist.module.css';

import { Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';

type Item = Contexto__PaginaColaboradorPainelDoMedo__Props['checklist']['registros'][number];

export default function SecaoChecklist({ itens, carregando, salvando, onCriar, onMarcar, onExcluir }: {
    itens: readonly Item[];
    carregando: string | null;
    salvando: boolean;
    onCriar: (texto: string) => Promise<void>;
    onMarcar: (id: number, concluido: boolean) => Promise<void>;
    onExcluir: (id: number) => Promise<void>;
}) {
    const [novo, setNovo] = useState<string>('');
    const [override, setOverride] = useState<Record<number, boolean>>({});

    const estaConcluido = (item: Item) => override[item.id] ?? item.concluido;
    const total = itens.length;
    const feitos = itens.filter(estaConcluido).length;
    const pct = total > 0 ? Math.round((feitos / total) * 100) : 0;

    const submeter = async () => { if (!novo.trim()) return; await onCriar(novo); setNovo(''); };
    const alterna = (item: Item) => { const valor = !estaConcluido(item); setOverride(prev => ({ ...prev, [item.id]: valor })); onMarcar(item.id, valor); };

    return (
        <div className={styles.secao}>
            <div className={styles.cabecalho}>
                <span className={styles.rotulo}>Checklist</span>
                {total > 0 && <span className={styles.contador}>{feitos}/{total} · {pct}%</span>}
            </div>
            {total > 0 && <div className={styles.barra}><div className={styles.barraPreenchida} style={{ width: `${pct}%` }} /></div>}
            {carregando && <p className={styles.estado}>{carregando}</p>}
            {!carregando && total === 0 && <p className={styles.estado}>Nenhum item ainda. Quebre em pontos executáveis e marque conforme conclui.</p>}
            <div className={styles.lista}>
                {itens.map(item => (
                    <div key={item.id} className={`${styles.item} ${estaConcluido(item) ? styles.itemFeito : ''}`}>
                        <button className={styles.check} onClick={() => alterna(item)} title={estaConcluido(item) ? 'Desmarcar' : 'Marcar como feito'}>{estaConcluido(item) ? '☑' : '☐'}</button>
                        <span className={styles.texto}>{item.texto}</span>
                        <button className={styles.remover} onClick={() => onExcluir(item.id)} disabled={salvando} title="Remover item">✕</button>
                    </div>
                ))}
            </div>
            <div className={styles.novo}>
                <input value={novo} onChange={e => setNovo(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submeter(); }} placeholder="+ adicionar item executável…" />
                <button className={styles.adicionar} onClick={submeter} disabled={!novo.trim()}>Adicionar</button>
            </div>
        </div>
    );
};
