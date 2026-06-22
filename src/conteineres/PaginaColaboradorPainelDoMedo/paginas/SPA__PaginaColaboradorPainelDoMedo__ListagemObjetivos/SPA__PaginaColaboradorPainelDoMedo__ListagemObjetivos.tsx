'use client';

import { useState } from 'react';

import styles from './styles.module.css';

import { useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__ListagemObjetivos() {
    const { objetivos, todosCards, salvando, irParaObjetivo, irParaCadastroObjetivo, atualizaObjetivo, deletaObjetivo } = useContexto__PaginaColaboradorPainelDoMedo();

    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [nomeEdit, setNomeEdit] = useState('');

    const contaCards = (objetivoId: number) => todosCards.registros.filter(c => c.fkObjetivosId === objetivoId).length;
    const confirma = (id: number) => { const o = objetivos.registros.find(x => x.id === id); if (nomeEdit.trim() && o && nomeEdit.trim() !== o.nome) atualizaObjetivo(id, nomeEdit); setEditandoId(null); };

    return (
        <section className={styles.listagem}>
            <header className={styles.cabecalho}>
                <h2 className={styles.titulo}>Objetivos atuais</h2>
            </header>

            {objetivos.carregando && <p className={styles.estado}>{objetivos.carregando}</p>}
            {objetivos.erro && <p className={styles.erro}>{objetivos.erro}</p>}

            <div className={styles.grade}>
                {objetivos.registros.map(objetivo => (
                    <div key={objetivo.id} className={styles.cardObjetivo} onClick={() => { if (editandoId !== objetivo.id) irParaObjetivo(objetivo.id); }}>
                        {editandoId === objetivo.id ? (
                            <input className={styles.entradaNome} value={nomeEdit} autoFocus onClick={evento => evento.stopPropagation()} onChange={evento => setNomeEdit(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') confirma(objetivo.id); if (evento.key === 'Escape') setEditandoId(null); }} onBlur={() => confirma(objetivo.id)} />
                        ) : (
                            <span className={styles.objetivoNome}>{objetivo.nome}</span>
                        )}
                        <div className={styles.objetivoRodape}>
                            <span className={styles.objetivoContagem}>{contaCards(objetivo.id)} cards</span>
                            <span className={styles.objetivoAcoes}>
                                <button className={styles.acaoMini} onClick={evento => { evento.stopPropagation(); setEditandoId(objetivo.id); setNomeEdit(objetivo.nome); }} title="Renomear objetivo">✎</button>
                                <button className={styles.acaoMini} onClick={evento => { evento.stopPropagation(); deletaObjetivo(objetivo.id); }} disabled={salvando} title="Excluir objetivo (precisa estar sem cards)">✕</button>
                            </span>
                        </div>
                    </div>
                ))}
                <button className={styles.cardNovo} onClick={irParaCadastroObjetivo}>+ Novo objetivo</button>
            </div>
        </section>
    );
};
