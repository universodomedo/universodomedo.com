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
    const { card, salvando, podeIncluir, podeRemover, motivoTrancaCard, motivoTrancaObjetivo, podeTrancar, abrirTrancarCartao, destrancar, editarTitulo, atualizarDescricao, abrirAplicarEtiqueta, abrirAdicionarItemChecklist, abrirCardPorId, cardsMencionaveis, membros, adicionarMembro, removerMembro, etiquetasDoCard, removerEtiqueta, feed, comentar, anexosPorComentario, checklist, marcaItemChecklist, deletaItemChecklist, resolveReferenciaChecklist, transformarItemEmCard, abrirVincularCard, cardsQueReferenciam, tituloCard, defineDadosNaoSalvos } = useContexto__PaginaColaboradorPainelDoMedo__FichaCard();

    const [novoComentario, setNovoComentario] = useState('');
    const [descricaoDraft, setDescricaoDraft] = useState<JSONContent | null>(null);
    const [anexosPendentes, setAnexosPendentes] = useState<readonly AnexoEvidencia[]>([]);
    const [imagemAmpliada, setImagemAmpliada] = useState<string | null>(null);
    const arquivoRef = useRef<HTMLInputElement | null>(null);

    // Pulo entre cards por referência (#id) não remonta a SPA: ressincroniza os estados locais do composer/descrição.
    useEffect(() => { setNovoComentario(''); setDescricaoDraft(null); setAnexosPendentes([]); setImagemAmpliada(null); }, [card.id]);

    // Rascunhos da ficha registrados no guard global: qualquer navegação que descartaria comentário/evidência/descrição em edição pede confirmação (fechar, trocar de card, abrir operação); beforeunload cobre fechar/atualizar a aba.
    const temRascunho = novoComentario.trim() !== '' || anexosPendentes.length > 0 || descricaoDraft !== null;
    useEffect(() => {
        defineDadosNaoSalvos(temRascunho ? 'comentário, evidência ou descrição em edição' : null);
        return () => defineDadosNaoSalvos(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temRascunho]);

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

    // Feed em BLOCOS de grupo (autor consecutivo): avatar no topo + linha vertical continua ao lado das mensagens — segmento por linha quebrava no gap da lista.
    const gruposFeed: { chave: string; usuarioId: number; username: string; itens: typeof feed }[] = [];
    feed.forEach(item => {
        const ultimo = gruposFeed[gruposFeed.length - 1];
        if (ultimo && ultimo.usuarioId === item.usuarioId) ultimo.itens.push(item);
        else gruposFeed.push({ chave: item.chave, usuarioId: item.usuarioId, username: item.username, itens: [item] });
    });

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
                            <SecaoChecklist itens={checklist.registros} carregando={checklist.carregando} salvando={salvando} onAdicionar={podeIncluir ? abrirAdicionarItemChecklist : undefined} onMarcar={podeIncluir ? marcaItemChecklist : undefined} onExcluir={podeRemover ? deletaItemChecklist : undefined} resolveReferencia={resolveReferenciaChecklist} onTransformarEmCard={podeIncluir ? transformarItemEmCard : undefined} onVincular={podeIncluir ? abrirVincularCard : undefined} aoAbrirCardReferencia={abrirCardPorId} />
                        </section>

                        {cardsQueReferenciam.length > 0 && (
                            <section className={styles.painelSecao}>
                                <span className={styles.rotuloSecao}>Faz parte de</span>
                                <span className={styles.dicaGestao}>Este cartão é item de checklist de:</span>
                                {cardsQueReferenciam.map(pai => (
                                    <button key={pai.cardId} className={styles.itemCardPai} onClick={() => abrirCardPorId(pai.cardId)} title={`Abrir cartão #${pai.cardId}`}>
                                        <span className={styles.chipCartaoPai}>Cartão</span>
                                        <span className={styles.textoCardPai}>{pai.titulo}{pai.rotuloObjetivo ? ` ↗ ${pai.rotuloObjetivo}` : ''}</span>
                                        <span className={styles.setaCardPai}>↗</span>
                                    </button>
                                ))}
                            </section>
                        )}

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
                            {gruposFeed.map(grupo => (
                                <div key={grupo.chave} className={styles.grupoFeed}>
                                    <div className={styles.colunaGrupoFeed}>
                                        <span className={styles.avatarFeed} title={grupo.username}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={grupo.usuarioId} /></span>
                                        <span className={styles.linhaGrupoFeed} />
                                    </div>
                                    <div className={styles.mensagensGrupoFeed}>
                                        {grupo.itens.map(item => {
                                            const anexos = item.comentarioId !== null ? (anexosPorComentario.get(item.comentarioId) ?? []) : [];
                                            // Comentario sem texto e sem anexos = era so-imagem e as evidencias foram descartadas no trancamento (o composer nao deixa enviar comentario vazio).
                                            const imagemRemovida = item.tipo === 'comentario' && !item.texto.trim() && anexos.length === 0;
                                            return (
                                            <div key={item.chave} className={item.tipo === 'comentario' ? styles.feedComentario : styles.feedEvento} title={`${item.username} · ${new Date(item.data).toLocaleString('pt-BR')}`}>
                                                <div className={styles.feedCorpo}>
                                                    {imagemRemovida
                                                        ? <div className={styles.imagemRemovida}>Imagem removida após o trancamento do cartão</div>
                                                        : <div><TextoComReferencias texto={item.texto} aoAbrirCard={abrirCardPorId} tituloCard={tituloCard} /></div>}
                                                    {anexos.length > 0 && (
                                                        <div className={styles.galeriaEvidencias}>
                                                            {anexos.map(anexo => (
                                                                <img key={anexo.id} className={styles.thumbFeed} src={`data:${anexo.mime};base64,${anexo.dadosBase64}`} alt="Evidência" onClick={() => setImagemAmpliada(`data:${anexo.mime};base64,${anexo.dadosBase64}`)} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
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
                </ConteudoForm.AreaBotoes>
            )}
        </ConteudoForm>
    );
};
