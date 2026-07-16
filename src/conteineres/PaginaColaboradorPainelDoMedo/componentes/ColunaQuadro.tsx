'use client';

import { useState } from 'react';

import styles from './ColunaQuadro.module.css';

import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import { Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';

type MembroMini = { id: number; username: string };

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];
type ColunaItem = Contexto__PaginaColaboradorPainelDoMedo__Props['colunas']['registros'][number];

export default function ColunaQuadro({ coluna, cards, ehAlvo, cardArrastadoId, salvando, travado, podeCriarCard, etiquetasPorCard, checklistPorCard, membrosPorCard, aoIniciarArrasteColuna, aoTerminarArrasteColuna, aoSoltarColuna, aoEntrarNaLista, aoSoltarNaLista, aoSoltarNoCard, aoIniciarArrasteCard, aoTerminarArrasteCard, aoAbrirCard, aoCriarCard }: {
    coluna: ColunaItem;
    cards: readonly CardItem[];
    ehAlvo: boolean;
    travado: boolean;
    podeCriarCard: boolean;
    etiquetasPorCard: ReadonlyMap<number, readonly { cor: string; corBorda: string }[]>;
    checklistPorCard: ReadonlyMap<number, { feitos: number; total: number }>;
    membrosPorCard: ReadonlyMap<number, readonly MembroMini[]>;
    cardArrastadoId: number | null;
    salvando: boolean;
    aoIniciarArrasteColuna: () => void;
    aoTerminarArrasteColuna: () => void;
    aoSoltarColuna: () => void;
    aoEntrarNaLista: () => void;
    aoSoltarNaLista: () => void;
    aoSoltarNoCard: (cardId: number) => void;
    aoIniciarArrasteCard: (cardId: number) => void;
    aoTerminarArrasteCard: () => void;
    aoAbrirCard: (cardId: number) => void;
    aoCriarCard: (titulo: string) => Promise<void>;
}) {
    const [adicionandoCard, setAdicionandoCard] = useState(false);
    const [novoTitulo, setNovoTitulo] = useState('');

    const submeteCard = async () => { if (!novoTitulo.trim()) return; await aoCriarCard(novoTitulo); setNovoTitulo(''); };

    return (
        <div className={`${styles.coluna} ${ehAlvo ? styles.colunaAlvo : ''}`}>
            <div className={styles.cabecalho} draggable={!travado} onDragStart={aoIniciarArrasteColuna} onDragEnd={aoTerminarArrasteColuna} onDragOver={evento => evento.preventDefault()} onDrop={aoSoltarColuna}>
                <span className={styles.nome}>{coluna.nome}</span>
                <span className={styles.contador}>{cards.length}</span>
            </div>

            <div className={styles.lista} onDragOver={evento => { evento.preventDefault(); aoEntrarNaLista(); }} onDrop={aoSoltarNaLista}>
                {cards.map(card => {
                    const etiquetas = etiquetasPorCard.get(card.id) ?? [];
                    const progresso = checklistPorCard.get(card.id) ?? null;
                    const membros = membrosPorCard.get(card.id) ?? [];
                    const trancado = card.motivoTranca !== null;
                    return (
                        <div key={card.id} className={`${styles.card} ${cardArrastadoId === card.id ? styles.cardArrastando : ''} ${trancado ? styles.cardTrancado : ''}`} draggable={!travado && !trancado} onDragStart={() => aoIniciarArrasteCard(card.id)} onDragEnd={aoTerminarArrasteCard} onDragOver={evento => evento.preventDefault()} onDrop={evento => { evento.stopPropagation(); aoSoltarNoCard(card.id); }} onClick={() => aoAbrirCard(card.id)}>
                            {trancado && <span className={`${styles.seloTranca} ${card.motivoTranca === 'CONCLUIDO' ? styles.seloTrancaConcluido : styles.seloTrancaInterrompido}`}>🔒 {card.motivoTranca === 'CONCLUIDO' ? 'Concluído' : 'Interrompido'}</span>}
                            {etiquetas.length > 0 && <span className={styles.barrasEtiqueta}>{etiquetas.map((etiqueta, indice) => <span key={indice} className={styles.barraEtiqueta} style={{ background: etiqueta.cor, border: `0.1em solid ${etiqueta.corBorda}` }} />)}</span>}
                            <span className={styles.cardTitulo}>{card.titulo}</span>
                            {(progresso !== null && progresso.total > 0 || membros.length > 0) && (
                                <span className={styles.cardRodape}>
                                    {progresso !== null && progresso.total > 0 && <span className={`${styles.badgeChecklist} ${progresso.feitos === progresso.total ? styles.badgeChecklistCompleta : ''}`}>☑ {progresso.feitos}/{progresso.total}</span>}
                                    <span className={styles.avatarsMini}>{membros.map(membro => <span key={membro.id} className={styles.avatarMini} title={membro.username}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={membro.id} /></span>)}</span>
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {!travado && podeCriarCard && <div className={styles.adicionarCard}>
                {adicionandoCard ? (
                    <div className={styles.formCard}>
                        <input className={styles.entradaNovoCard} autoFocus placeholder="Digite o título do cartão…" value={novoTitulo} onChange={evento => setNovoTitulo(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') submeteCard(); if (evento.key === 'Escape') { setAdicionandoCard(false); setNovoTitulo(''); } }} disabled={salvando} />
                        <div className={styles.formCardAcoes}>
                            <button className={styles.adicionaCardBtn} onClick={submeteCard} disabled={salvando || !novoTitulo.trim()}>Adicionar cartão</button>
                            <button className={styles.fecharForm} onClick={() => { setAdicionandoCard(false); setNovoTitulo(''); }} title="Fechar">✕</button>
                        </div>
                    </div>
                ) : (
                    <button className={styles.placeholderCard} onClick={() => setAdicionandoCard(true)}>+ Adicionar um cartão</button>
                )}
            </div>}
        </div>
    );
};
