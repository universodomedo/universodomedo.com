'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { JSONContent } from '@tiptap/react';
import type { AnexoEvidencia } from 'types-nora-api';

import styles from './styles.module.css';

import InputTextoTiptap from 'Componentes/Elementos/Tiptap/InputTextoTiptap/InputTextoTiptap';
import VisualizadorConteudoTiptap from 'Componentes/Elementos/Tiptap/VisualizadorConteudoTiptap/VisualizadorConteudoTiptap';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { SelecionadorUsuarioEmCacheDropdown } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorUsuarioEmCache/SelecionadorUsuarioEmCache';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import SecaoChecklist from 'Conteineres/PaginaColaboradorPainelDoMedo/componentes/SecaoChecklist';
import CampoComentarioComMencao from 'Conteineres/PaginaColaboradorPainelDoMedo/componentes/CampoComentarioComMencao';
import TextoComReferencias from 'Conteineres/PaginaColaboradorPainelDoMedo/componentes/TextoComReferencias';
import { comprimeImagemEvidencia } from 'Uteis/ImagemEvidencia/comprimeImagemEvidencia';
import { useContexto__PaginaColaboradorPainelDoMedo__FichaCard } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__FichaCard/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__FichaCard() {
    const { card, salvando, podeIncluir, podeRemover, motivoTrancaCard, motivoTrancaObjetivo, podeTrancar, abrirTrancarCartao, destrancar, editarTitulo, atualizarDescricao, abrirAplicarEtiqueta, abrirAdicionarItemChecklist, abrirAdicionarDependencia, excluir, abrirCardPorId, cardsMencionaveis, membros, adicionarMembro, removerMembro, etiquetasDoCard, removerEtiqueta, feed, comentar, anexosPorComentario, checklist, marcaItemChecklist, deletaItemChecklist, requisitos, removeDependencia, tituloCard, rotuloObjetivoDoCard } = useContexto__PaginaColaboradorPainelDoMedo__FichaCard();

    const [novoComentario, setNovoComentario] = useState('');
    const [confirmandoExcluir, setConfirmandoExcluir] = useState(false);
    const [descricaoDraft, setDescricaoDraft] = useState<JSONContent | null>(null);
    const [anexosPendentes, setAnexosPendentes] = useState<readonly AnexoEvidencia[]>([]);
    const [imagemAmpliada, setImagemAmpliada] = useState<string | null>(null);
    const arquivoRef = useRef<HTMLInputElement | null>(null);

    // Pulo entre cards por referência (#id) não remonta a SPA: ressincroniza os estados locais do composer/descrição.
    useEffect(() => { setNovoComentario(''); setConfirmandoExcluir(false); setDescricaoDraft(null); setAnexosPendentes([]); setImagemAmpliada(null); }, [card.id]);

    // Evidencias: compressao obrigatoria no cliente (max 1600px, WebP) antes de entrar na fila; max 5 por comentário.
    const adicionaEvidencias = async (arquivos: File[]) => {
        for (const arquivo of arquivos) {
            const comprimida = await comprimeImagemEvidencia(arquivo);
            setAnexosPendentes(atual => atual.length >= 5 ? atual : [...atual, comprimida]);
        }
    };

    // Descricao persiste como JSON Tiptap serializado; conteudo antigo/nao-JSON cai no fallback de texto puro.
    const conteudoDescricao = useMemo<JSONContent | null>(() => {
        if (!card.descricao) return null;
        try { return JSON.parse(card.descricao) as JSONContent; } catch { return null; }
    }, [card.descricao]);

    const enviaComentario = async () => {
        if (!novoComentario.trim() && anexosPendentes.length === 0) return;
        await comentar(novoComentario, anexosPendentes);
        setNovoComentario('');
        setAnexosPendentes([]);
    };
    const enviaDescricao = async () => { if (descricaoDraft === null) return; await atualizarDescricao(JSON.stringify(descricaoDraft)); setDescricaoDraft(null); };

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                {(motivoTrancaObjetivo !== null || motivoTrancaCard !== null) && (
                    <div className={`${styles.faixaTranca} ${(motivoTrancaObjetivo ?? motivoTrancaCard) === 'CONCLUIDO' ? styles.faixaTrancaConcluido : styles.faixaTrancaInterrompido}`}>
                        🔒 {motivoTrancaObjetivo !== null ? `Objetivo ${motivoTrancaObjetivo === 'CONCLUIDO' ? 'Concluído' : 'Interrompido'}` : `Cartão ${motivoTrancaCard === 'CONCLUIDO' ? 'Concluído' : 'Interrompido'}`} — somente leitura
                    </div>
                )}
                <div className={styles.duasColunas}>
                    <div className={styles.colunaPrincipal}>
                        <div className={styles.linhaPaineis}>
                            <section className={styles.painelSecao}>
                                <span className={styles.rotuloSecao}>Membros</span>
                                <div className={styles.linhaChips}>
                                    {membros.length === 0 && <span className={styles.estado}>Ninguém participando ainda.</span>}
                                    {membros.map(membro => (
                                        <span key={membro.usuarioId} className={`${styles.membro} ${membro.criador ? styles.membroCriador : ''}`} title={membro.criador ? `${membro.username} · criador do card (membro obrigatório)` : membro.username}>
                                            <span className={styles.avatarMembro}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={membro.usuarioId} /></span>
                                            <span className={styles.nomeMembro}>{membro.username}</span>
                                            {membro.criador && <span className={styles.seloCriador}>★</span>}
                                            {podeRemover && membro.vinculoId !== null && <button className={styles.removerChip} onClick={() => removerMembro(membro.vinculoId as number)} disabled={salvando} title="Remover membro">✕</button>}
                                        </span>
                                    ))}
                                    {podeIncluir && <SelecionadorUsuarioEmCacheDropdown gatilho={<button className={styles.chipMais} title="Adicionar membro">+</button>} idsExcluidos={membros.map(membro => membro.usuarioId)} onSelectIdUsuario={adicionarMembro} />}
                                </div>
                            </section>

                            <section className={styles.painelSecao}>
                                <span className={styles.rotuloSecao}>Etiquetas</span>
                                <div className={styles.linhaChips}>
                                    {etiquetasDoCard.length === 0 && <span className={styles.estado}>Nenhuma etiqueta aplicada.</span>}
                                    {etiquetasDoCard.map(etiqueta => (
                                        <span key={etiqueta.vinculoId} className={styles.etiqueta} style={{ background: etiqueta.cor, border: `0.12em solid ${etiqueta.corBorda}` }}>
                                            {etiqueta.nome}
                                            {podeRemover && <button className={styles.removerChip} onClick={() => removerEtiqueta(etiqueta.vinculoId)} disabled={salvando} title="Remover etiqueta">✕</button>}
                                        </span>
                                    ))}
                                    {podeIncluir && <button className={styles.chipMais} onClick={abrirAplicarEtiqueta} title="Aplicar etiqueta">+</button>}
                                </div>
                            </section>
                        </div>

                        <section className={styles.painelSecao}>
                            <span className={styles.rotuloSecao}>Descrição</span>
                            {podeIncluir ? (
                                <>
                                    <InputTextoTiptap key={card.id} conteudo={conteudoDescricao} onChange={setDescricaoDraft} />
                                    <button className={styles.comentarBtn} onClick={enviaDescricao} disabled={salvando || descricaoDraft === null}>Atualizar</button>
                                </>
                            ) : conteudoDescricao ? (
                                <VisualizadorConteudoTiptap conteudo={conteudoDescricao} />
                            ) : card.descricao ? (
                                <p className={styles.textoDescricao}>{card.descricao}</p>
                            ) : (
                                <p className={styles.estado}>Sem descrição ainda.</p>
                            )}
                        </section>

                        <section className={styles.painelSecao}>
                            <SecaoChecklist itens={checklist.registros} carregando={checklist.carregando} salvando={salvando} onAdicionar={podeIncluir ? abrirAdicionarItemChecklist : undefined} onMarcar={podeIncluir ? marcaItemChecklist : undefined} onExcluir={podeRemover ? deletaItemChecklist : undefined} />
                        </section>

                        <section className={styles.painelSecao}>
                            <span className={styles.rotuloSecao}>Dependências</span>
                            <span className={styles.dicaGestao}>Este card precisa de:</span>
                            {requisitos.length === 0 && <p className={styles.estado}>Nenhuma dependência.</p>}
                            {requisitos.map(dependencia => (
                                <div key={dependencia.id} className={styles.itemDependencia}>
                                    <span>{dependencia.bloqueante ? '🔒 ' : ''}{tituloCard(dependencia.fkCardsRequisitoId)}{rotuloObjetivoDoCard(dependencia.fkCardsRequisitoId) ? ` ↗ ${rotuloObjetivoDoCard(dependencia.fkCardsRequisitoId)}` : ''}</span>
                                    {podeRemover && <button className={styles.removerChip} onClick={() => removeDependencia(dependencia.id)} disabled={salvando} title="Remover dependência">✕</button>}
                                </div>
                            ))}
                            {podeIncluir && <button className={styles.adicionarLinha} onClick={abrirAdicionarDependencia}>+ Adicionar dependência</button>}
                        </section>
                    </div>

                    <aside className={styles.colunaFeed}>
                        <span className={styles.rotuloSecao}>Comentários e atividade</span>
                        {podeIncluir && (
                            <div className={styles.novoComentario}>
                                <CampoComentarioComMencao valor={novoComentario} aoMudar={setNovoComentario} placeholder="Escrever um comentário… (@nome marca usuário · #id referencia card · Ctrl+V cola print)" desabilitado={salvando} cardsMencionaveis={cardsMencionaveis} aoColarImagens={arquivos => void adicionaEvidencias(arquivos)} />
                                {anexosPendentes.length > 0 && (
                                    <div className={styles.evidenciasPendentes}>
                                        {anexosPendentes.map((anexo, indice) => (
                                            <span key={indice} className={styles.thumbPendente}>
                                                <img src={`data:${anexo.mime};base64,${anexo.dadosBase64}`} alt="Evidência pendente" onClick={() => setImagemAmpliada(`data:${anexo.mime};base64,${anexo.dadosBase64}`)} />
                                                <button className={styles.removerChip} onClick={() => setAnexosPendentes(atual => atual.filter((_, i) => i !== indice))} title="Remover evidência">✕</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className={styles.acoesComentario}>
                                    <input ref={arquivoRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={evento => { void adicionaEvidencias(Array.from(evento.target.files ?? [])); evento.target.value = ''; }} />
                                    <button className={styles.anexarBtn} onClick={() => arquivoRef.current?.click()} disabled={salvando || anexosPendentes.length >= 5} title="Anexar evidência (imagem) — descartada quando o cartão trancar">📎 Evidência</button>
                                    <button className={styles.comentarBtn} onClick={enviaComentario} disabled={salvando || (!novoComentario.trim() && anexosPendentes.length === 0)}>Comentar</button>
                                </div>
                            </div>
                        )}
                        <div className={styles.listaFeed}>
                            {feed.length === 0 && <p className={styles.estado}>Nenhuma atividade ainda.</p>}
                            {feed.map((item, indice) => {
                                // Agrupamento estilo Chat: sequencia do mesmo usuario mostra o avatar so na entrada mais atual (a lista e mais-novo-primeiro).
                                const mostraAvatar = indice === 0 || feed[indice - 1].usuarioId !== item.usuarioId;
                                return (
                                <div key={item.chave} className={item.tipo === 'comentario' ? styles.feedComentario : styles.feedEvento}>
                                    {mostraAvatar
                                        ? <span className={styles.avatarFeed} title={item.username}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={item.usuarioId} /></span>
                                        : <span className={styles.avatarFeedVazio} />}
                                    <div className={styles.feedCorpo}>
                                        <div><strong>{item.username}</strong>{item.tipo === 'comentario' ? ': ' : ' '}<TextoComReferencias texto={item.texto} aoAbrirCard={abrirCardPorId} tituloCard={tituloCard} /></div>
                                        {item.comentarioId !== null && (anexosPorComentario.get(item.comentarioId)?.length ?? 0) > 0 && (
                                            <div className={styles.galeriaEvidencias}>
                                                {(anexosPorComentario.get(item.comentarioId) ?? []).map(anexo => (
                                                    <img key={anexo.id} className={styles.thumbFeed} src={`data:${anexo.mime};base64,${anexo.dadosBase64}`} alt="Evidência" onClick={() => setImagemAmpliada(`data:${anexo.mime};base64,${anexo.dadosBase64}`)} />
                                                ))}
                                            </div>
                                        )}
                                        <div className={styles.feedData}>{new Date(item.data).toLocaleString('pt-BR')}</div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </aside>
                </div>
                {imagemAmpliada && (
                    <div className={styles.lightbox} onClick={() => setImagemAmpliada(null)}>
                        <img src={imagemAmpliada} alt="Evidência ampliada" />
                    </div>
                )}
            </ConteudoForm.AreaCorpo>

            {podeTrancar && motivoTrancaCard !== null && (
                <ConteudoForm.AreaBotoes>
                    <button type="button" onClick={destrancar} disabled={salvando}>Destrancar cartão</button>
                </ConteudoForm.AreaBotoes>
            )}
            {podeRemover && (
                <ConteudoForm.AreaBotoes>
                    <button type="button" onClick={editarTitulo} disabled={salvando}>Editar Título</button>
                    <button type="button" onClick={abrirTrancarCartao} disabled={salvando}>Trancar Cartão</button>
                    {!confirmandoExcluir && <button type="button" data-variante="perigo" onClick={() => setConfirmandoExcluir(true)} disabled={salvando}>Excluir card</button>}
                    {confirmandoExcluir && <button type="button" data-variante="perigo" onClick={excluir} disabled={salvando}>Confirmar exclusão</button>}
                    {confirmandoExcluir && <button type="button" data-variante="secundario" onClick={() => setConfirmandoExcluir(false)} disabled={salvando}>Cancelar</button>}
                </ConteudoForm.AreaBotoes>
            )}
        </ConteudoForm>
    );
};
