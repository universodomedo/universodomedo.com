'use client';

import styles from './PainelCentralAudio.module.css';

import { useEffect, useState } from 'react';
import { Eventos_Emite, Eventos_EnviaERecebe, type EMIT__Palco_palcosAtualizados, type PalcoResumoDto, type RESPONSE__Palco_listarAtivos, type RESPONSE__Palco_pararDeFalar, type RESPONSE__Palco_sairDoAudio, type WsErrorResponse } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs } from 'Hooks/useEventoWs';
import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { selectIdMusicaPaginaAtual, selectIdMusicaPausadaPeloPalco, selectNivelVolumeEfetivo, selectPalcoNaCentral, selectSilencioBloqueado, selectTituloPaginaAtual } from 'Redux/selectors/audioPaginaSelectors';
import { limparPalcoNaCentral, setNivelVolume, setPalcoNaCentral } from 'Redux/slices/audioPaginaSlice';
import { salvarNivelVolume } from 'Uteis/PreferenciaVolume/preferenciaVolume';
import SeletorNivelVolume from './SeletorNivelVolume';

const SELECT_MUSICA = { id: true, nome: true, fonteMusica: { id: true, nome: true } } as const;

function listarPalcosAtivosWs(): Promise<RESPONSE__Palco_listarAtivos> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.listarAtivos, {}, { onSuccess: (response: RESPONSE__Palco_listarAtivos) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function pararDeFalarWs(codigoPalco: string): Promise<RESPONSE__Palco_pararDeFalar> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.pararDeFalar, { codigoPalco }, { onSuccess: (response: RESPONSE__Palco_pararDeFalar) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function sairDoAudioWs(codigoPalco: string): Promise<RESPONSE__Palco_sairDoAudio> {
    return new Promise((resolve, reject) => {
        eventoWs(Eventos_EnviaERecebe.Palco.eventos.sairDoAudio, { codigoPalco }, { onSuccess: (response: RESPONSE__Palco_sairDoAudio) => { resolve(response); }, onError: (error: WsErrorResponse) => { reject(error); }, timeoutMs: 8000 });
    });
};

function tituloDoPalco(palco: PalcoResumoDto): string { return palco.nome || `Palco de ${palco.nomeDono}`; };

// Conteúdo da Central de Áudio — só monta quando o painel está aberto (nunca no SSR), por isso pode usar GraphQL/Redux/WS com segurança.
export default function ConteudoCentralAudio({ onFechar, onAtividade }: { onFechar: () => void; onAtividade: () => void }) {
    const dispatch = useAppDispatch();
    const idMusica = useAppSelector(selectIdMusicaPaginaAtual);
    const idMusicaPausada = useAppSelector(selectIdMusicaPausadaPeloPalco);
    const palcoNaCentral = useAppSelector(selectPalcoNaCentral);
    const tituloPagina = useAppSelector(selectTituloPaginaAtual);
    const nivelVolume = useAppSelector(selectNivelVolumeEfetivo);
    const silencioBloqueado = useAppSelector(selectSilencioBloqueado);

    // Eventos ao vivo: carrega ao abrir o painel e acompanha o broadcast de palcos.
    const [palcosAoVivo, setPalcosAoVivo] = useState<PalcoResumoDto[]>([]);
    useEffect(() => { listarPalcosAtivosWs().then(r => { setPalcosAoVivo(r.palcos); }).catch(() => {}); }, []);
    useRecebeEmitWs(Eventos_Emite.Palco.eventos.palcosAtualizados, { onSuccess: (data: EMIT__Palco_palcosAtualizados) => { setPalcosAoVivo(data.palcos); } });

    const ouvirPalco = (palco: PalcoResumoDto): void => { dispatch(setPalcoNaCentral({ codigoPalco: palco.codigoPalco, titulo: tituloDoPalco(palco), papel: null })); };

    // Self-service pela Central: parar de falar rebaixa a ouvinte (o token novo chega por emit); sair remove a camada na hora.
    const pararDeFalar = (): void => { if (palcoNaCentral) pararDeFalarWs(palcoNaCentral.codigoPalco).catch(() => {}); };
    const sairDoPalco = (): void => {
        if (!palcoNaCentral) return;
        sairDoAudioWs(palcoNaCentral.codigoPalco).catch(() => {});
        dispatch(limparPalcoNaCentral());
    };

    // Com palco na Central a música efetiva pausa; a consulta segue na faixa pausada para exibi-la como camada inferior.
    const idMusicaExibida = idMusica ?? idMusicaPausada;

    const consulta = useNoraGraphQLRegistro('MusicaConfigurada', { props: { idMusica: idMusicaExibida ?? 0 }, pk: idMusicaExibida ?? 0, select: SELECT_MUSICA, mensagemErro: 'Não foi possível carregar a música atual', executarAoMontar: false });
    const recarregar = consulta.recarregar;

    useEffect(() => {
        if (idMusicaExibida == null) return;
        recarregar();
    }, [idMusicaExibida, recarregar]);

    const musica = idMusicaExibida != null ? consulta.data : null;
    const palcosParaOuvir = palcosAoVivo.filter(p => p.codigoPalco !== palcoNaCentral?.codigoPalco);

    return (
        <div className={styles.painel} onMouseMove={onAtividade}>
            <div className={styles.linha_principal}>
                <div className={styles.info}>
                    {palcoNaCentral && (
                        <>
                            <span className={styles.rotulo}>Ao vivo · {palcoNaCentral.titulo}</span>
                            {palcoNaCentral.papel === 'falante' && <span className={styles.falando}>Você está falando</span>}
                            <div className={styles.acoes_palco}>
                                {palcoNaCentral.papel === 'falante' && <button className={styles.acao_palco} onClick={pararDeFalar}>Parar de falar</button>}
                                <button className={styles.acao_palco} onClick={sairDoPalco}>Parar de ouvir</button>
                            </div>
                        </>
                    )}
                    {musica ? (
                        <>
                            <span className={styles.rotulo}>{palcoNaCentral ? 'Pausada · volta quando o palco sair' : `Tocando · ${tituloPagina}`}</span>
                            <span className={styles.faixa}>{musica.nome} — {musica.fonteMusica.nome}</span>
                        </>
                    ) : (
                        !palcoNaCentral && <span className={styles.vazio}>Nenhuma música tocando</span>
                    )}
                </div>

                <div className={styles.volume}>
                    <SeletorNivelVolume nivel={nivelVolume} silencioBloqueado={silencioBloqueado} onSelecionarNivel={nivel => { dispatch(setNivelVolume(nivel)); salvarNivelVolume(nivel); }} />
                </div>

                <button className={styles.fechar} onClick={onFechar} title="Fechar">✕</button>
            </div>

            {palcosParaOuvir.length > 0 && (
                <div className={styles.ao_vivo}>
                    <span className={styles.rotulo}>Eventos ao vivo</span>
                    {palcosParaOuvir.map(palco => (
                        <div key={palco.codigoPalco} className={styles.ao_vivo_item}>
                            <span className={styles.ao_vivo_nome}>{tituloDoPalco(palco)}</span>
                            <span className={styles.ao_vivo_detalhe}>{palco.nomeDono} · {palco.totalParticipantes} presente{palco.totalParticipantes === 1 ? '' : 's'}</span>
                            <button className={styles.acao_palco} onClick={() => { ouvirPalco(palco); }}>Ouvir</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
