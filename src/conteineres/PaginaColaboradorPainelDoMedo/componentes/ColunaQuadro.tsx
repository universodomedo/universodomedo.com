'use client';

import { useState } from 'react';

import styles from './ColunaQuadro.module.css';

import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import { Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';

type MembroMini = { id: number; username: string };

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];
type ColunaItem = Contexto__PaginaColaboradorPainelDoMedo__Props['colunas']['registros'][number];

export default function ColunaQuadro({ coluna, cards, ehAlvo, cardArrastadoId, salvando, travado, podeCriarCard, etiquetasPorCard, checklistPorCard, membrosPorCard, aoIniciarArrasteColuna, aoTerminarArrasteColuna, aoSoltarColuna, aoEntrarNaLista, aoSoltarNaLista, aoSoltarNoCard, aoIniciarArrasteCard, aoTerminarArrasteCard, aoAbrirCard, aoCriarCard, aoArrastarSobreLista, insercaoAntesDoCardId }: {
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
    // Indicador de insercao do arraste: o dragover da LISTA calcula o ponto pelo meio de cada cartao (estavel — a barra e absoluta e nao desloca layout) e reporta diante de qual cartao o arrastado entra (null = fim; undefined = sem indicador nesta coluna).
    aoArrastarSobreLista: (antesDoCardId: number | null) => void;
    insercaoAntesDoCardId: number | null | undefined;
}) {
    const [adicionandoCard, setAdicionandoCard] = useState(false);
    const [novoTitulo, setNovoTitulo] = useState('');

    const submeteCard = async () => { if (!novoTitulo.trim()) return; await aoCriarCard(novoTitulo); setNovoTitulo(''); };

    return (
        // Arraste de CARD: a coluna inteira e zona valida (preventDefault + dropEffect 'move' via bubbling de todos os filhos). Sem isso, vaos/botao/padding sem handler viram "zona morta" e o cursor flicka entre mover/bloqueado mesmo com o mouse parado (dragover HTML5 dispara em rajada). Drop numa zona morta cai aqui e vai pro ponto rastreado (fim, se nenhum). Guard por cardArrastadoId nao interfere no reorder de coluna.
        <div
            className={`${styles.coluna} ${ehAlvo ? styles.colunaAlvo : ''}`}
            onDragEnter={evento => { if (cardArrastadoId === null) return; evento.preventDefault(); }}
            onDragOver={evento => { if (cardArrastadoId === null) return; evento.preventDefault(); if (evento.dataTransfer) evento.dataTransfer.dropEffect = 'move'; }}
            onDrop={evento => { if (cardArrastadoId === null) return; evento.preventDefault(); aoSoltarNaLista(); }}
        >
            <div className={styles.cabecalho} draggable={!travado} onDragStart={aoIniciarArrasteColuna} onDragEnd={aoTerminarArrasteColuna} onDragOver={evento => evento.preventDefault()} onDrop={aoSoltarColuna}>
                <span className={styles.nome}>{coluna.nome}</span>
                <span className={styles.contador}>{cards.length}</span>
            </div>

            <div className={styles.lista} onDragOver={evento => {
                evento.preventDefault();
                aoEntrarNaLista();
                // Ponto de insercao estavel: primeiro cartao (ignorando o arrastado) cujo MEIO esta abaixo do ponteiro; nenhum = fim. Vaos entre cartoes resolvem pro cartao logo abaixo.
                let antesDoCardId: number | null = null;
                for (const alvo of evento.currentTarget.querySelectorAll('[data-card-id]')) {
                    const idCard = Number(alvo.getAttribute('data-card-id'));
                    if (idCard === cardArrastadoId) continue;
                    const retangulo = alvo.getBoundingClientRect();
                    if (evento.clientY < retangulo.top + retangulo.height / 2) { antesDoCardId = idCard; break; }
                }
                aoArrastarSobreLista(antesDoCardId);
            }} onDrop={evento => { evento.stopPropagation(); aoSoltarNaLista(); }}>
                {cards.map((card, indice) => {
                    const etiquetas = etiquetasPorCard.get(card.id) ?? [];
                    const progresso = checklistPorCard.get(card.id) ?? null;
                    const membros = membrosPorCard.get(card.id) ?? [];
                    const trancado = card.motivoTranca !== null;
                    return (
                        <div key={card.id} data-card-id={card.id} className={`${styles.card} ${cardArrastadoId === card.id ? styles.cardArrastando : ''} ${trancado ? styles.cardTrancado : ''}`} draggable={!travado && !trancado} onDragStart={() => aoIniciarArrasteCard(card.id)} onDragEnd={aoTerminarArrasteCard} onDragOver={evento => evento.preventDefault()} onDrop={evento => { evento.stopPropagation(); aoSoltarNoCard(card.id); }} onClick={() => aoAbrirCard(card.id)}>
                            {insercaoAntesDoCardId === card.id && <div className={styles.indicadorInsercao} />}
                            {insercaoAntesDoCardId === null && indice === cards.length - 1 && <div className={styles.indicadorInsercaoFim} />}
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
                {cards.length === 0 && insercaoAntesDoCardId === null && <div className={styles.indicadorInsercaoVazia} />}
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
