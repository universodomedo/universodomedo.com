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
    const { pagina, setPagina, objetivos, objetivoAtualId, colunas, cards, todosCards, abrirCard, salvando, criaColuna, criaCard, reordenaCards, reordenaColunas, etiquetas, etiquetasCards, membrosCards, itensChecklistQuadro, permissoesObjetivos, abrirOperacaoObjetivo } = useContexto__PaginaColaboradorPainelDoMedo();
    const { usuarioLogado, verificarCapacidade } = useContextoAutenticacao();

    const [cardArrastadoId, setCardArrastadoId] = useState<number | null>(null);
    const [colunaAlvoId, setColunaAlvoId] = useState<number | null>(null);
    // Ponto exato de insercao do arraste (indicador visual + drop): antesDoCardId = cartao diante do qual o arrastado entra; null = fim da coluna.
    const [alvoInsercao, setAlvoInsercao] = useState<{ colunaId: number; antesDoCardId: number | null } | null>(null);
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
        // Item que referencia um cartao: "feito" deriva do cartao referenciado estar CONCLUIDO (cross-objetivo via todosCards); os demais usam o concluido manual.
        const trancaPorCard = new Map(todosCards.registros.map(card => [card.id, card.motivoTranca]));
        const mapa = new Map<number, { feitos: number; total: number }>();
        itensChecklistQuadro.registros.forEach(item => {
            if (item.fkCardsId === null) return;
            const feito = item.fkCardsReferenciaId !== null ? trancaPorCard.get(item.fkCardsReferenciaId) === 'CONCLUIDO' : item.concluido;
            const atual = mapa.get(item.fkCardsId) ?? { feitos: 0, total: 0 };
            mapa.set(item.fkCardsId, { feitos: atual.feitos + (feito ? 1 : 0), total: atual.total + 1 });
        });
        return mapa;
    }, [itensChecklistQuadro.registros, todosCards.registros]);

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

    const encerraArraste = () => { setCardArrastadoId(null); setColunaAlvoId(null); setAlvoInsercao(null); };
    const idsDaColuna = (colunaId: number) => cards.registros.filter(card => card.fkColunasId === colunaId && card.id !== cardArrastadoId).map(card => card.id);

    // Ponto de insercao reportado pelo dragover da lista (calculo estavel por meio-de-cartao no ColunaQuadro). Preserva identidade do estado (dragover dispara em rajada).
    const arrastaSobre = (colunaId: number, antesDoCardId: number | null) => {
        if (cardArrastadoId === null) return;
        if (colunaAlvoId !== colunaId) setColunaAlvoId(colunaId);
        setAlvoInsercao(atual => atual?.colunaId === colunaId && atual?.antesDoCardId === antesDoCardId ? atual : { colunaId, antesDoCardId });
    };

    // Drop unificado: usa o ponto de insercao rastreado pelo indicador (fallback: fim da coluna).
    const soltaCard = (colunaId: number) => {
        if (cardArrastadoId === null) return encerraArraste();
        const ids = idsDaColuna(colunaId);
        const antesDoCardId = alvoInsercao?.colunaId === colunaId ? alvoInsercao.antesDoCardId : null;
        const indice = antesDoCardId === null ? ids.length : ids.indexOf(antesDoCardId);
        ids.splice(indice === -1 ? ids.length : indice, 0, cardArrastadoId);
        // Soltar sem mudar nada (mesma coluna, mesma posicao) NAO deve chamar a API: reordenaCards emitiria painelAtualizado (refetch geral) por um no-op. Compara com a ordem atual da coluna.
        const ordemAtual = cards.registros.filter(card => card.fkColunasId === colunaId).map(card => card.id);
        const mudou = ids.length !== ordemAtual.length || ids.some((id, i) => id !== ordemAtual[i]);
        if (mudou) reordenaCards(colunaId, ids);
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
                        aoSoltarNaLista={() => soltaCard(coluna.id)}
                        aoSoltarNoCard={() => soltaCard(coluna.id)}
                        aoArrastarSobreLista={antesDoCardId => arrastaSobre(coluna.id, antesDoCardId)}
                        insercaoAntesDoCardId={alvoInsercao?.colunaId === coluna.id && cardArrastadoId !== null ? alvoInsercao.antesDoCardId : undefined}
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
                </ConteudoForm.AreaBotoes>
            )}
        </ConteudoForm>
    );
};
