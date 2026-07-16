'use client';

import { useState } from 'react';

import styles from './SecaoChecklist.module.css';

import { Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';

type Item = Contexto__PaginaColaboradorPainelDoMedo__Props['checklist']['registros'][number];

// Componente de checklist reutilizavel. Adicao de item em dois modos: `onAdicionar` (navega para SPA propria — usado na ficha do CARD, onde toda operacao que da input tem pagina propria) OU `onCriar` (quick-add inline — mantido para a ficha do OBJETIVO). Passar exatamente um dos dois.
// Permissoes: callbacks omitidos = affordancia some (onMarcar ausente => check estatico; onExcluir ausente => sem ✕) — leitura pura para observadores.
export default function SecaoChecklist({ itens, carregando, salvando, onAdicionar, onCriar, onMarcar, onExcluir }: {
    itens: readonly Item[];
    carregando: string | null;
    salvando: boolean;
    onAdicionar?: () => void;
    onCriar?: (texto: string) => Promise<void>;
    onMarcar?: (id: number, concluido: boolean) => Promise<void>;
    onExcluir?: (id: number) => Promise<void>;
}) {
    const [override, setOverride] = useState<Record<number, boolean>>({});
    const [novo, setNovo] = useState<string>('');

    const estaConcluido = (item: Item) => override[item.id] ?? item.concluido;
    const total = itens.length;
    const feitos = itens.filter(estaConcluido).length;
    const pct = total > 0 ? Math.round((feitos / total) * 100) : 0;

    const alterna = (item: Item) => { if (!onMarcar) return; const valor = !estaConcluido(item); setOverride(prev => ({ ...prev, [item.id]: valor })); onMarcar(item.id, valor); };
    const submeterInline = async () => { if (!novo.trim() || !onCriar) return; await onCriar(novo); setNovo(''); };

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
                        {onMarcar ? (
                            <button className={styles.check} onClick={() => alterna(item)} title={estaConcluido(item) ? 'Desmarcar' : 'Marcar como feito'}>{estaConcluido(item) ? '☑' : '☐'}</button>
                        ) : (
                            <span className={styles.check}>{estaConcluido(item) ? '☑' : '☐'}</span>
                        )}
                        <span className={styles.texto}>{item.texto}</span>
                        {onExcluir && <button className={styles.remover} onClick={() => onExcluir(item.id)} disabled={salvando} title="Remover item">✕</button>}
                    </div>
                ))}
            </div>
            {onAdicionar && <button className={styles.adicionarLinha} onClick={onAdicionar} disabled={salvando}>+ Adicionar item</button>}
            {onCriar && (
                <div className={styles.novo}>
                    <input value={novo} onChange={e => setNovo(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submeterInline(); }} placeholder="+ adicionar item executável…" />
                    <button className={styles.adicionar} onClick={submeterInline} disabled={!novo.trim()}>Adicionar</button>
                </div>
            )}
        </div>
    );
};
