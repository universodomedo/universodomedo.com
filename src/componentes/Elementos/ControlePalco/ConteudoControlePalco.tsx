'use client';

import styles from './PainelControlePalco.module.css';

import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { Eventos_Emite, Eventos_EnviaERecebe, type EMIT__Palco_diagnosticoAudio, type EMIT__Palco_encerrado, type EMIT__Palco_estadoAtualizado, type PalcoAudioDiagnosticoItem, type PalcoEstadoDto, type PalcoParticipanteDto, type PalcoParticipantePapel, type RESPONSE__Palco_definirPapel, type RESPONSE__Palco_finalizar, type RESPONSE__Palco_remover, type WsErrorResponse } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';
import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { selectNivelVolumeEfetivo, selectPalcoNaCentral, selectSilencioBloqueado } from 'Redux/selectors/audioPaginaSelectors';
import { setNivelVolume, setPalcoNaCentral } from 'Redux/slices/audioPaginaSlice';
import { salvarNivelVolume } from 'Uteis/PreferenciaVolume/preferenciaVolume';
import { useContextoControlePalco } from 'Contextos/ContextoControlePalco/contexto';
// Utilitário registrado (não o hook): o painel monta pela BarraAcoesFlutuante, FORA do ContextoCopiarParaClipboardProvider.
import { copiarParaClipboard } from 'Uteis/copiarParaClipboard/copiarParaClipboard';
import SeletorNivelVolume from 'Componentes/Elementos/CentralAudio/SeletorNivelVolume';

function verificarEstadoWs(codigoPalco: string): Promise<PalcoEstadoDto> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.verificarEstado, { codigoPalco }, { onSuccess: (response: PalcoEstadoDto) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function definirPapelWs(codigoPalco: string, idUsuario: number, papel: PalcoParticipantePapel): Promise<RESPONSE__Palco_definirPapel> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.definirPapel, { codigoPalco, idUsuario, papel }, { onSuccess: (response: RESPONSE__Palco_definirPapel) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function removerWs(codigoPalco: string, idUsuario: number): Promise<RESPONSE__Palco_remover> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.remover, { codigoPalco, idUsuario }, { onSuccess: (response: RESPONSE__Palco_remover) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function finalizarWs(codigoPalco: string): Promise<RESPONSE__Palco_finalizar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.finalizar, { codigoPalco }, { onSuccess: (response: RESPONSE__Palco_finalizar) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

const ROTULOS_SECOES: Record<PalcoParticipantePapel, string> = { falante: 'Participando', ouvinte: 'Assistindo', aguardando: 'Em Espera' };
const ORDEM_SECOES: PalcoParticipantePapel[] = ['falante', 'ouvinte', 'aguardando'];

// Um problema de áudio digno do bloco de erros: erro reportado, ou falante cujo mic não está capturando.
function problemaDoParticipante(item: PalcoAudioDiagnosticoItem): string | null {
    if (item.erroRecente) return item.erroRecente;
    if (item.papel === 'falante' && item.microfoneEstado !== 'capturando') return `microfone ${item.microfoneEstado ?? 'sem estado'}`;
    return null;
};

// Controle de Palco resumido (persistente entre páginas): papéis, erros de áudio, volume e ações do palco.
// Só monta com o painel aberto; verificarEstado inscreve o socket na room de comando e o estado passa a chegar por push.
export default function ConteudoControlePalco() {
    const dispatch = useAppDispatch();
    const { palcosComandaveis, codigoSelecionado, selecionarPalco, fecharPainel } = useContextoControlePalco();
    const palcoNaCentral = useAppSelector(selectPalcoNaCentral);
    const nivelVolume = useAppSelector(selectNivelVolumeEfetivo);
    const silencioBloqueado = useAppSelector(selectSilencioBloqueado);

    const [estado, setEstado] = useState<PalcoEstadoDto | null>(null);
    const [diagnostico, setDiagnostico] = useState<PalcoAudioDiagnosticoItem[]>([]);
    const [processando, setProcessando] = useState(false);
    const [erroComando, setErroComando] = useState<string | null>(null);

    // Troca de palco selecionado: snapshot novo + join na room de comando (o push assume a partir daí).
    useEffect(() => {
        if (!codigoSelecionado) return;
        setEstado(null);
        setDiagnostico([]);
        setErroComando(null);
        verificarEstadoWs(codigoSelecionado).then(s => { setEstado(s); }).catch(() => {});
    }, [codigoSelecionado]);

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.estadoAtualizado, {
        onSuccess: (data: EMIT__Palco_estadoAtualizado) => { if (data.codigoPalco === codigoSelecionado) setEstado(data); },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.diagnosticoAudio, {
        onSuccess: (data: EMIT__Palco_diagnosticoAudio) => { if (data.codigoPalco === codigoSelecionado) setDiagnostico(data.participantes); },
    });

    useRecebeEmitWs(Eventos_Emite.Palco.eventos.encerrado, {
        onSuccess: (data: EMIT__Palco_encerrado) => { if (data.codigoPalco === codigoSelecionado) setEstado(atual => atual ? { ...atual, ativo: false } : atual); },
    });

    const executarComando = useCallback(async (acao: () => Promise<RESPONSE__Palco_definirPapel | RESPONSE__Palco_remover | RESPONSE__Palco_finalizar>): Promise<void> => {
        if (processando) return;
        setProcessando(true);
        setErroComando(null);
        try {
            await acao();
        } catch (e) {
            setErroComando(e instanceof Error ? e.message : (e as WsErrorResponse).mensagem ?? 'Erro desconhecido.');
        } finally {
            setProcessando(false);
        }
    }, [processando]);

    const handleDefinirPapel = useCallback((idUsuario: number, papel: PalcoParticipantePapel) => {
        if (!codigoSelecionado) return;
        executarComando(() => definirPapelWs(codigoSelecionado, idUsuario, papel)).catch(() => {});
    }, [executarComando, codigoSelecionado]);

    const handleRemover = useCallback((idUsuario: number) => {
        if (!codigoSelecionado) return;
        executarComando(() => removerWs(codigoSelecionado, idUsuario)).catch(() => {});
    }, [executarComando, codigoSelecionado]);

    const handleFinalizar = useCallback(() => {
        if (!codigoSelecionado) return;
        executarComando(() => finalizarWs(codigoSelecionado)).catch(() => {});
    }, [executarComando, codigoSelecionado]);

    const ouvirPelaCentral = useCallback(() => {
        if (!codigoSelecionado || !estado) return;
        dispatch(setPalcoNaCentral({ codigoPalco: codigoSelecionado, titulo: estado.nome || `Palco de ${estado.nomeDono}`, papel: null }));
    }, [dispatch, codigoSelecionado, estado]);

    const compartilharLink = useCallback(() => {
        if (!codigoSelecionado) return;
        copiarParaClipboard(`${window.location.origin}/palco?codigoPalco=${codigoSelecionado}`).catch(() => {});
    }, [codigoSelecionado]);

    const participantesPorPapel = (papel: PalcoParticipantePapel): PalcoParticipanteDto[] => estado?.participantes.filter(p => p.papel === papel) ?? [];
    const problemas = diagnostico.map(item => ({ item, problema: problemaDoParticipante(item) })).filter(entrada => entrada.problema !== null);
    const palcoAtivo = estado?.ativo ?? false;
    const estaNaCentral = palcoNaCentral?.codigoPalco === codigoSelecionado;

    return (
        <div className={styles.painel}>
            <div className={styles.cabecalho}>
                <span className={styles.titulo_painel}>Controle de Palco</span>
                <button className={styles.fechar} onClick={fecharPainel} title="Fechar">✕</button>
            </div>

            {palcosComandaveis.length > 1 && (
                <div className={styles.seletor_palcos}>
                    {palcosComandaveis.map(palco => (
                        <button key={palco.codigoPalco} className={cn(styles.aba_palco, palco.codigoPalco === codigoSelecionado && styles.aba_palco_ativa)} onClick={() => { selecionarPalco(palco.codigoPalco); }}>
                            {palco.nome || `Palco de ${palco.nomeDono}`}
                        </button>
                    ))}
                </div>
            )}

            {!estado && <p className={styles.vazio}>Carregando o palco...</p>}

            {estado && (
                <>
                    <div className={styles.identidade}>
                        <span className={styles.nome_palco}>{estado.nome || `Palco de ${estado.nomeDono}`}</span>
                        <span className={cn(styles.status, palcoAtivo && styles.status_ativo)}>{palcoAtivo ? '● Ativo' : '○ Finalizado'}</span>
                    </div>

                    {erroComando && <p className={styles.erro}>{erroComando}</p>}

                    {palcoAtivo && ORDEM_SECOES.map(papel => {
                        const participantes = participantesPorPapel(papel);
                        return (
                            <section key={papel} className={styles.secao}>
                                <div className={styles.secao_cabecalho}>
                                    <span className={styles.secao_titulo}>{ROTULOS_SECOES[papel]}</span>
                                    <span className={styles.secao_contador}>({participantes.length})</span>
                                </div>
                                {participantes.length === 0
                                    ? <p className={styles.vazio}>Ninguém aqui</p>
                                    : participantes.map(p => (
                                        <div key={p.idUsuario} className={styles.participante}>
                                            <span className={styles.participante_nome}>{p.nome}</span>
                                            <div className={styles.participante_acoes}>
                                                {papel !== 'falante' && <button className={styles.acao} disabled={processando} onClick={() => { handleDefinirPapel(p.idUsuario, 'falante'); }}>Falante</button>}
                                                {papel !== 'ouvinte' && <button className={styles.acao} disabled={processando} onClick={() => { handleDefinirPapel(p.idUsuario, 'ouvinte'); }}>Ouvinte</button>}
                                                {papel !== 'aguardando' && <button className={styles.acao} disabled={processando} onClick={() => { handleDefinirPapel(p.idUsuario, 'aguardando'); }}>Espera</button>}
                                                <button className={cn(styles.acao, styles.acao_perigo)} disabled={processando} onClick={() => { handleRemover(p.idUsuario); }}>Remover</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </section>
                        );
                    })}

                    {palcoAtivo && problemas.length > 0 && (
                        <section className={styles.secao}>
                            <div className={styles.secao_cabecalho}>
                                <span className={cn(styles.secao_titulo, styles.secao_titulo_erro)}>Erros de áudio</span>
                                <span className={styles.secao_contador}>({problemas.length})</span>
                            </div>
                            {problemas.map(({ item, problema }) => (
                                <p key={item.idUsuario} className={styles.problema}><strong>{item.nome}</strong> — {problema}</p>
                            ))}
                        </section>
                    )}

                    <div className={styles.volume}>
                        <SeletorNivelVolume nivel={nivelVolume} silencioBloqueado={silencioBloqueado} onSelecionarNivel={nivel => { dispatch(setNivelVolume(nivel)); salvarNivelVolume(nivel); }} />
                    </div>

                    {palcoAtivo && (
                        <div className={styles.acoes_palco}>
                            {!estaNaCentral && <button className={styles.acao} onClick={ouvirPelaCentral}>Ouvir pela Central</button>}
                            {estaNaCentral && <span className={styles.na_central}>Tocando na Central</span>}
                            <button className={styles.acao} onClick={compartilharLink}>Compartilhar link</button>
                            <button className={cn(styles.acao, styles.acao_perigo)} disabled={processando} onClick={handleFinalizar}>{processando ? 'Aguarde...' : 'Finalizar palco'}</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
