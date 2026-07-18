'use client';

import { useState } from 'react';

import styles from './SecaoChecklist.module.css';

import { Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';

type Item = Contexto__PaginaColaboradorPainelDoMedo__Props['checklist']['registros'][number];
type Referencia = { cardId: number; titulo: string; concluido: boolean };

// Componente de checklist reutilizavel.
// Adicao de item: `onAdicionar` (SPA propria — ficha do CARD) OU `onCriar` (quick-add inline — ficha do OBJETIVO). Passar um dos dois.
// Item que referencia um cartao (`resolveReferencia` retorna != null): check DERIVADO (cartao Concluido), sem marcacao manual, com LINK para o cartao. `onTransformarEmCard` (item vira cartao) e `onVincular` (vincular cartao existente) so no card, para membros.
// Permissoes: callbacks omitidos = affordancia some (leitura pura para observadores).
export default function SecaoChecklist({ itens, carregando, salvando, onAdicionar, onCriar, onMarcar, onExcluir, resolveReferencia, onTransformarEmCard, onVincular, aoAbrirCardReferencia }: {
    itens: readonly Item[];
    carregando: string | null;
    salvando: boolean;
    onAdicionar?: () => void;
    onCriar?: (texto: string) => Promise<void>;
    onMarcar?: (id: number, concluido: boolean) => Promise<boolean>;
    onExcluir?: (id: number) => Promise<void>;
    resolveReferencia?: (fkCardsReferenciaId: number | null) => Referencia | null;
    onTransformarEmCard?: (id: number) => void;
    onVincular?: () => void;
    aoAbrirCardReferencia?: (cardId: number) => void;
}) {
    const [override, setOverride] = useState<Record<number, boolean>>({});
    const [novo, setNovo] = useState<string>('');

    const referenciaDe = (item: Item): Referencia | null => resolveReferencia?.(item.fkCardsReferenciaId ?? null) ?? null;
    // Item que referencia cartao: concluido derivado (nao usa override/concluido manual).
    const estaConcluido = (item: Item) => { const ref = referenciaDe(item); return ref ? ref.concluido : (override[item.id] ?? item.concluido); };
    const total = itens.length;
    const feitos = itens.filter(estaConcluido).length;
    const pct = total > 0 ? Math.round((feitos / total) * 100) : 0;

    // Check otimista com REVERSAO: se o marcar falhar ou for bloqueado (regra de processo), o override e descartado e o item volta ao estado do servidor — o visual nunca diverge do banco.
    const alterna = async (item: Item) => {
        if (!onMarcar || referenciaDe(item)) return;
        const valor = !estaConcluido(item);
        setOverride(prev => ({ ...prev, [item.id]: valor }));
        const sucesso = await onMarcar(item.id, valor);
        if (!sucesso) setOverride(prev => { const proximo = { ...prev }; delete proximo[item.id]; return proximo; });
    };
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
                {itens.map(item => {
                    const ref = referenciaDe(item);
                    const feito = estaConcluido(item);
                    // Item que referencia cartao: MINI-CARD (mesma linguagem visual do card do quadro) com chip "CARTÃO" explicito; SEM checkbox (conclusao deriva do cartao, mostrada pela tag "Concluído").
                    if (ref) return (
                        <div key={item.id} className={`${styles.itemCard} ${feito ? styles.itemCardFeito : ''}`}>
                            <span className={styles.chipCartao}>Cartão</span>
                            <button className={styles.textoLink} onClick={() => aoAbrirCardReferencia?.(ref.cardId)} title={`Abrir cartão #${ref.cardId}`}>{item.texto} <span className={styles.setaLink}>↗</span></button>
                            {feito && <span className={styles.tagConcluido}>Concluído</span>}
                            {onExcluir && <button className={styles.remover} onClick={() => onExcluir(item.id)} disabled={salvando} title="Remover vínculo (o cartão permanece)">✕</button>}
                        </div>
                    );
                    return (
                        <div key={item.id} className={`${styles.item} ${feito ? styles.itemFeito : ''}`}>
                            {onMarcar ? (
                                <button className={styles.check} onClick={() => alterna(item)} title={feito ? 'Desmarcar' : 'Marcar como feito'}>{feito ? '☑' : '☐'}</button>
                            ) : feito ? (
                                <span className={styles.checkLeitura}>✓</span>
                            ) : (
                                <span className={styles.checkVazio} />
                            )}
                            <span className={styles.texto}>{item.texto}</span>
                            {onTransformarEmCard && <button className={styles.acaoItem} onClick={() => onTransformarEmCard(item.id)} disabled={salvando} title="Transformar em cartão">⤴</button>}
                            {onExcluir && <button className={styles.remover} onClick={() => onExcluir(item.id)} disabled={salvando} title="Remover item">✕</button>}
                        </div>
                    );
                })}
            </div>
            {(onAdicionar || onVincular) && (
                <div className={styles.acoesAdicionar}>
                    {onAdicionar && <button className={styles.adicionarLinha} onClick={onAdicionar} disabled={salvando}>+ Adicionar item</button>}
                    {onVincular && <button className={styles.adicionarLinha} onClick={onVincular} disabled={salvando}>+ Vincular cartão existente</button>}
                </div>
            )}
            {onCriar && (
                <div className={styles.novo}>
                    <input value={novo} onChange={e => setNovo(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submeterInline(); }} placeholder="+ adicionar item executável…" />
                    <button className={styles.adicionar} onClick={submeterInline} disabled={!novo.trim()}>Adicionar</button>
                </div>
            )}
        </div>
    );
};
