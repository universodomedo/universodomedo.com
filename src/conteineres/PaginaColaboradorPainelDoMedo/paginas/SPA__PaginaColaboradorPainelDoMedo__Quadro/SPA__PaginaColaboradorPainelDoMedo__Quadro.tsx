'use client';

import { useMemo, useState } from 'react';

import styles from './styles.module.css';

import { CAPACIDADES } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { useContexto__PaginaColaboradorPainelDoMedo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo/contexto';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import BarraView from 'Conteineres/PaginaColaboradorPainelDoMedo/componentes/BarraView';
import ColunaQuadro from 'Conteineres/PaginaColaboradorPainelDoMedo/componentes/ColunaQuadro';

export default function SPA__PaginaColaboradorPainelDoMedo__Quadro() {
    const { pagina, setPagina, objetivos, objetivoAtualId, colunas, cards, abrirCard, salvando, criaColuna, criaCard, reordenaCards, reordenaColunas, etiquetas, etiquetasCards, membrosCards, itensChecklistQuadro, permissoesObjetivos, abrirOperacaoObjetivo } = useContexto__PaginaColaboradorPainelDoMedo();
    const { usuarioLogado, verificarCapacidade } = useContextoAutenticacao();

    const [cardArrastadoId, setCardArrastadoId] = useState<number | null>(null);
    const [colunaAlvoId, setColunaAlvoId] = useState<number | null>(null);
    const [colunaArrastadaId, setColunaArrastadaId] = useState<number | null>(null);
    const [adicionandoColuna, setAdicionandoColuna] = useState(false);
    const [nomeNovaColuna, setNomeNovaColuna] = useState('');

    const submeteNovaColuna = async () => { if (!nomeNovaColuna.trim()) return; await criaColuna(nomeNovaColuna); setNomeNovaColuna(''); };

    const etiquetasPorCard = useMemo(() => {
        const porEtiqueta = new Map(etiquetas.registros.map(etiqueta => [etiqueta.id, { cor: etiqueta.cor, corBorda: etiqueta.corBorda }]));
        const mapa = new Map<number, { cor: string; corBorda: string }[]>();
        etiquetasCards.registros.forEach(vinculo => { const dados = porEtiqueta.get(vinculo.fkEtiquetasId); if (dados) mapa.set(vinculo.fkCardsId, [...(mapa.get(vinculo.fkCardsId) ?? []), dados]); });
        return mapa;
    }, [etiquetas.registros, etiquetasCards.registros]);

    const checklistPorCard = useMemo(() => {
        const mapa = new Map<number, { feitos: number; total: number }>();
        itensChecklistQuadro.registros.forEach(item => { if (item.fkCardsId === null) return; const atual = mapa.get(item.fkCardsId) ?? { feitos: 0, total: 0 }; mapa.set(item.fkCardsId, { feitos: atual.feitos + (item.concluido ? 1 : 0), total: atual.total + 1 }); });
        return mapa;
    }, [itensChecklistQuadro.registros]);

    const membrosPorCard = useMemo(() => {
        // Criador primeiro (membro obrigatorio derivado do card); vinculos de membros_cards em seguida, sem duplicar o criador.
        const mapa = new Map<number, { id: number; username: string }[]>();
        cards.registros.forEach(card => mapa.set(card.id, [{ id: card.fkUsuariosCriacaoId, username: card.usuarioCriacao?.username ?? '?' }]));
        membrosCards.registros.forEach(membro => {
            const lista = mapa.get(membro.fkCardsId);
            if (!lista || lista.some(m => m.id === membro.fkUsuariosId)) return;
            lista.push({ id: membro.fkUsuariosId, username: membro.usuario.username });
        });
        return mapa;
    }, [cards.registros, membrosCards.registros]);

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

    if (objetivoAtualId === null) return <section className={styles.painel}><p className={styles.estado}>Selecione um objetivo.</p></section>;

    // Objetivo trancado (Interrompido/Concluido) = quadro somente-leitura: sem criar coluna/card, sem arrastar; tudo permanece visivel.
    const objetivoAtual = objetivos.registros.find(objetivo => objetivo.id === objetivoAtualId) ?? null;
    const motivoTrancaObjetivo = objetivoAtual?.motivoTranca ?? null;
    const travado = motivoTrancaObjetivo !== null;

    // Permissoes do objetivo: criar cartao = criador do objetivo ou usuario com permissao concedida; editar/excluir/permissoes = so o criador. Backend reforca as mesmas regras.
    const ehCriador = usuarioLogado !== null && usuarioLogado?.id === objetivoAtual?.fkUsuariosCriacaoId;
    const podeCriarCard = ehCriador || (usuarioLogado !== null && permissoesObjetivos.registros.some(permissao => permissao.fkObjetivosId === objetivoAtualId && permissao.fkUsuariosId === usuarioLogado.id));
    // Colunas sao globais e estruturais: so o SUDO cria coluna nova.
    const podeCriarColuna = verificarCapacidade(CAPACIDADES.ADMINISTRADOR__SUDO__BURLAR_CAPACIDADES);

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
        <section className={styles.painel}>
            <div className={styles.barraTopo}>
                {travado && <div className={styles.faixaTranca}>🔒 Objetivo {motivoTrancaObjetivo === 'CONCLUIDO' ? 'Concluído' : 'Interrompido'} — somente leitura</div>}
                <BarraView pagina={pagina} setPagina={setPagina} />
            </div>

            <div className={styles.colunas}>
                {colunas.carregando && <p className={styles.estado}>{colunas.carregando}</p>}

                {colunas.registros.map(coluna => (
                    <ColunaQuadro
                        key={coluna.id}
                        coluna={coluna}
                        cards={cards.registros.filter(card => card.fkColunasId === coluna.id)}
                        ehAlvo={colunaAlvoId === coluna.id}
                        cardArrastadoId={cardArrastadoId}
                        salvando={salvando}
                        travado={travado}
                        podeCriarCard={podeCriarCard}
                        etiquetasPorCard={etiquetasPorCard}
                        checklistPorCard={checklistPorCard}
                        membrosPorCard={membrosPorCard}
                        aoIniciarArrasteColuna={() => setColunaArrastadaId(coluna.id)}
                        aoTerminarArrasteColuna={() => setColunaArrastadaId(null)}
                        aoSoltarColuna={() => soltaColuna(coluna.id)}
                        aoEntrarNaLista={() => { if (colunaAlvoId !== coluna.id) setColunaAlvoId(coluna.id); }}
                        aoSoltarNaLista={() => soltaNaColuna(coluna.id)}
                        aoSoltarNoCard={cardId => soltaNoCard(coluna.id, cardId)}
                        aoIniciarArrasteCard={setCardArrastadoId}
                        aoTerminarArrasteCard={encerraArraste}
                        aoAbrirCard={abrirCard}
                        aoCriarCard={titulo => criaCard(coluna.id, titulo)}
                    />
                ))}

                {!travado && podeCriarColuna && <div className={styles.adicionaColuna}>
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
                </div>}
            </div>
        </section>
            </ConteudoForm.AreaCorpo>

            {!travado && ehCriador && (
                <ConteudoForm.AreaBotoes>
                    <button type="button" onClick={() => abrirOperacaoObjetivo('editar-objetivo', objetivoAtualId)} disabled={salvando}>Editar Objetivo</button>
                    <button type="button" onClick={() => abrirOperacaoObjetivo('permissoes-objetivo', objetivoAtualId)} disabled={salvando}>Permissões</button>
                    <button type="button" data-variante="perigo" onClick={() => abrirOperacaoObjetivo('excluir-objetivo', objetivoAtualId)} disabled={salvando}>Excluir Objetivo</button>
                </ConteudoForm.AreaBotoes>
            )}
        </ConteudoForm>
    );
};
