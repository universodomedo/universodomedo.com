'use client';

import { useRouter } from 'next/navigation';

import styles from './PainelResumoPainelDoMedo.module.css';

import { useContextoResumoPainelDoMedo } from 'Contextos/ContextoResumoPainelDoMedo/contexto';
import RefsDeCartao, { navegarParaCardPainelDoMedo } from 'Componentes/ElementosVisuais/RefsDeCartao/RefsDeCartao';

const formataData = (iso: string) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

// Janela de resumo do Painel do Medo (aberta pela BarraAcoesFlutuante): cartões que participo, atividade recente e marcações recebidas, com navegação direta até o cartão.
export default function PainelResumoPainelDoMedo() {
    const { painelAberto, fecharPainel, resumo, carregando } = useContextoResumoPainelDoMedo();
    const router = useRouter();

    if (!painelAberto) return null;

    const abrirCartao = (cardId: number) => { navegarParaCardPainelDoMedo(cardId, router); fecharPainel(); };
    const ativos = resumo?.cartoes.filter(cartao => cartao.motivoTranca === null).length ?? 0;
    const concluidos = resumo?.cartoes.filter(cartao => cartao.motivoTranca === 'CONCLUIDO').length ?? 0;

    return (
        <div className={styles.painelResumo}>
            <header className={styles.cabecalho}>
                <span className={styles.titulo}>Painel do Medo</span>
                <button className={styles.fechar} onClick={fecharPainel} title="Fechar">✕</button>
            </header>

            {carregando && !resumo && <p className={styles.estado}>Carregando resumo…</p>}

            {resumo && (
                <div className={styles.corpo}>
                    <div className={styles.linhaTotais}>
                        <span className={styles.chipTotal}>{ativos} ativo{ativos === 1 ? '' : 's'}</span>
                        <span className={`${styles.chipTotal} ${styles.chipTotalConcluido}`}>{concluidos} concluído{concluidos === 1 ? '' : 's'}</span>
                    </div>

                    <section className={styles.secao}>
                        <span className={styles.rotuloSecao}>Meus cartões</span>
                        {resumo.cartoes.length === 0 && <p className={styles.estado}>Você ainda não participa de nenhum cartão.</p>}
                        {resumo.cartoes.map(cartao => (
                            <button key={cartao.id} className={styles.itemCartao} onClick={() => abrirCartao(cartao.id)} title={`Abrir cartão #${cartao.id}`}>
                                <span className={styles.tituloCartao}>{cartao.motivoTranca !== null ? '🔒 ' : ''}{cartao.titulo}</span>
                                <span className={styles.detalheCartao}>{cartao.objetivoNome} · {cartao.colunaNome}{cartao.criador ? ' · criador' : ''}</span>
                            </button>
                        ))}
                    </section>

                    <section className={styles.secao}>
                        <span className={styles.rotuloSecao}>Atividade recente</span>
                        {resumo.atividades.length === 0 && <p className={styles.estado}>Sem atividade nos seus cartões.</p>}
                        {resumo.atividades.map((atividade, indice) => (
                            <div key={indice} className={styles.itemAtividade} title={new Date(atividade.data).toLocaleString('pt-BR')}>
                                <span className={styles.linhaAtividade}><strong>{atividade.username}</strong> · {atividade.texto}</span>
                                <button className={styles.refCartao} onClick={() => abrirCartao(atividade.cardId)} title={`Abrir cartão #${atividade.cardId}`}>{atividade.cardTitulo}</button>
                            </div>
                        ))}
                    </section>

                    <section className={styles.secao}>
                        <span className={styles.rotuloSecao}>Minhas marcações</span>
                        {resumo.marcacoes.length === 0 && <p className={styles.estado}>Nenhuma marcação recebida.</p>}
                        {resumo.marcacoes.map((marcacao, indice) => (
                            <div key={indice} className={styles.itemMarcacao} title={new Date(marcacao.data).toLocaleString('pt-BR')}>
                                <span className={styles.tituloMarcacao}>{marcacao.titulo} · {formataData(marcacao.data)}</span>
                                <span className={styles.mensagemMarcacao}><RefsDeCartao texto={marcacao.mensagem} aoNavegar={fecharPainel} /></span>
                            </div>
                        ))}
                    </section>

                    <button className={styles.abrirPainel} onClick={() => { router.push('/minhas-paginas/colaborador/painel-do-medo'); fecharPainel(); }}>Abrir Painel do Medo</button>
                </div>
            )}
        </div>
    );
};
