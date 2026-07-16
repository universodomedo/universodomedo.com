'use client';

import { useState } from 'react';

import styles from './FichaObjetivo.module.css';

import { useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import SecaoChecklist from './SecaoChecklist';

export default function FichaObjetivo({ objetivoId }: { objetivoId: number }) {
    const { objetivos, checklist, salvando, atualizaObjetivoFicha, criaItemChecklist, marcaItemChecklist, deletaItemChecklist, trancaObjetivo, fecharFichaObjetivo } = useContexto__PaginaColaboradorPainelDoMedo();
    const { usuarioLogado } = useContextoAutenticacao();

    const objetivo = objetivos.registros.find(o => o.id === objetivoId) ?? null;
    const [descricao, setDescricao] = useState<string>(objetivo?.descricao ?? '');

    if (!objetivo) return null;

    // Tranca do objetivo: trancado = ficha somente-leitura; trancar/destrancar e exclusivo do criador (backend valida que todos os cards estejam trancados).
    const trancado = objetivo.motivoTranca !== null;
    const ehCriador = usuarioLogado?.id === objetivo.fkUsuariosCriacaoId;

    const salvar = () => atualizaObjetivoFicha(objetivoId, descricao.trim() ? descricao.trim() : null);

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) fecharFichaObjetivo(); }}>
            <div className={styles.modal}>
                <header className={styles.cabecalho}>
                    <div className={styles.tituloBloco}>
                        <span className={styles.chip}>Objetivo</span>
                        <span className={styles.titulo}>{objetivo.nome}</span>
                        {trancado && <span className={`${styles.seloTranca} ${objetivo.motivoTranca === 'CONCLUIDO' ? styles.seloTrancaConcluido : styles.seloTrancaInterrompido}`}>🔒 {objetivo.motivoTranca === 'CONCLUIDO' ? 'Concluído' : 'Interrompido'}</span>}
                    </div>
                    <button className={styles.fechar} onClick={fecharFichaObjetivo} title="Fechar">✕</button>
                </header>

                {!trancado && <div className={styles.campos}>
                    <button className={styles.salvar} onClick={salvar} disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
                </div>}

                <label className={styles.campoDescricao}>
                    <span>Descrição (o requisito a atender)</span>
                    <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="O usuário precisa ser capaz de…" rows={4} disabled={trancado} />
                </label>

                <div className={styles.bloco}>
                    <SecaoChecklist itens={checklist.registros} carregando={checklist.carregando} salvando={salvando} onCriar={trancado ? undefined : criaItemChecklist} onMarcar={trancado ? undefined : marcaItemChecklist} onExcluir={trancado ? undefined : deletaItemChecklist} />
                </div>

                {ehCriador && (
                    <div className={styles.acoesTranca}>
                        {trancado
                            ? <button className={styles.salvar} onClick={() => trancaObjetivo(objetivoId, null)} disabled={salvando}>Destrancar objetivo</button>
                            : (
                                <>
                                    <button className={styles.salvar} onClick={() => trancaObjetivo(objetivoId, 'CONCLUIDO')} disabled={salvando}>Trancar como Concluído</button>
                                    <button className={styles.salvar} onClick={() => trancaObjetivo(objetivoId, 'INTERROMPIDO')} disabled={salvando}>Trancar como Interrompido</button>
                                </>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
};
