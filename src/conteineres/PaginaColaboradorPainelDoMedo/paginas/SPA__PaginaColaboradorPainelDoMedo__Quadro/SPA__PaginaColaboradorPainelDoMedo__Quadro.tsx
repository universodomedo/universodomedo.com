'use client';

import { useState } from 'react';

import styles from './styles.module.css';

import { useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import BarraView from 'Conteineres/PaginaColaboradorPainelDoMedo/componentes/BarraView';
import ModalCard from './ModalCard';

export default function SPA__PaginaColaboradorPainelDoMedo__Quadro() {
    const { pagina, setPagina, irParaListagem, objetivos, objetivoAtualId, statusCards, colunas, cards, comentarios, cardAbertoId, abrirCard, fecharCard, salvando, criaColuna, criaCard, atualizaCard, criaComentario, reordenaCards, atualizaColuna, deletaColuna, reordenaColunas } = useContexto__PaginaColaboradorPainelDoMedo();

    const [novoCard, setNovoCard] = useState<Record<number, string>>({});
    const [cardArrastadoId, setCardArrastadoId] = useState<number | null>(null);
    const [colunaAlvoId, setColunaAlvoId] = useState<number | null>(null);
    const [colunaArrastadaId, setColunaArrastadaId] = useState<number | null>(null);
    const [colunaEditandoId, setColunaEditandoId] = useState<number | null>(null);
    const [nomeEditColuna, setNomeEditColuna] = useState('');
    const [adicionandoColuna, setAdicionandoColuna] = useState(false);
    const [nomeNovaColuna, setNomeNovaColuna] = useState('');

    const obtemStatus = (fkTiposStatusCardId: number) => statusCards.registros.find(status => status.id === fkTiposStatusCardId) ?? null;
    const cardAberto = cardAbertoId !== null ? cards.registros.find(card => card.id === cardAbertoId) ?? null : null;
    const objetivoAtual = objetivos.registros.find(o => o.id === objetivoAtualId) ?? null;

    const submeteCard = async (fkColunasId: number) => { await criaCard(fkColunasId, novoCard[fkColunasId] ?? ''); setNovoCard(anterior => ({ ...anterior, [fkColunasId]: '' })); };
    const submeteNovaColuna = async () => { if (!nomeNovaColuna.trim()) return; await criaColuna(nomeNovaColuna); setNomeNovaColuna(''); };

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

    const soltaColuna = (alvoId: number) => {
        if (colunaArrastadaId === null || colunaArrastadaId === alvoId) { setColunaArrastadaId(null); return; }
        const ids = colunas.registros.filter(c => c.id !== colunaArrastadaId).map(c => c.id);
        const indice = ids.indexOf(alvoId);
        ids.splice(indice === -1 ? ids.length : indice, 0, colunaArrastadaId);
        reordenaColunas(ids);
        setColunaArrastadaId(null);
    };

    const confirmaColuna = (id: number) => { const c = colunas.registros.find(x => x.id === id); if (nomeEditColuna.trim() && c && nomeEditColuna.trim() !== c.nome) atualizaColuna(id, nomeEditColuna); setColunaEditandoId(null); };

    if (objetivoAtualId === null) return <section className={styles.painel}><p className={styles.estado}>Selecione um objetivo. <button className={styles.voltar} onClick={irParaListagem}>← Objetivos</button></p></section>;

    return (
        <section className={styles.painel}>
            <header className={styles.barra}>
                <BarraView pagina={pagina} setPagina={setPagina} />
                <button className={styles.voltar} onClick={irParaListagem}>← Objetivos</button>
                <span className={styles.nomeObjetivo}>{objetivoAtual?.nome ?? ''}</span>
            </header>

            <div className={styles.colunas}>
                {colunas.carregando && <p className={styles.estado}>{colunas.carregando}</p>}

                {colunas.registros.map(coluna => {
                    const cardsDaColuna = cards.registros.filter(card => card.fkColunasId === coluna.id);
                    return (
                        <div key={coluna.id} className={`${styles.coluna} ${colunaAlvoId === coluna.id ? styles.colunaAlvo : ''}`}>
                            <div className={styles.colunaCabecalho} draggable={colunaEditandoId !== coluna.id} onDragStart={() => setColunaArrastadaId(coluna.id)} onDragEnd={() => setColunaArrastadaId(null)} onDragOver={evento => evento.preventDefault()} onDrop={() => soltaColuna(coluna.id)}>
                                {colunaEditandoId === coluna.id ? (
                                    <input className={styles.entradaColuna} value={nomeEditColuna} autoFocus onChange={evento => setNomeEditColuna(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') confirmaColuna(coluna.id); if (evento.key === 'Escape') setColunaEditandoId(null); }} onBlur={() => confirmaColuna(coluna.id)} />
                                ) : (
                                    <span className={styles.colunaNome} onDoubleClick={() => { setColunaEditandoId(coluna.id); setNomeEditColuna(coluna.nome); }}>{coluna.nome}</span>
                                )}
                                <span className={styles.contador}>{cardsDaColuna.length}</span>
                                <button className={styles.acaoMini} onClick={() => { setColunaEditandoId(coluna.id); setNomeEditColuna(coluna.nome); }} title="Renomear coluna">✎</button>
                                <button className={styles.acaoMini} onClick={() => deletaColuna(coluna.id)} disabled={salvando} title="Excluir coluna (precisa estar vazia)">✕</button>
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

                <div className={styles.adicionaColuna}>
                    {adicionandoColuna ? (
                        <div className={styles.formColuna}>
                            <input className={styles.entradaNovaColuna} value={nomeNovaColuna} autoFocus placeholder="Digite o nome da coluna…" onChange={evento => setNomeNovaColuna(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') submeteNovaColuna(); if (evento.key === 'Escape') { setAdicionandoColuna(false); setNomeNovaColuna(''); } }} />
                            <div className={styles.formColunaAcoes}>
                                <button className={styles.adicionaColunaBtn} onClick={submeteNovaColuna} disabled={salvando || !nomeNovaColuna.trim()}>Adicionar coluna</button>
                                <button className={styles.fecharForm} onClick={() => { setAdicionandoColuna(false); setNomeNovaColuna(''); }} title="Fechar">✕</button>
                            </div>
                        </div>
                    ) : (
                        <button className={styles.placeholderColuna} onClick={() => setAdicionandoColuna(true)}>+ {colunas.registros.length === 0 ? 'Adicionar uma coluna' : 'Adicionar outra coluna'}</button>
                    )}
                </div>
            </div>

            {cardAberto && <ModalCard key={cardAberto.id} card={cardAberto} status={statusCards.registros} comentarios={comentarios} salvando={salvando} onSalvar={atualizaCard} onComentar={criaComentario} onFechar={fecharCard} />}
        </section>
    );
};
