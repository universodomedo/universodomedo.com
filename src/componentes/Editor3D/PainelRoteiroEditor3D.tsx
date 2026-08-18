'use client';

import styles from './PainelRoteiroEditor3D.module.css';

import { useEffect, useState } from 'react';

import type { PassoRoteiroEditor3D, RoteiroEditor3DPersistido, RoteiroEditor3DResumoPersistido } from 'types-nora-api';
import type { ModoRoteiroEditor3D, ResultadoValidacaoRoteiroEditor3D } from './editor3D.roteiro';

// Cadência da reprodução automática: lenta o bastante para o olho acompanhar cada passo aplicando na cena.
const INTERVALO_REPRODUCAO_ROTEIRO_MS = 1200;

interface PainelRoteiroEditor3DProps {
    readonly roteiros: readonly RoteiroEditor3DResumoPersistido[];
    readonly carregandoLista: boolean;
    // Falha ao listar: mostrar o erro em vez de "nenhum roteiro cadastrado", que seria falso.
    readonly erroLista: string | null;
    readonly roteiro: RoteiroEditor3DPersistido | null;
    readonly passos: readonly PassoRoteiroEditor3D[];
    // Rótulo humano DERIVADO por passo (resolvido pelo dono com o estado incremental da reexecução).
    readonly rotulos: readonly string[];
    readonly posicao: number;
    readonly modo: ModoRoteiroEditor3D;
    readonly pendenciaSalvar: boolean;
    readonly salvando: boolean;
    readonly avisoGravacao: string | null;
    readonly falhaExecucao: { readonly indicePasso: number; readonly motivo: string } | null;
    readonly resultadoValidacao: ResultadoValidacaoRoteiroEditor3D | null;
    readonly aoFechar: () => void;
    readonly aoCarregarRoteiro: (idRoteiro: number) => void;
    readonly aoTrocarModo: (modo: ModoRoteiroEditor3D) => void;
    readonly aoIrPara: (posicao: number) => void;
    readonly aoMudarComentario: (indice: number, comentario: string) => void;
    readonly aoSalvarPassos: () => void;
    readonly aoAprovar: () => void;
    readonly aoValidar: () => void;
    // null desbloqueia; texto marca bloqueado (a ferramenta ainda não permite completar o roteiro).
    readonly aoDefinirBloqueio: (motivo: string | null) => void;
};

function seloEstadoResumo(resumo: RoteiroEditor3DResumoPersistido): { rotulo: string; classe: string } {
    if (resumo.bloqueadoMotivo !== null) return { rotulo: 'bloqueado', classe: styles.selo_bloqueado };
    if (resumo.aprovado) return { rotulo: 'aprovado', classe: styles.selo_aprovado };
    return { rotulo: 'em montagem', classe: styles.selo_montagem };
};

function seloResultadoValidacao(resultado: ResultadoValidacaoRoteiroEditor3D): { rotulo: string; classe: string } {
    if (resultado.desfecho === 'VALIDO') return { rotulo: '✓ válido', classe: styles.selo_valido };
    if (resultado.desfecho === 'DIVERGENTE') return { rotulo: `divergente · passo ${resultado.indicePasso + 1}`, classe: styles.selo_divergente };
    return { rotulo: `falhou · passo ${resultado.indicePasso + 1}`, classe: styles.selo_falhou };
};

export function PainelRoteiroEditor3D(props: PainelRoteiroEditor3DProps) {
    // Rascunho do motivo de bloqueio (UI local): null = campo fechado.
    const [motivoBloqueioRascunho, setMotivoBloqueioRascunho] = useState<string | null>(null);

    // Reprodução automática (só VISUALIZACAO): o transporte avançando sozinho em cadência — cada batida reexecuta o
    // prefixo até a posição seguinte, exatamente como o Avançar manual. Pausa ao chegar no fim ou ao sair do modo.
    const [reproduzindo, setReproduzindo] = useState(false);
    const totalExecutavel = props.falhaExecucao !== null ? props.falhaExecucao.indicePasso : props.passos.length;
    const roteiroAberto = props.roteiro !== null;
    const { aoIrPara, modo, posicao } = props;
    useEffect(() => {
        if (!reproduzindo) return;
        if (!roteiroAberto || modo !== 'VISUALIZACAO' || posicao >= totalExecutavel) { setReproduzindo(false); return; }
        const temporizador = setTimeout(() => aoIrPara(posicao + 1), INTERVALO_REPRODUCAO_ROTEIRO_MS);
        return () => clearTimeout(temporizador);
    }, [reproduzindo, roteiroAberto, modo, posicao, totalExecutavel, aoIrPara]);

    if (props.roteiro === null) {
        return (
            <div className={styles.painel_roteiro}>
                <div className={styles.cabeca_roteiro}>
                    <span className={styles.rotulo_painel}>Roteiros</span>
                    <button type="button" className={styles.fechar_painel} onClick={props.aoFechar} title="Fechar painel">✕</button>
                </div>
                {props.carregandoLista
                    ? <div className={styles.carregando_roteiros}>Carregando roteiros…</div>
                    : props.erroLista !== null
                    ? <div className={styles.erro_lista_roteiros}>{props.erroLista}</div>
                    : (
                        <div className={styles.lista_roteiros}>
                            {props.roteiros.length === 0 && <div className={styles.lista_vazia_passos}>Nenhum roteiro cadastrado.</div>}
                            {props.roteiros.map(resumo => {
                                const selo = seloEstadoResumo(resumo);
                                return (
                                    <button key={resumo.id} type="button" className={styles.item_roteiro} onClick={() => props.aoCarregarRoteiro(resumo.id)}>
                                        <span className={styles.nome_item_roteiro}>{resumo.nome}</span>
                                        <span className={styles.detalhe_item_roteiro}><span className={`${styles.selo} ${selo.classe}`}>{selo.rotulo}</span><span>{resumo.quantidadePassos} {resumo.quantidadePassos === 1 ? 'passo' : 'passos'}</span></span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
            </div>
        );
    }

    const roteiro = props.roteiro;
    const emMontagem = props.modo === 'MONTAGEM';

    return (
        <div className={styles.painel_roteiro}>
            <div className={styles.cabeca_roteiro}>
                <span className={styles.rotulo_painel}>Roteiro</span>
                <span className={styles.nome_roteiro} title={roteiro.nome}>{roteiro.nome}</span>
                <button type="button" className={styles.fechar_painel} onClick={props.aoFechar} title="Fechar roteiro">✕</button>
            </div>

            <div className={styles.objetivo_roteiro}>{roteiro.objetivo}</div>

            <div className={styles.selos_roteiro}>
                {roteiro.bloqueadoMotivo !== null && <span className={`${styles.selo} ${styles.selo_bloqueado}`} title={roteiro.bloqueadoMotivo}>bloqueado</span>}
                {roteiro.aprovadoEm !== null && !props.pendenciaSalvar
                    ? <span className={`${styles.selo} ${styles.selo_aprovado}`}>aprovado</span>
                    : <span className={`${styles.selo} ${styles.selo_montagem}`}>em montagem</span>}
                {props.pendenciaSalvar && <span className={`${styles.selo} ${styles.selo_pendencia}`}>passos não salvos</span>}
                {props.resultadoValidacao !== null && (() => { const selo = seloResultadoValidacao(props.resultadoValidacao); return <span className={`${styles.selo} ${selo.classe}`}>{selo.rotulo}</span>; })()}
            </div>

            {roteiro.bloqueadoMotivo !== null && <div className={styles.motivo_bloqueio}>{roteiro.bloqueadoMotivo}</div>}

            <div className={styles.modos_roteiro}>
                <button type="button" className={`${styles.botao_modo} ${emMontagem ? styles.ativo : ''}`} onClick={() => props.aoTrocarModo('MONTAGEM')}>Montagem</button>
                {/* Visualização mostra o roteiro COMO ESTÁ NO SERVIDOR; com passos não salvos a lista e o Validar
                    falariam de sequências diferentes, então a troca só libera depois de salvar. */}
                <button type="button" className={`${styles.botao_modo} ${!emMontagem ? styles.ativo : ''}`} disabled={props.pendenciaSalvar} title={props.pendenciaSalvar ? 'Salve os passos para ver o roteiro como está no servidor' : undefined} onClick={() => props.aoTrocarModo('VISUALIZACAO')}>Visualização</button>
            </div>

            {props.avisoGravacao !== null && <div className={styles.aviso_gravacao}>{props.avisoGravacao}</div>}

            <div className={styles.lista_passos}>
                {props.passos.length === 0 && <div className={styles.lista_vazia_passos}>{emMontagem ? 'Opere no editor: cada operação do vocabulário vira um passo.' : 'Roteiro sem passos.'}</div>}
                {props.passos.map((passo, indice) => {
                    const numero = indice + 1;
                    const atual = numero === props.posicao;
                    const comFalha = props.falhaExecucao !== null && props.falhaExecucao.indicePasso === indice;
                    const futuro = numero > props.posicao && !comFalha;
                    const podeIr = numero <= totalExecutavel;
                    // A chave carrega a identidade da operação: truncar e regravar no mesmo índice tem que recriar o campo
                    // de comentário (defaultValue não re-aplica em nó reusado), senão o passo novo herda o texto do velho.
                    const chave = `${indice}-${passo.operacao.tipo}-${'idObjeto' in passo.operacao ? passo.operacao.idObjeto : 0}`;
                    return (
                        <div key={chave} className={`${styles.passo} ${atual ? styles.atual : ''} ${futuro ? styles.futuro : ''} ${comFalha ? styles.com_falha : ''}`} onClick={() => podeIr && props.aoIrPara(numero)}>
                            <div className={styles.linha_passo}><span className={styles.numero_passo}>{numero}</span><span>{props.rotulos[indice] ?? '—'}</span></div>
                            {comFalha && <div className={styles.motivo_falha_passo}>{props.falhaExecucao?.motivo}</div>}
                            {atual && emMontagem
                                ? <input type="text" className={styles.campo_comentario_passo} defaultValue={passo.comentario ?? ''} maxLength={400} placeholder="O que este passo prova" onClick={evento => evento.stopPropagation()} onKeyDown={evento => { evento.stopPropagation(); if (evento.key === 'Enter') evento.currentTarget.blur(); }} onBlur={evento => props.aoMudarComentario(indice, evento.target.value)} />
                                : passo.comentario !== undefined && passo.comentario.length > 0 && <div className={styles.comentario_passo}>{passo.comentario}</div>}
                        </div>
                    );
                })}
            </div>

            <div className={styles.rodape_roteiro}>
                <div className={styles.transporte}>
                    <button type="button" className={styles.botao_transporte} title="Início" disabled={props.posicao === 0} onClick={() => props.aoIrPara(0)}>⏮</button>
                    <button type="button" className={styles.botao_transporte} title="Retroceder" disabled={props.posicao === 0} onClick={() => props.aoIrPara(props.posicao - 1)}>◀</button>
                    <button type="button" className={styles.botao_transporte} title="Avançar" disabled={props.posicao >= totalExecutavel} onClick={() => props.aoIrPara(props.posicao + 1)}>▶</button>
                    <button type="button" className={styles.botao_transporte} title="Fim" disabled={props.posicao >= totalExecutavel} onClick={() => props.aoIrPara(totalExecutavel)}>⏭</button>
                    <span className={styles.posicao_roteiro}>{props.posicao} / {props.passos.length}</span>
                </div>
                {emMontagem
                    ? (
                        <>
                            {roteiro.bloqueadoMotivo !== null
                                ? <button type="button" className={`${styles.botao_acao_roteiro} ${styles.secundario}`} onClick={() => props.aoDefinirBloqueio(null)} title={roteiro.bloqueadoMotivo}>Desbloquear</button>
                                : motivoBloqueioRascunho === null
                                    ? <button type="button" className={`${styles.botao_acao_roteiro} ${styles.secundario}`} onClick={() => setMotivoBloqueioRascunho('')} title="A ferramenta ainda não permite completar este roteiro">Marcar bloqueado…</button>
                                    : (
                                        <div className={styles.bloco_bloqueio}>
                                            <input type="text" className={styles.campo_motivo_bloqueio} autoFocus value={motivoBloqueioRascunho} maxLength={400} placeholder="O que falta na ferramenta" onKeyDown={evento => evento.stopPropagation()} onChange={evento => setMotivoBloqueioRascunho(evento.target.value)} />
                                            <button type="button" className={`${styles.botao_acao_roteiro} ${styles.secundario}`} disabled={motivoBloqueioRascunho.trim().length === 0} onClick={() => { props.aoDefinirBloqueio(motivoBloqueioRascunho.trim()); setMotivoBloqueioRascunho(null); }}>Confirmar bloqueio</button>
                                        </div>
                                    )}
                            <button type="button" className={`${styles.botao_acao_roteiro} ${styles.secundario}`} disabled={!props.pendenciaSalvar || props.salvando} onClick={props.aoSalvarPassos}>{props.salvando ? 'Salvando…' : 'Salvar passos'}</button>
                            <button type="button" className={styles.botao_acao_roteiro} disabled={props.passos.length === 0 || props.falhaExecucao !== null || props.salvando} onClick={props.aoAprovar} title="Reexecuta do zero e grava o resultado aprovado">Aprovar resultado</button>
                        </>
                    )
                    : (
                        <>
                            <button type="button" className={`${styles.botao_acao_roteiro} ${styles.secundario}`} disabled={totalExecutavel === 0} title="Reexecuta os passos em cadência, como demonstração ao vivo" onClick={() => { if (reproduzindo) { setReproduzindo(false); return; } if (props.posicao >= totalExecutavel) props.aoIrPara(0); setReproduzindo(true); }}>{reproduzindo ? 'Pausar' : 'Reproduzir'}</button>
                            <button type="button" className={styles.botao_acao_roteiro} disabled={roteiro.golden === null || props.salvando} onClick={props.aoValidar} title={roteiro.golden === null ? 'Sem resultado aprovado para comparar' : 'Reexecuta do zero e compara com o aprovado'}>Validar</button>
                        </>
                    )}
            </div>
        </div>
    );
};