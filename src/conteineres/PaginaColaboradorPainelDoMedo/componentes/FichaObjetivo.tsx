'use client';

import { useState } from 'react';

import styles from './FichaObjetivo.module.css';

import { useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import SecaoChecklist from './SecaoChecklist';

export default function FichaObjetivo({ objetivoId }: { objetivoId: number }) {
    const { objetivos, statusCards, checklist, salvando, atualizaObjetivoFicha, criaItemChecklist, marcaItemChecklist, deletaItemChecklist, fecharFichaObjetivo } = useContexto__PaginaColaboradorPainelDoMedo();

    const objetivo = objetivos.registros.find(o => o.id === objetivoId) ?? null;
    const [descricao, setDescricao] = useState<string>(objetivo?.descricao ?? '');
    const [statusId, setStatusId] = useState<number>(objetivo?.fkTiposStatusCardId ?? 0);

    if (!objetivo) return null;

    const status = statusCards.registros.find(s => s.id === statusId) ?? null;
    const salvar = () => atualizaObjetivoFicha(objetivoId, descricao.trim() ? descricao.trim() : null, statusId > 0 ? statusId : null);

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) fecharFichaObjetivo(); }}>
            <div className={styles.modal}>
                <header className={styles.cabecalho}>
                    <div className={styles.tituloBloco}>
                        <span className={styles.chip}>Objetivo</span>
                        <span className={styles.titulo}>{objetivo.nome}</span>
                    </div>
                    <button className={styles.fechar} onClick={fecharFichaObjetivo} title="Fechar">✕</button>
                </header>

                <div className={styles.campos}>
                    <label className={styles.campo}>
                        <span>Status</span>
                        <select value={statusId} onChange={e => setStatusId(Number(e.target.value))}>
                            <option value={0}>— sem status —</option>
                            {statusCards.registros.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                        </select>
                    </label>
                    {status && <span className={styles.pill} style={{ borderColor: status.cor, color: status.cor }}>{status.nome}</span>}
                    <button className={styles.salvar} onClick={salvar} disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
                </div>

                <label className={styles.campoDescricao}>
                    <span>Descrição (o requisito a atender)</span>
                    <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="O usuário precisa ser capaz de…" rows={4} />
                </label>

                <div className={styles.bloco}>
                    <SecaoChecklist itens={checklist.registros} carregando={checklist.carregando} salvando={salvando} onCriar={criaItemChecklist} onMarcar={marcaItemChecklist} onExcluir={deletaItemChecklist} />
                </div>
            </div>
        </div>
    );
};
