'use client';

import { useState } from 'react';

import styles from './ModalCard.module.css';

import { useContexto__PaginaColaboradorPainelDoMedo, Contexto__PaginaColaboradorPainelDoMedo__Props } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';

type CardItem = Contexto__PaginaColaboradorPainelDoMedo__Props['cards']['registros'][number];
type StatusItem = Contexto__PaginaColaboradorPainelDoMedo__Props['statusCards']['registros'][number];
type ComentariosListagem = Contexto__PaginaColaboradorPainelDoMedo__Props['comentarios'];

export default function ModalCard({ card, status, comentarios, salvando, onSalvar, onComentar, onFechar }: {
    card: CardItem;
    status: readonly StatusItem[];
    comentarios: ComentariosListagem;
    salvando: boolean;
    onSalvar: (id: number, titulo: string, fkTiposStatusCardId: number, prazo: string | null) => Promise<void>;
    onComentar: (texto: string) => Promise<void>;
    onFechar: () => void;
}) {
    const { dependenciasCards, todosCards, objetivos, criaDependenciaCard, deletaDependenciaCard, deletaCard } = useContexto__PaginaColaboradorPainelDoMedo();

    const [titulo, setTitulo] = useState<string>(card.titulo);
    const [statusId, setStatusId] = useState<number>(card.fkTiposStatusCardId);
    const [prazo, setPrazo] = useState<string>(card.prazo ? new Date(card.prazo).toISOString().slice(0, 10) : '');
    const [novoComentario, setNovoComentario] = useState<string>('');
    const [buscaDep, setBuscaDep] = useState<string>('');
    const [confirmandoExcluir, setConfirmandoExcluir] = useState<boolean>(false);

    const salvar = () => onSalvar(card.id, titulo, statusId, prazo ? prazo : null);
    const comentar = async () => { await onComentar(novoComentario); setNovoComentario(''); };

    const tituloCard = (id: number) => todosCards.registros.find(c => c.id === id)?.titulo ?? '?';
    const objetivoDoCard = (id: number) => todosCards.registros.find(c => c.id === id)?.fkObjetivosId ?? null;
    const objetivoNome = (id: number) => objetivos.registros.find(o => o.id === id)?.nome ?? '';
    const meuObjetivo = objetivoDoCard(card.id);
    const requisitos = dependenciasCards.registros.filter(d => d.fkCardsDependenteId === card.id);
    const jaRequisitos = new Set(requisitos.map(d => d.fkCardsRequisitoId));
    const busca = buscaDep.trim().toLowerCase();
    const candidatos = busca ? todosCards.registros.filter(c => c.id !== card.id && !jaRequisitos.has(c.id) && c.titulo.toLowerCase().includes(busca)).slice(0, 8) : [];

    return (
        <div className={styles.overlay} onClick={evento => { if (evento.target === evento.currentTarget) onFechar(); }}>
            <div className={styles.modal}>
                <header className={styles.cabecalho}>
                    <input className={styles.titulo} value={titulo} onChange={evento => setTitulo(evento.target.value)} />
                    <button className={styles.fechar} onClick={onFechar} title="Fechar">✕</button>
                </header>

                <div className={styles.campos}>
                    <label className={styles.campo}>
                        <span>Status</span>
                        <select value={statusId} onChange={evento => setStatusId(Number(evento.target.value))}>
                            {status.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
                        </select>
                    </label>
                    <label className={styles.campo}>
                        <span>Prazo</span>
                        <input type="date" value={prazo} onChange={evento => setPrazo(evento.target.value)} />
                    </label>
                    <button className={styles.salvar} onClick={salvar} disabled={salvando || !titulo.trim()}>{salvando ? 'Salvando…' : 'Salvar'}</button>
                </div>

                <div className={styles.comentarios}>
                    <span className={styles.rotulo}>Comentários</span>
                    {comentarios.carregando && <p className={styles.estado}>{comentarios.carregando}</p>}
                    {!comentarios.carregando && comentarios.registros.length === 0 && <p className={styles.estado}>Nenhum comentário ainda.</p>}
                    {comentarios.registros.map(comentario => (
                        <div key={comentario.id} className={styles.comentario}>
                            <div className={styles.autor}>{comentario.usuarioCriacao.username} · {new Date(comentario.dataCriacao).toLocaleString('pt-BR')}</div>
                            <div>{comentario.texto}</div>
                        </div>
                    ))}
                    <div className={styles.novoComentario}>
                        <textarea value={novoComentario} onChange={evento => setNovoComentario(evento.target.value)} placeholder="Escreva um comentário…" rows={2} />
                        <button className={styles.salvar} onClick={comentar} disabled={salvando || !novoComentario.trim()}>Comentar</button>
                    </div>
                </div>

                <div className={styles.comentarios}>
                    <span className={styles.rotulo}>Dependências (este card precisa de)</span>
                    {requisitos.length === 0 && <p className={styles.estado}>Nenhuma dependência.</p>}
                    {requisitos.map(dep => {
                        const objId = objetivoDoCard(dep.fkCardsRequisitoId);
                        return (
                            <div key={dep.id} className={styles.depItem}>
                                <span>{dep.bloqueante ? '🔒 ' : ''}{tituloCard(dep.fkCardsRequisitoId)}{objId !== null && objId !== meuObjetivo ? ` ↗ ${objetivoNome(objId)}` : ''}</span>
                                <button className={styles.depRemover} onClick={() => deletaDependenciaCard(dep.id)} disabled={salvando} title="Remover dependência">✕</button>
                            </div>
                        );
                    })}
                    <input className={styles.depBusca} value={buscaDep} onChange={evento => setBuscaDep(evento.target.value)} placeholder="Adicionar dependência — buscar card (qualquer objetivo)…" />
                    {candidatos.length > 0 && (
                        <div className={styles.depLista}>
                            {candidatos.map(c => (
                                <button key={c.id} className={styles.depCandidato} onClick={() => { criaDependenciaCard(card.id, c.id, null, true); setBuscaDep(''); }} disabled={salvando}>
                                    <span>{c.titulo}</span>
                                    {c.fkObjetivosId !== meuObjetivo && <span className={styles.depObjetivo}>↗ {objetivoNome(c.fkObjetivosId)}</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.rodapeModal}>
                    {!confirmandoExcluir && <button className={styles.excluirCard} onClick={() => setConfirmandoExcluir(true)} disabled={salvando}>Excluir card</button>}
                    {confirmandoExcluir && (
                        <div className={styles.confirmaExcluir}>
                            <span>Excluir o card, seus comentários e dependências?</span>
                            <button className={styles.excluirCard} onClick={() => deletaCard(card.id)} disabled={salvando}>Sim, excluir</button>
                            <button className={styles.botaoCancelar} onClick={() => setConfirmandoExcluir(false)} disabled={salvando}>Cancelar</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
