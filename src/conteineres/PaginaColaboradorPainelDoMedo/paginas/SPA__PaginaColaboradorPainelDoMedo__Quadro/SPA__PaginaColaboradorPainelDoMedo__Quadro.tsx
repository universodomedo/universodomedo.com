'use client';

import { useState } from 'react';

import styles from './styles.module.css';

import { useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import ModalCard from './ModalCard';

export default function SPA__PaginaColaboradorPainelDoMedo__Quadro() {
    const { objetivos, statusCards, objetivoAtualId, setObjetivoAtualId, colunas, cards, comentarios, cardAbertoId, abrirCard, fecharCard, salvando, criaObjetivo, criaColuna, criaCard, atualizaCard, criaComentario, reordenaCards } = useContexto__PaginaColaboradorPainelDoMedo();

    const [novoObjetivo, setNovoObjetivo] = useState('');
    const [novaColuna, setNovaColuna] = useState('');
    const [novoCard, setNovoCard] = useState<Record<number, string>>({});
    const [cardArrastadoId, setCardArrastadoId] = useState<number | null>(null);
    const [colunaAlvoId, setColunaAlvoId] = useState<number | null>(null);

    const obtemStatus = (fkTiposStatusCardId: number) => statusCards.registros.find(status => status.id === fkTiposStatusCardId) ?? null;
    const cardAberto = cardAbertoId !== null ? cards.registros.find(card => card.id === cardAbertoId) ?? null : null;

    const submeteObjetivo = async () => { await criaObjetivo(novoObjetivo); setNovoObjetivo(''); };
    const submeteColuna = async () => { await criaColuna(novaColuna); setNovaColuna(''); };
    const submeteCard = async (fkColunasId: number) => { await criaCard(fkColunasId, novoCard[fkColunasId] ?? ''); setNovoCard(anterior => ({ ...anterior, [fkColunasId]: '' })); };

    const encerraArraste = () => { setCardArrastadoId(null); setColunaAlvoId(null); };
    const idsDaColuna = (colunaId: number) => cards.registros.filter(card => card.fkColunasId === colunaId && card.id !== cardArrastadoId).map(card => card.id);

    const soltaNoCard = (colunaId: number, cardAlvoId: number) => {
        if (cardArrastadoId === null || cardAlvoId === cardArrastadoId) return encerraArraste();
        const ids = idsDaColuna(colunaId);
        const indice = ids.indexOf(cardAlvoId);
        ids.splice(indice === -1 ? ids.length : indice, 0, cardArrastadoId);
        reordenaCards(colunaId, ids);
        encerraArraste();
    };

    const soltaNaColuna = (colunaId: number) => {
        if (cardArrastadoId === null) return encerraArraste();
        const ids = idsDaColuna(colunaId);
        ids.push(cardArrastadoId);
        reordenaCards(colunaId, ids);
        encerraArraste();
    };

    return (
        <section className={styles.painel}>
            <header className={styles.barra}>
                <span className={styles.rotulo}>Objetivo:</span>
                <select className={styles.seletor} value={objetivoAtualId ?? ''} onChange={evento => setObjetivoAtualId(evento.target.value ? Number(evento.target.value) : null)}>
                    {objetivos.registros.map(objetivo => <option key={objetivo.id} value={objetivo.id}>{objetivo.nome}</option>)}
                </select>

                <input className={styles.entrada} placeholder="Novo objetivo" value={novoObjetivo} onChange={evento => setNovoObjetivo(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') submeteObjetivo(); }} disabled={salvando} />
                <button className={styles.botao} onClick={submeteObjetivo} disabled={salvando || !novoObjetivo.trim()}>+ Objetivo</button>

                <input className={styles.entrada} placeholder="Nova coluna" value={novaColuna} onChange={evento => setNovaColuna(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') submeteColuna(); }} disabled={salvando} />
                <button className={styles.botao} onClick={submeteColuna} disabled={salvando || !novaColuna.trim()}>+ Coluna</button>
            </header>

            {objetivos.carregando && <p className={styles.estado}>{objetivos.carregando}</p>}
            {objetivos.erro && <p className={styles.erro}>{objetivos.erro}</p>}
            {!objetivos.carregando && objetivos.registros.length === 0 && <p className={styles.estado}>Nenhum objetivo ainda. Crie o primeiro acima.</p>}

            {objetivoAtualId !== null && (
                <div className={styles.colunas}>
                    {colunas.carregando && <p className={styles.estado}>{colunas.carregando}</p>}
                    {!colunas.carregando && colunas.registros.length === 0 && <p className={styles.estado}>Nenhuma coluna ainda. Crie a primeira acima.</p>}

                    {colunas.registros.map(coluna => {
                        const cardsDaColuna = cards.registros.filter(card => card.fkColunasId === coluna.id);
                        return (
                            <div key={coluna.id} className={`${styles.coluna} ${colunaAlvoId === coluna.id ? styles.colunaAlvo : ''}`}>
                                <div className={styles.colunaCabecalho}>
                                    <span>{coluna.nome}</span>
                                    <span className={styles.contador}>{cardsDaColuna.length}</span>
                                </div>
                                <div className={styles.lista} onDragOver={evento => { evento.preventDefault(); if (colunaAlvoId !== coluna.id) setColunaAlvoId(coluna.id); }} onDrop={() => soltaNaColuna(coluna.id)}>
                                    {cardsDaColuna.map(card => {
                                        const status = obtemStatus(card.fkTiposStatusCardId);
                                        return (
                                            <div key={card.id} className={`${styles.card} ${cardArrastadoId === card.id ? styles.cardArrastando : ''}`} style={status ? { borderLeftColor: status.cor } : undefined} draggable onDragStart={() => setCardArrastadoId(card.id)} onDragEnd={encerraArraste} onDragOver={evento => evento.preventDefault()} onDrop={evento => { evento.stopPropagation(); soltaNoCard(coluna.id, card.id); }} onClick={() => abrirCard(card.id)}>
                                                <span className={styles.cardTitulo}>{card.titulo}</span>
                                                {status && <span className={styles.pill} style={{ borderColor: status.cor, color: status.cor }}>{status.nome}</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={styles.adicionarCard}>
                                    <input className={styles.entrada} placeholder="+ card" value={novoCard[coluna.id] ?? ''} onChange={evento => setNovoCard(anterior => ({ ...anterior, [coluna.id]: evento.target.value }))} onKeyDown={evento => { if (evento.key === 'Enter') submeteCard(coluna.id); }} disabled={salvando} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {cardAberto && <ModalCard key={cardAberto.id} card={cardAberto} status={statusCards.registros} comentarios={comentarios} salvando={salvando} onSalvar={atualizaCard} onComentar={criaComentario} onFechar={fecharCard} />}
        </section>
    );
};
